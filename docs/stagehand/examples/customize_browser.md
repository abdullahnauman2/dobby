# Browser Customization

> Stagehand can run on any Chromium-based browser, like Chrome, Edge, Arc, and Brave.

## Browserbase

Stagehand is built and maintained by [Browserbase](https://www.browserbase.com/). As a result, Stagehand has supreme performance and reliability on Browserbase.

The [Browserbase SDK](https://docs.browserbase.com/reference/sdk/nodejs) is very powerful, and allows you to handle a wide variety of use cases such as:

* Captcha solving
* Custom contexts and extensions
* Live browser view
* Proxy rotation
* Session recordings
* Uploads/downloads

Using Browserbase is as easy as setting `env: "BROWSERBASE"` in your Stagehand constructor:

<CodeGroup>
  ```typescript TypeScript
  const stagehand = new Stagehand({
    env: "BROWSERBASE",
    // Stagehand will automatically read your Browserbase API key and project ID from your environment variables
    // If you'd like to pass in your own API key and project ID, you can do so like this:
    apiKey: process.env.BROWSERBASE_API_KEY,
    projectId: process.env.BROWSERBASE_PROJECT_ID,
  });
  ```

  ```python Python
  import os
  from stagehand import Stagehand, StagehandConfig

  # Build a unified configuration object for Stagehand
  config = StagehandConfig(
      env="BROWSERBASE",
      # Stagehand will automatically read your Browserbase API key and project ID from your environment variables
      # If you'd like to pass in your own API key and project ID, you can do so like this:
      api_key=os.getenv("BROWSERBASE_API_KEY"),
      project_id=os.getenv("BROWSERBASE_PROJECT_ID"),
  )

  # Create a Stagehand client using the configuration object.
  stagehand = Stagehand(config)
  ```
</CodeGroup>

### Create a Browserbase session

To create a custom Browserbase session with specific parameters:

<CodeGroup>
  ```typescript TypeScript
  const stagehand = new Stagehand({
    env: "BROWSERBASE",
    browserbaseSessionCreateParams: {
      projectId: "your-project-id",
      browserSettings: {
        viewport: { width: 1920, height: 1080 },
        context: "your-context-id",
      },
      proxies: true,
      stealth: true,
    },
  });
  ```

  ```python Python
  config = StagehandConfig(
      env="BROWSERBASE",
      browserbase_session_create_params={
          "projectId": "your-project-id",
          "browserSettings": {
              "viewport": {"width": 1920, "height": 1080},
              "context": "your-context-id",
          },
          "proxies": True,
          "stealth": True,
      },
  )

  stagehand = Stagehand(config)
  ```
</CodeGroup>

## Local Browser

You can also run Stagehand on your local browser for development and testing:

<CodeGroup>
  ```typescript TypeScript
  const stagehand = new Stagehand({
    env: "LOCAL",
    localBrowserLaunchOptions: {
      headless: false,
      viewport: { width: 1280, height: 720 },
      channel: "chrome", // or "msedge", "chrome-beta", etc.
    },
  });
  ```

  ```python Python
  config = StagehandConfig(
      env="LOCAL",
      local_browser_launch_options={
          "headless": False,
          "viewport": {"width": 1280, "height": 720},
          "channel": "chrome",  # or "msedge", "chrome-beta", etc.
      },
  )

  stagehand = Stagehand(config)
  ```
</CodeGroup>

### Browser Channels

Stagehand supports various Chromium-based browsers:
- `chrome` - Google Chrome
- `chrome-beta` - Chrome Beta
- `chrome-dev` - Chrome Dev
- `chrome-canary` - Chrome Canary
- `msedge` - Microsoft Edge
- `msedge-beta` - Edge Beta
- `msedge-dev` - Edge Dev