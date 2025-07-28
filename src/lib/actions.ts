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
        error: `Worker ${workerId} is not authenticated. Please re-authenticate.`,
      };
    }

    return { success: true, message: "Successfully navigated to Google Flow" };
  } catch (error) {
    return {
      success: false,
      error: `Failed to navigate to Google Flow: ${error}`,
    };
  }
}

// HTML reference for the New Project button:
// <button class="sc-7d2e2cf5-1 hoBDwb sc-2156006c-0 jINXpK">
//   <i class="sc-95c4f607-0 fLjDIG google-symbols undefined" font-size="1.125rem" color="currentColor">add_2</i>
//   New project
//   <div class="sc-7d2e2cf5-0 eblmNT"></div>
// </button>
// XPath: //*[@id="__next"]/div[2]/button
// Full XPath: /html/body/div/div[2]/button
export async function clickNewProjectButton(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Clicking create new project button`);
    await stagehand.page.act({
      action: "Click the button that says 'New project' with an add_2 icon",
      domSettleTimeoutMs: 5000,
    });
    console.log(`[${workerId}] New project created`);

    // Wait for the page to be ready
    await stagehand.page.waitForLoadState("networkidle");

    return { success: true, message: "New project created" };
  } catch (error) {
    return {
      success: false,
      error: `Failed to click new project button: ${error}`,
    };
  }
}

// HTML reference for the prompt text box:
// <textarea id="PINHOLE_TEXT_AREA_ELEMENT_ID" placeholder="Generate a video with text…" class="sc-d49e2b8-0 ldIWJU"></textarea>
// Note: Placeholder text may vary (e.g., "Generate a video with text and frames…")
// XPath: //*[@id="PINHOLE_TEXT_AREA_ELEMENT_ID"]
// Full XPath: /html/body/div/div[2]/div/div/div[2]/div/div[2]/textarea
export async function typePromptIntoTextBox(
  stagehand: Stagehand,
  workerId: string,
  prompt: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Entering prompt: "${prompt}"`);
    await stagehand.page.act({
      action:
        "Type %prompt% in the main textarea for video generation (the large text input area)",
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
      error: `Failed to type prompt: ${error}`,
    };
  }
}

// HTML reference for the Tune settings button:
// <button color="BLURPLE" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r1j:" data-state="closed" class="sc-e8425ea6-0 gLXNUV sc-308cf1ec-0 eKFHrQ sc-4d1940dd-0 cMZrwW">
//   <i class="sc-95c4f607-0 fMVsQH material-icons-outlined sc-e8425ea6-1 kJJDGi" font-size="1.25rem" color="currentColor">tune</i>
//   <span style="position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; overflow-wrap: normal;">Settings</span>
// </button>
export async function clickTuneIconForPromptSettings(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Clicking Tune icon to open generation settings`);
    await stagehand.page.act({
      action: "Click the Settings button with the tune icon",
      domSettleTimeoutMs: 5000,
    });
    console.log(`[${workerId}] Settings menu opened`);
    return { success: true, message: "Settings menu opened" };
  } catch (error) {
    return {
      success: false,
      error: `Failed to click tune icon: ${error}`,
    };
  }
}

// HTML reference for the Outputs per prompt dropdown:
// <button type="button" role="combobox" aria-controls="radix-:r5i:" aria-expanded="false" aria-autocomplete="none" dir="ltr" data-state="closed" class="sc-4d1940dd-10 gEvKBy sc-fbed8389-0 gaBqvv">
//   <div class="sc-4d1940dd-7 MevQc">
//     <span class="sc-4d1940dd-8 deTJhi">Outputs per prompt</span>
//     <span class="sc-4d1940dd-9 kulBKU">1</span>
//   </div>
//   <span aria-hidden="true" class="sc-4d1940dd-11 clHwVn">
//     <i class="sc-95c4f607-0 ojlmB material-icons undefined" font-size="1.5rem" color="currentColor">arrow_drop_down</i>
//   </span>
// </button>
export async function clickOutputsPerPromptDropdown(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Configuring outputs per prompt`);
    await stagehand.page.act({
      action:
        "Click the dropdown button labeled 'Outputs per prompt' with arrow_drop_down icon",
      domSettleTimeoutMs: 3000,
    });
    return { success: true, message: "Outputs dropdown opened" };
  } catch (error) {
    return {
      success: false,
      error: `Failed to click outputs dropdown: ${error}`,
    };
  }
}

// HTML reference for the dropdown options (when expanded):
// <div role="listbox" id="radix-:r5i:" data-state="open">
//   <div role="option" aria-labelledby="radix-:r72:" aria-selected="true" data-state="checked">
//     <span id="radix-:r72:">1</span>
//   </div>
//   <div role="option" aria-labelledby="radix-:r73:" aria-selected="false" data-state="unchecked">
//     <span id="radix-:r73:">2</span>
//   </div>
//   <!-- Additional options: 3, 4 -->
// </div>
export async function selectOneFromDropdownOptions(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    await stagehand.page.act({
      action: "Click the option '1' from the listbox",
      domSettleTimeoutMs: 3000,
    });
    console.log(`[${workerId}] Set outputs per prompt to 1`);
    return { success: true, message: "Set outputs to 1" };
  } catch (error) {
    return {
      success: false,
      error: `Failed to select 1 from dropdown: ${error}`,
    };
  }
}

// HTML reference for the Model dropdown:
// <button type="button" role="combobox" aria-controls="radix-:r5j:" aria-expanded="false" aria-autocomplete="none" dir="ltr" data-state="closed" class="sc-5da70cc6-4 jLcTy sc-fbed8389-0 gaBqvv">
//   <div class="sc-5da70cc6-1 dnizqX">
//     <span class="sc-5da70cc6-2 heFdtN">Model</span>
//     <span class="sc-5da70cc6-3 eypgX">Veo 3 - Fast</span>  <!-- This shows the currently selected model -->
//   </div>
//   <span aria-hidden="true" class="sc-5da70cc6-5 jVrMUz">
//     <i class="sc-95c4f607-0 ojlmB material-icons undefined" font-size="1.5rem" color="currentColor">arrow_drop_down</i>
//   </span>
// </button>
export async function clickModelDropdown(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Selecting video generation model`);
    await stagehand.page.act({
      action:
        "Click the dropdown button labeled 'Model' with arrow_drop_down icon",
      domSettleTimeoutMs: 3000,
    });
    return { success: true, message: "Model dropdown opened" };
  } catch (error) {
    return {
      success: false,
      error: `Failed to click model dropdown: ${error}`,
    };
  }
}

// HTML reference for the Model dropdown options (when expanded):
// <div role="listbox" id="radix-:r5j:" data-state="open">
//   <div role="option" aria-labelledby="radix-:r84:" aria-selected="true" data-state="checked">
//     <i class="material-icons">radio_button_checked</i>
//     <span id="radix-:r84:">Veo 3 - Fast</span>
//     <div>Beta Audio</div>
//   </div>
//   <div role="option" aria-labelledby="radix-:r85:" aria-selected="false" data-state="unchecked">
//     <i class="material-icons">radio_button_unchecked</i>
//     <span id="radix-:r85:">Veo 2 - Fast</span>
//     <div>No Audio</div>
//   </div>
//   <!-- Additional options: Veo 3 - Quality, Veo 2 - Quality -->
// </div>
export async function selectVeo3FastFromDropdownOptions(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    await stagehand.page.act({
      action:
        "Click the option 'Veo 3 - Fast' with 'Beta Audio' label from the listbox",
      domSettleTimeoutMs: 3000,
    });
    console.log(`[${workerId}] Model set to Veo 3 - Fast`);
    return { success: true, message: "Model set to Veo 3 - Fast" };
  } catch (error) {
    return {
      success: false,
      error: `Failed to select Veo 3 - Fast: ${error}`,
    };
  }
}

// HTML reference for clicking to focus the text box:
// <textarea id="PINHOLE_TEXT_AREA_ELEMENT_ID" placeholder="Generate a video with text…" class="sc-d49e2b8-0 ldIWJU"></textarea>
// Note: Placeholder text may vary (e.g., "Generate a video with text and frames…")
export async function clickTextboxToFocus(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Clicking into the text box to focus`);
    await stagehand.page.act({
      action: "Click the main textarea for video generation to focus it",
      domSettleTimeoutMs: 3000,
    });
    console.log(`[${workerId}] Text box focused`);

    // Small delay to ensure focus is properly set
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true, message: "Text box focused" };
  } catch (error) {
    return {
      success: false,
      error: `Failed to focus text box: ${error}`,
    };
  }
}

// HTML reference for the submit button:
// <button class="sc-7d2e2cf5-1 hwJkVV sc-893b8390-1 eEridu">
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
        "Click the Create button with arrow_forward icon near the textarea",
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
      error: `Failed to submit prompt: ${error}`,
    };
  }
}

// HTML reference for video generation states:
// Loading state - contains percentage indicator:
// <div class="sc-510f5a89-5 hQfIEB">
//   <div class="sc-6e96197d-0 kNjcfj">
//     <div class="sc-6e96197d-1 krAKfQ">44%</div>
//   </div>
// </div>
//
// Completed state - contains video element:
// <video src="data:video/mp4;base64,..." preload="auto" loop="" controlslist="nodownload" playsinline="">
export async function watchVideoForProgressOrCompletion(
  stagehand: Stagehand,
  workerId: string,
  maxWaitTimeMs: number = 600000 // 10 minutes default
): Promise<ActionResult> {
  const startTime = Date.now();
  console.log(
    `[${workerId}] Waiting for video generation (max ${
      maxWaitTimeMs / 1000 / 60
    } minutes)`
  );
  let lastLoggedPercentage = 0;

  while (Date.now() - startTime < maxWaitTimeMs) {
    try {
      // First, check if video generation is complete by looking for video element
      const completionResult = await stagehand.page.extract({
        instruction:
          "Look for a video element on the page. Return true if you see a video player, false if you see a percentage loading indicator (like '44%').",
        schema: z.object({
          isComplete: z.boolean(),
        }),
        useTextExtract: false, // Use DOM parsing to detect video element
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
            "Find the percentage number displayed (e.g., '44%', '70%', '99%'). Return just the number without the percent sign. If no percentage is visible, return 0.",
          schema: z.object({
            percentage: z.number(),
          }),
          useTextExtract: true,
          domSettleTimeoutMs: 2000,
        });

        // Log progress if percentage changed and is valid
        if (
          progressResult.percentage > 0
          // progressResult.percentage > lastLoggedPercentage
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
    error: `Video generation timed out after ${
      maxWaitTimeMs / 1000 / 60
    } minutes`,
  };
}

// TODO: Move to browserUtils.ts
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
      error: `Failed to take screenshot: ${error}`,
    };
  }
}

// HTML reference for the video container to hover over:
// <div class="sc-5ce3bf72-4 LgtJh">
//   <div class="sc-5ce3bf72-1 hSxQif sc-1c8727cb-2 eAvdbC" style="transform: none; transform-origin: 50% 50% 0px;">
//     <div style="width: 100%; height: 100%;">
//       <video src="..." preload="none" loop="" controlslist="nodownload" playsinline="">
//     </div>
//   </div>
//   <!-- Hover controls appear here when hovering -->
// </div>
export async function hoverOverVideoFrame(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    await stagehand.page.act({
      action:
        "Hover over the video player area to reveal the floating control buttons",
      domSettleTimeoutMs: 3000,
    });
    console.log(`[${workerId}] Video controls revealed`);

    // Wait for controls to appear
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: true, message: "Video controls revealed" };
  } catch (error) {
    return {
      success: false,
      error: `Failed to hover over video: ${error}`,
    };
  }
}

// HTML reference for the download button:
// <button type="button" id="radix-:rd1:" aria-haspopup="menu" aria-expanded="false" data-state="closed" class="sc-e8425ea6-0 gLXNUV sc-2b6ef9e5-1 ldaZRl sc-2b6ef9e5-4 hFhuTI">
//   <i class="sc-95c4f607-0 dGuxiz google-symbols sc-e8425ea6-1 kJJDGi" font-size="1.25rem" color="currentColor">download</i>
//   <span style="position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; overflow-wrap: normal;">Download</span>
// </button>
export async function clickDownloadIconInFloatingActionPill(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Looking for download icon`);
    await stagehand.page.act({
      action: "Click the Download button with download icon",
      domSettleTimeoutMs: 3000,
    });
    console.log(`[${workerId}] Download menu opened`);

    // Wait for menu to appear
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: true, message: "Download menu opened" };
  } catch (error) {
    return {
      success: false,
      error: `Failed to click download icon: ${error}`,
    };
  }
}

// HTML reference for the download menu options:
// <div role="menu" aria-orientation="vertical" data-state="open">
//   <div role="menuitem"><i class="google-symbols">gif_box</i>Animated GIF (270p)</div>
//   <div role="menuitem"><i class="google-symbols">capture</i>Original size (720p)</div>
//   <div role="menuitem"><i class="google-symbols">aspect_ratio</i>Upscaled (1080p)</div>
// </div>
export async function clickOriginalOptionFromDownloadMenu(
  stagehand: Stagehand,
  workerId: string
): Promise<ActionResult> {
  try {
    console.log(`[${workerId}] Selecting download quality`);
    await stagehand.page.act({
      action:
        "Click the 'Original size (720p)' option with capture icon from the menu",
      domSettleTimeoutMs: 3000,
    });
    console.log(`[${workerId}] Download action triggered`);

    return { success: true, message: "Original download option clicked" };
  } catch (error) {
    return {
      success: false,
      error: `Failed to click original option: ${error}`,
    };
  }
}
