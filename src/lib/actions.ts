import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function navigateToGoogleFlow(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Navigating to Google Labs Flow`);
    await stagehand.page.goto("https://labs.google/fx/tools/flow");
    await stagehand.page.waitForLoadState("networkidle");
    console.log(`[${workerId}] Successfully loaded Flow interface`);
    
    // Check if we're still authenticated
    const currentUrl = stagehand.page.url();
    if (
      currentUrl.includes("accounts.google.com") ||
      currentUrl.includes("oauth.google.com")
    ) {
      return {
        success: false,
        error: `Worker ${workerId} is not authenticated. Please re-authenticate.`
      };
    }
    
    return { success: true, message: "Successfully navigated to Google Flow" };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to navigate to Google Flow: ${error}` 
    };
  }
}

export async function clickNewProjectButton(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Clicking create new project button`);
    await stagehand.page.act({
      action:
        "Click the 'New Project' button with a plus icon towards the bottom of the page",
      domSettleTimeoutMs: 5000,
    });
    console.log(`[${workerId}] New project created`);
    
    // Wait for the page to be ready
    await stagehand.page.waitForLoadState("networkidle");
    
    return { success: true, message: "New project created" };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to click new project button: ${error}` 
    };
  }
}

export async function typePromptIntoTextBox(
  stagehand: Stagehand,
  workerId: string,
  prompt: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Entering prompt: "${prompt}"`);
    await stagehand.page.act({
      action:
        "Type %prompt% in the text box towards the bottom of the page that has the hint text 'Generate a video with text'",
      variables: {
        prompt: prompt,
      },
      domSettleTimeoutMs: 5000,
    });
    console.log(`[${workerId}] Prompt entered`);
    return { success: true, message: "Prompt entered" };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to type prompt: ${error}` 
    };
  }
}

export async function clickTuneIconForPromptSettings(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Clicking Tune icon to open generation settings`);
    await stagehand.page.act({
      action: "Click the Tune icon in the top right corner of the text box",
      domSettleTimeoutMs: 5000,
    });
    console.log(`[${workerId}] Settings menu opened`);
    return { success: true, message: "Settings menu opened" };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to click tune icon: ${error}` 
    };
  }
}

export async function clickOutputsPerPromptDropdown(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Configuring outputs per prompt`);
    await stagehand.page.act({
      action: "Click the 'Outputs per prompt' dropdown",
      domSettleTimeoutMs: 3000,
    });
    return { success: true, message: "Outputs dropdown opened" };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to click outputs dropdown: ${error}` 
    };
  }
}

export async function selectOneFromDropdownOptions(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    await stagehand.page.act({
      action: "Select '1' from the dropdown options",
      domSettleTimeoutMs: 3000,
    });
    console.log(`[${workerId}] Set outputs per prompt to 1`);
    return { success: true, message: "Set outputs to 1" };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to select 1 from dropdown: ${error}` 
    };
  }
}

export async function clickModelDropdown(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Selecting video generation model`);
    await stagehand.page.act({
      action: "Click the 'Model' dropdown",
      domSettleTimeoutMs: 3000,
    });
    return { success: true, message: "Model dropdown opened" };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to click model dropdown: ${error}` 
    };
  }
}

export async function selectVeo3FastFromDropdownOptions(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    await stagehand.page.act({
      action: "Select 'Veo 3 - Fast' from the dropdown options",
      domSettleTimeoutMs: 3000,
    });
    console.log(`[${workerId}] Model set to Veo 3 - Fast`);
    return { success: true, message: "Model set to Veo 3 - Fast" };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to select Veo 3 - Fast: ${error}` 
    };
  }
}

export async function clickTextboxToFocus(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Clicking into the text box to focus`);
    await stagehand.page.act({
      action: "Click into the textarea",
      domSettleTimeoutMs: 3000,
    });
    console.log(`[${workerId}] Text box focused`);
    
    // Small delay to ensure focus is properly set
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return { success: true, message: "Text box focused" };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to focus text box: ${error}` 
    };
  }
}

// HTML reference for the submit button:
// <button class="sc-7d2e2cf5-1 hwJkVV sc-893b8390-1 eEridu" disabled="">
//   <i class="sc-95c4f607-0 grsLJu google-symbols undefined" font-size="1rem" color="currentColor">arrow_forward</i>
//   <span style="position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; overflow-wrap: normal;">Create</span>
//   <div class="sc-7d2e2cf5-0 eblmNT"></div>
// </button>
export async function clickSubmitPromptButton(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Clicking generate video button`);
    await stagehand.page.act({
      action:
        "Click the Create button with arrow_forward icon on the bottom right corner of the text box",
      domSettleTimeoutMs: 5000,
    });
    console.log(`[${workerId}] Submit prompt button clicked`);
    
    // Confirm the prompt was submitted
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`[${workerId}] Prompt successfully submitted`);
    
    return { success: true, message: "Prompt submitted" };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to submit prompt: ${error}` 
    };
  }
}

export async function watchVideoForProgressOrCompletion(
  stagehand: Stagehand,
  workerId: string,
  maxWaitTimeMs: number = 600000 // 10 minutes default
): Promise<ActionResult> {
  const startTime = Date.now();
  console.log(`[${workerId}] Waiting for video generation (max ${maxWaitTimeMs/1000/60} minutes)`);
  let lastLoggedPercentage = 0;

  while (Date.now() - startTime < maxWaitTimeMs) {
    try {
      // First, check if video generation is complete
      const completionResult = await stagehand.page.extract({
        instruction:
          "Is the video fully generated and ready? Look for a completed video frame without any loading indicators. Return true if the video is complete, false if it's still loading.",
        schema: z.object({
          isComplete: z.boolean(),
        }),
        useTextExtract: true,
        domSettleTimeoutMs: 3000,
      });

      // If video is complete, break out of the loop
      if (completionResult.isComplete) {
        console.log(`[${workerId}] Video generation complete`);
        return { success: true, message: "Video generation complete" };
      }

      // Video is not complete, so check for progress percentage
      try {
        const progressResult = await stagehand.page.extract({
          instruction:
            "Find the loading percentage indicator (like '50%' or '80%'). Return just the number without the percent sign. If no percentage is visible, return 0.",
          schema: z.object({
            percentage: z.number(),
          }),
          useTextExtract: true,
          domSettleTimeoutMs: 2000,
        });

        // Log progress if percentage changed and is valid
        if (
          progressResult.percentage > 0 &&
          progressResult.percentage > lastLoggedPercentage
        ) {
          console.log(
            `[${workerId}] Video generation progress: ${progressResult.percentage}%`
          );
          lastLoggedPercentage = progressResult.percentage;
        }
      } catch (progressError) {
        // If we can't extract progress, that's okay - we already know it's not complete
        console.log(
          `[${workerId}] Could not extract progress percentage, continuing to wait`
        );
      }
    } catch (completionError) {
      // If we can't determine completion status, log and continue
      console.log(
        `[${workerId}] Could not determine completion status, continuing to wait`
      );
    }

    // Wait 2 seconds before checking again
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return { 
    success: false, 
    error: `Video generation timed out after ${maxWaitTimeMs/1000/60} minutes` 
  };
}

export async function takeCheckpointScreenshot(
  stagehand: Stagehand,
  workerId: string,
  screenshotType: string = "generation-complete"
): Promise<{ success: boolean; screenshotPath?: string; error?: string }> {
  try {
    console.log(`[${workerId}] Capturing ${screenshotType} screenshot`);
    const screenshotPath = `screenshots/${screenshotType}-${workerId}-${Date.now()}.png`;
    const screenshotBuffer = await stagehand.page.screenshot({
      fullPage: false,
    });

    // Save screenshot
    const fs = await import("fs");
    // Ensure screenshots directory exists
    if (!fs.existsSync("screenshots")) {
      fs.mkdirSync("screenshots", { recursive: true });
    }
    fs.writeFileSync(screenshotPath, screenshotBuffer);
    console.log(`[${workerId}] Screenshot saved: ${screenshotPath}`);
    
    return { success: true, screenshotPath };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to take screenshot: ${error}` 
    };
  }
}

export async function hoverOverVideoFrame(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    await stagehand.page.act({
      action: "Hover over the video frame to reveal the control buttons",
      domSettleTimeoutMs: 3000,
    });
    console.log(`[${workerId}] Video controls revealed`);
    
    // Wait for controls to appear
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    return { success: true, message: "Video controls revealed" };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to hover over video: ${error}` 
    };
  }
}

export async function clickDownloadIconInFloatingActionPill(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Looking for download icon`);
    await stagehand.page.act({
      action:
        "Click the leftmost icon (download icon) in the pill-shaped button that appeared in the top right corner of the video frame",
      domSettleTimeoutMs: 3000,
    });
    console.log(`[${workerId}] Download menu opened`);
    
    // Wait for menu to appear
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    return { success: true, message: "Download menu opened" };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to click download icon: ${error}` 
    };
  }
}

export async function clickOriginalOptionFromDownloadMenu(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Selecting download quality`);
    await stagehand.page.act({
      action:
        "Click 'Original' option from the download menu (it's the second option, not 'Animated GIF' or 'Upscaled')",
      domSettleTimeoutMs: 3000,
    });
    console.log(`[${workerId}] Download action triggered`);
    
    return { success: true, message: "Original download option clicked" };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to click original option: ${error}` 
    };
  }
}