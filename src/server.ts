import express, { Request, Response } from "express";
import dotenv from "dotenv";
// import multer from 'multer'; // Will be used for reference image uploads
import { Stagehand } from "@browserbasehq/stagehand";
import {
  getAllWorkers,
  getWorkerById,
  getWorkerPoolStats,
  updateWorkerAuth,
  markWorkerUnhealthy,
  getAvailableWorker,
  markWorkerBusy,
  markWorkerAvailable,
} from "./lib/workerPool";
import {
  createSessionWithContext,
  getLiveViewUrl,
  initializeStagehand,
  createContext,
  createBrowserbaseClient,
} from "./lib/browserUtils";
import * as actions from "./lib/actions";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "running",
    service: "dobby",
    message: "Dobby is running.",
    timestamp: new Date().toISOString(),
  });
});

// GET /workers - List all workers and their status
app.get("/workers", (_req: Request, res: Response) => {
  try {
    const workers = getAllWorkers();
    const stats = getWorkerPoolStats();

    res.json({
      success: true,
      workers,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting workers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve workers",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /workers/:workerId/authenticate - Creates a Browserbase session for manual authentication
app.post(
  "/workers/:workerId/authenticate",
  async (req: Request, res: Response) => {
    const { workerId } = req.params;

    try {
      const worker = getWorkerById(workerId);
      if (!worker) {
        res.status(404).json({
          success: false,
          message: `Worker ${workerId} not found`,
        });
        return;
      }

      let contextId = worker.contextId;
      let newContextCreated = false; // temp until we push the workers to metadata tables

      // If no context ID, create a new context
      if (contextId === null) {
        console.log(`🔄 Creating new Browserbase context for ${workerId}...`);
        const context = await createContext();
        contextId = context.id;
        newContextCreated = true;
        console.log(`✅ New context created: ${contextId}`);
      }

      // Create session with context for authentication
      const session = await createSessionWithContext(contextId, {
        persist: true, // Save authentication state back to context
        keepAlive: true, // 30 minutes for manual login
      });

      // Get Live View URL for manual authentication
      const liveViewUrl = await getLiveViewUrl(session.id);

      console.log(`🔍 Authentication session created for ${workerId}`);
      console.log(`Session ID: ${session.id}`);
      console.log(`Live View URL: ${liveViewUrl}`);
      console.log(`Context ID: ${contextId}`);

      const instructions = [
        "1. Open the Live View URL in your browser",
        "2. Navigate to https://labs.google/fx/tools/flow",
        "3. Log in with the corresponding Google account",
        "4. Complete any 2FA if required",
        "5. The context will automatically save your authentication state",
      ];

      if (newContextCreated) {
        instructions.push(
          "6. IMPORTANT: Update src/config/workers.ts with the new contextId shown below",
          "7. Use the verify endpoint to test if authentication worked"
        );
      } else {
        instructions.push(
          "6. Use the verify endpoint to test if authentication worked"
        );
      }

      res.json({
        success: true,
        message: `Authentication session created for ${workerId}`,
        sessionId: session.id,
        liveViewUrl,
        contextId,
        newContextCreated,
        manualUpdateRequired: newContextCreated,
        updateInstructions: newContextCreated
          ? {
              file: "src/config/workers.ts",
              update: `Change contextId for ${workerId} from null to "${contextId}"`,
            }
          : null,
        instructions,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        `Error creating authentication session for ${workerId}:`,
        error
      );
      res.status(500).json({
        success: false,
        message: `Failed to create authentication session for ${workerId}`,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// POST /workers/:workerId/verify - Tests if worker's browserbase context is still authenticated
app.post("/workers/:workerId/verify", async (req: Request, res: Response) => {
  const { workerId } = req.params;
  let stagehand: Stagehand | null = null;

  try {
    const worker = getWorkerById(workerId);
    if (!worker) {
      res.status(404).json({
        success: false,
        message: `Worker ${workerId} not found`,
      });
      return;
    }

    console.log(`🔍 Verifying authentication for ${workerId}...`);

    // Check if worker has a context ID
    if (worker.contextId === null) {
      res.status(400).json({
        success: false,
        message: `Worker ${workerId} has no context ID. Please authenticate first using /workers/${workerId}/authenticate`,
        authenticationStatus: "unauthenticated",
      });
      return;
    }

    // Create and initialize Stagehand with the worker's context
    stagehand = await initializeStagehand(worker.contextId, {
      persist: false, // Don't save changes during verification
      verbose: 0,
    });

    // Navigate to Flow and check if we're logged in
    console.log("Navigating to Flow...");
    await stagehand.page.goto("https://labs.google/fx/tools/flow");
    await stagehand.page.waitForLoadState("networkidle");

    const currentUrl = stagehand.page.url();
    const pageTitle = await stagehand.page.title();

    // Check for authentication indicators
    const isGoogleLogin =
      currentUrl.includes("accounts.google.com") ||
      currentUrl.includes("oauth.google.com");

    let authenticationStatus: "authenticated" | "unauthenticated" | "unknown" =
      "unknown";
    let details: any = {
      currentUrl,
      pageTitle,
      isGoogleLogin,
    };

    if (isGoogleLogin) {
      authenticationStatus = "unauthenticated";
      markWorkerUnhealthy(workerId);
      details.reason = "Redirected to Google login page";
    } else {
      // Try to find authenticated elements
      try {
        const observations = await stagehand.page.observe({
          instruction:
            "Find user profile, account menu, or any elements that indicate the user is logged in",
          domSettleTimeoutMs: 3000,
        });

        if (observations.length > 0) {
          authenticationStatus = "authenticated";
          updateWorkerAuth(workerId, worker.email);
          details.authenticatedElements = observations.length;
        } else {
          authenticationStatus = "unauthenticated";
          markWorkerUnhealthy(workerId);
          details.reason = "No authenticated elements found";
        }
      } catch (error) {
        authenticationStatus = "unknown";
        details.observationError =
          error instanceof Error ? error.message : "Unknown error";
      }
    }

    console.log(
      `✅ Verification completed for ${workerId}: ${authenticationStatus}`
    );

    // Take a screenshot for debugging
    let screenshotPath = null;
    try {
      screenshotPath = `screenshots/verify-${workerId}-${Date.now()}.png`;
      // From ./docs/browserbase/features/screenshots.md - screenshots are returned as buffers
      const screenshotBuffer = await stagehand.page.screenshot({
        path: screenshotPath, // This path is ignored in Browserbase
        fullPage: false,
      });

      // Manually save the buffer to disk
      const fs = await import("fs");
      fs.writeFileSync(screenshotPath, screenshotBuffer);
      console.log(`📸 Verification screenshot saved: ${screenshotPath}`);
    } catch (screenshotError) {
      console.error("Failed to take verification screenshot:", screenshotError);
    }

    res.json({
      success: true,
      workerId,
      authenticationStatus,
      details,
      screenshotPath,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error verifying authentication for ${workerId}:`, error);
    markWorkerUnhealthy(workerId);

    res.status(500).json({
      success: false,
      message: `Failed to verify authentication for ${workerId}`,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    if (stagehand) {
      try {
        await stagehand.close();
        console.log("🧹 Verification session closed");
      } catch (error) {
        console.error("Error closing verification session:", error);
      }
    }
  }
});

app.post("/generate/text-to-video", async (req: Request, res: Response) => {
  const { prompt } = req.body;
  let stagehand: Stagehand | null = null;
  let workerId: string | null = null;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({
      error: "Invalid request",
      message: "Please provide a valid prompt parameter",
    });
    return;
  }

  try {
    // Get an available worker
    const worker = getAvailableWorker();
    if (!worker) {
      res.status(503).json({
        success: false,
        message: "No workers available. All workers are busy.",
        error: "SERVICE_BUSY",
      });
      return;
    }

    workerId = worker.id;
    markWorkerBusy(workerId);

    // Create a Stagehand session with the worker's context
    stagehand = await initializeStagehand(worker.contextId!, {
      persist: true, // Save any state changes back to the context
      verbose: 0,
    });

    // Configure download behavior for BrowserBase
    // From ./docs/browserbase/features/downloads.md - Required to avoid playwright overriding location
    const client = await stagehand.context.newCDPSession(stagehand.page);
    await client.send("Browser.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: "downloads",
      eventsEnabled: true,
    });
    console.log(`[${workerId}] Download behavior configured for BrowserBase`);

    // Navigate to Flow (already authenticated via context)
    const navigateResult = await actions.navigateToGoogleFlow(
      stagehand,
      workerId
    );
    if (!navigateResult.success) {
      markWorkerUnhealthy(workerId);
      throw new Error(navigateResult.error);
    }

    // Click the "New Project" button
    const newProjectResult = await actions.clickNewProjectButton(
      stagehand,
      workerId
    );
    if (!newProjectResult.success) {
      throw new Error(newProjectResult.error);
    }

    // Configure settings before entering prompt

    // Type the prompt in the text box
    const typePromptResult = await actions.typePromptIntoTextBox(
      stagehand,
      workerId,
      prompt
    );
    if (!typePromptResult.success) {
      throw new Error(typePromptResult.error);
    }

    // Open settings menu
    const tuneResult = await actions.clickTuneIconForPromptSettings(
      stagehand,
      workerId
    );
    if (!tuneResult.success) {
      throw new Error(tuneResult.error);
    }

    // Set outputs per prompt to 1
    const outputsDropdownResult = await actions.clickOutputsPerPromptDropdown(
      stagehand,
      workerId
    );
    if (!outputsDropdownResult.success) {
      throw new Error(outputsDropdownResult.error);
    }

    const selectOneResult = await actions.selectOneFromDropdownOptions(
      stagehand,
      workerId
    );
    if (!selectOneResult.success) {
      throw new Error(selectOneResult.error);
    }

    // Set model to Veo 3 - Fast
    const modelDropdownResult = await actions.clickModelDropdown(
      stagehand,
      workerId
    );
    if (!modelDropdownResult.success) {
      throw new Error(modelDropdownResult.error);
    }

    const selectVeoResult = await actions.selectVeo3FastFromDropdownOptions(
      stagehand,
      workerId
    );
    if (!selectVeoResult.success) {
      throw new Error(selectVeoResult.error);
    }

    // Click into the textbox to ensure it's focused
    const focusResult = await actions.clickTextboxToFocus(stagehand, workerId);
    if (!focusResult.success) {
      throw new Error(focusResult.error);
    }

    // Click the submit button
    const submitResult = await actions.clickSubmitPromptButton(
      stagehand,
      workerId
    );
    if (!submitResult.success) {
      throw new Error(submitResult.error);
    }

    // Wait for video to generate
    const watchResult = await actions.watchVideoForProgressOrCompletion(
      stagehand,
      workerId
    );
    if (!watchResult.success) {
      throw new Error(watchResult.error);
    }

    // Take a screenshot to track progress
    const screenshotResult = await actions.takeCheckpointScreenshot(
      stagehand,
      workerId
    );
    if (!screenshotResult.success) {
      console.error(
        `[${workerId}] Failed to take screenshot: ${screenshotResult.error}`
      );
    }

    // Download the video
    console.log(`[${workerId}] Preparing to download video`);

    // Step 1: Hover over the video to reveal controls
    const hoverResult = await actions.hoverOverVideoFrame(stagehand, workerId);
    if (!hoverResult.success) {
      throw new Error(hoverResult.error);
    }

    // Step 2: Click the download icon (leftmost icon in the pill-shaped button)
    const downloadIconResult =
      await actions.clickDownloadIconInFloatingActionPill(stagehand, workerId);
    if (!downloadIconResult.success) {
      throw new Error(downloadIconResult.error);
    }

    // Step 3: Set up download listener before clicking
    console.log(`[${workerId}] Setting up download listener`);
    let downloadFilename: string | undefined;

    // Listen for download event using Playwright's page
    // abdullah here, I find that I'm getting doing the download on the browserbase side
    const downloadPromise = stagehand.page
      .waitForEvent("download", { timeout: 30000 })
      .catch(() => null);

    // Click to start download
    const originalOptionResult =
      await actions.clickOriginalOptionFromDownloadMenu(stagehand, workerId);
    if (!originalOptionResult.success) {
      throw new Error(originalOptionResult.error);
    }

    // Wait for download event
    console.log(`[${workerId}] Waiting for download to start...`);
    const download = await downloadPromise;

    if (download) {
      downloadFilename = download.suggestedFilename();
      console.log(
        `[${workerId}] Download started! Filename: ${downloadFilename}`
      );

      // Wait for download to complete
      const downloadPath = await download.path().catch(() => null);
      if (downloadPath) {
        console.log(
          `[${workerId}] Download saved to temporary path: ${downloadPath}`
        );
      }

      // Also log download failure if any
      const failure = await download.failure();
      if (failure) {
        console.log(`[${workerId}] Download failed: ${failure}`);
      }
    } else {
      console.log(
        `[${workerId}] WARNING: No download event detected within 30 seconds`
      );
    }

    // Give extra time for BrowserBase to process the download
    console.log(`[${workerId}] Waiting for BrowserBase to process download...`);
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Check for completed downloads
    console.log(`[${workerId}] Checking for completed downloads`);

    // Create a Browserbase client
    const bb = createBrowserbaseClient();
    // Get the session ID from the stagehand instance
    const sessionId = stagehand.browserbaseSessionID;

    if (!sessionId) {
      throw new Error("No Browserbase session ID available");
    }

    // Poll for downloads to complete - downloads sync in real-time to BrowserBase
    // From ./docs/browserbase/features/downloads.md - size affects immediate availability
    let zipBuffer: Buffer | null = null;
    let validZipFound = false;
    const downloadStartTime = Date.now();
    const downloadMaxWaitTime = 60000; // 60 seconds timeout
    const pollInterval = 2000; // Check every 2 seconds as per docs

    console.log(
      `[${workerId}] Polling for synced downloads (may take time for large files)...`
    );

    while (
      !validZipFound &&
      Date.now() - downloadStartTime < downloadMaxWaitTime
    ) {
      try {
        // The list method returns a zip file containing all downloads
        const response = await bb.sessions.downloads.list(sessionId);
        // Convert response to buffer
        zipBuffer = Buffer.from(await response.arrayBuffer());

        // Check if we have a real file (not just empty zip headers)
        // abdullah: Currently, I'm getting a 22 byte empty zip file
        if (zipBuffer.length > 1000) {
          console.log(
            `[${workerId}] Retrieved downloads zip, size: ${zipBuffer.length} bytes`
          );
          validZipFound = true;
          break;
        } else if (zipBuffer.length > 0) {
          console.log(
            `[${workerId}] Found zip but too small (${zipBuffer.length} bytes), file still syncing...`
          );
        }
      } catch (error) {
        console.log(`[${workerId}] Downloads not ready yet, waiting...`);
      }

      // Wait before next attempt
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    if (!validZipFound || !zipBuffer || zipBuffer.length < 1000) {
      const errorMsg = zipBuffer
        ? `Download sync incomplete after 60 seconds (final size: ${zipBuffer.length} bytes)`
        : "No downloads found after waiting 60 seconds";
      throw new Error(errorMsg);
    }

    console.log(`[${workerId}] Download sync completed`);

    // Debug: Verify this is a valid zip file
    // abdullah: I'm getting a valid zip file but its empty
    const isZip = zipBuffer[0] === 0x50 && zipBuffer[1] === 0x4b; // PK header
    if (!isZip) {
      console.log(
        `[${workerId}] WARNING: File does not have valid ZIP headers`
      );
    }

    console.log(`[${workerId}] Video generation completed successfully`);
    res.json({
      success: true,
      message: "Video generated successfully",
      sessionId: sessionId,
      progressScreenshotPath: screenshotResult.success
        ? screenshotResult.screenshotPath
        : undefined,
      note: "Video is available in the downloaded files. Implementation for extracting MP4 file from zip is pending.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      `[${workerId || "unknown"}] Error during video generation:`,
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to generate video",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    // Cleanup
    if (stagehand) {
      try {
        console.log(`[${workerId || "unknown"}] Closing browser session`);
        await stagehand.close();
        console.log(`[${workerId || "unknown"}] Browser session closed`);
      } catch (error) {
        console.error(
          `[${workerId || "unknown"}] Error closing browser session:`,
          error
        );
      }
    }

    // Release the worker
    if (workerId) {
      console.log(`[${workerId}] Releasing worker back to pool`);
      markWorkerAvailable(workerId);
      console.log(`[${workerId}] Worker released`);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the service at http://localhost:${PORT}`);
});
