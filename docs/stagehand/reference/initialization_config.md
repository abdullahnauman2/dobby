# Configuration

> How to configure Stagehand

## Stagehand constructor

<CodeGroup>
  ```typescript TypeScript
  // Basic usage
  // Defaults to Browserbase; if no API key is provided, it will default to LOCAL
  // Default model is gpt-4o
  const stagehand = new Stagehand();

  // Custom configuration
  const stagehand = new Stagehand({
  	env: "LOCAL",
  	// env: "BROWSERBASE", // To run remotely on Browserbase (needs API keys)
  	verbose: 1,
  	enableCaching: true,
  	logger: (logLine: LogLine) => {
  		console.log(`[${logLine.category}] ${logLine.message}`);
  	},
      // LLM configuration
      modelName: "google/gemini-2.0-flash", /* Name of the model to use in "provider/model" format */
      modelClientOptions: {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY, /* Model API key */
      }, /* Configuration options for the model client */
  	apiKey: process.env.BROWSERBASE_API_KEY, 
  	projectId: process.env.BROWSERBASE_PROJECT_ID,
  	/* API keys for authentication (if you want to use Browserbase) */
  	browserbaseSessionID:
        undefined, /* Can set Session ID for resuming Browserbase sessions */
      browserbaseSessionCreateParams: { /* Browser Session Params */
        projectId: process.env.BROWSERBASE_PROJECT_ID!,
        proxies: true, /* Using Browserbase's Proxies */ 
        browserSettings: {
  		advancedStealth: true, /* Only available on Scale Plans */
          blockAds: true, /* To Block Ad Popups (defaults to False) */
          viewport: { // Browser Size (ie 1920x1080, 1024x768)
            width: 1024,
            height: 768,
          },
        },
      },
      localBrowserLaunchOptions: { /* Local Browser Launch Options */
        headless: false, /* Show the browser window */
        channel: "chrome", /* Browser channel: chrome, msedge, etc. */
        args: ["--no-sandbox"], /* Additional browser arguments */
      },
  });

  await stagehand.init();
  ```

  ```python Python
  # Basic usage
  # Defaults to Browserbase; if no API key is provided, it will default to LOCAL
  # Default model is gpt-4o
  stagehand = Stagehand()

  # Custom configuration
  from stagehand import Stagehand, StagehandConfig

  config = StagehandConfig(
      env="LOCAL",
      # env="BROWSERBASE",  # To run remotely on Browserbase (needs API keys)
      verbose=1,
      enable_caching=True,
      # LLM configuration
      model="google/gemini-2.0-flash",  # Name of the model to use
      model_client_options={
          "apiKey": os.getenv("GOOGLE_GENERATIVE_AI_API_KEY"),  # Model API key
      },
      api_key=os.getenv("BROWSERBASE_API_KEY"),
      project_id=os.getenv("BROWSERBASE_PROJECT_ID"),
      # API keys for authentication (if you want to use Browserbase)
      browserbase_session_id=None,  # Can set Session ID for resuming sessions
      browserbase_session_create_params={  # Browser Session Params
          "projectId": os.getenv("BROWSERBASE_PROJECT_ID"),
          "proxies": True,  # Using Browserbase's Proxies
          "browserSettings": {
              "advancedStealth": True,  # Only available on Scale Plans
              "blockAds": True,  # To Block Ad Popups (defaults to False)
              "viewport": {  # Browser Size (ie 1920x1080, 1024x768)
                  "width": 1024,
                  "height": 768,
              },
          },
      },
      local_browser_launch_options={  # Local Browser Launch Options
          "headless": False,  # Show the browser window
          "channel": "chrome",  # Browser channel: chrome, msedge, etc.
          "args": ["--no-sandbox"],  # Additional browser arguments
      },
  )

  stagehand = Stagehand(config)
  await stagehand.init()
  ```
</CodeGroup>

## Configuration Options

### Core Settings

<ParamField path="env" type="'LOCAL' | 'BROWSERBASE'" optional>
  Environment to run in. Defaults to BROWSERBASE if API keys are provided, otherwise LOCAL.
</ParamField>

<ParamField path="verbose" type="0 | 1 | 2" optional>
  Logging verbosity level:
  - 0: Minimal logging
  - 1: Standard logging (default)
  - 2: Debug logging
</ParamField>

<ParamField path="enableCaching" type="boolean" optional>
  Enable caching for faster repeated operations. Default: true
</ParamField>

<ParamField path="logger" type="function" optional>
  Custom logging function for handling log output
</ParamField>

### LLM Configuration

<ParamField path="modelName" type="string" optional>
  Model to use in "provider/model" format. Default: "openai/gpt-4o"
  
  Examples:
  - "openai/gpt-4o"
  - "anthropic/claude-3-5-sonnet-latest"
  - "google/gemini-2.0-flash"
</ParamField>

<ParamField path="modelClientOptions" type="object" optional>
  Configuration options for the model client, including API keys
</ParamField>

### Browserbase Configuration

<ParamField path="apiKey" type="string" optional>
  Browserbase API key for remote browser sessions
</ParamField>

<ParamField path="projectId" type="string" optional>
  Browserbase project ID
</ParamField>

<ParamField path="browserbaseSessionID" type="string" optional>
  Existing session ID to resume a Browserbase session
</ParamField>

<ParamField path="browserbaseSessionCreateParams" type="object" optional>
  Parameters for creating new Browserbase sessions:
  - `proxies`: Enable proxy usage
  - `browserSettings`: Browser configuration
    - `advancedStealth`: Enable advanced stealth mode (Scale plan)
    - `blockAds`: Block advertisements
    - `viewport`: Browser window dimensions
</ParamField>

### Local Browser Configuration

<ParamField path="localBrowserLaunchOptions" type="object" optional>
  Options for launching local browser:
  - `headless`: Run browser in headless mode
  - `channel`: Browser channel (chrome, msedge, etc.)
  - `args`: Additional command-line arguments
</ParamField>

## Environment Variables

Stagehand can automatically read configuration from environment variables:

```env
# Browserbase
BROWSERBASE_API_KEY=your_api_key
BROWSERBASE_PROJECT_ID=your_project_id

# LLM Providers
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
```

## Initialization

Always call `init()` after creating a Stagehand instance:

<CodeGroup>
  ```typescript TypeScript
  const stagehand = new Stagehand(config);
  await stagehand.init();
  
  // Now you can use stagehand
  const page = stagehand.page;
  ```

  ```python Python
  stagehand = Stagehand(config)
  await stagehand.init()
  
  # Now you can use stagehand
  page = stagehand.page
  ```
</CodeGroup>

## Cleanup

Always close Stagehand when done to free resources:

<CodeGroup>
  ```typescript TypeScript
  await stagehand.close();
  ```

  ```python Python
  await stagehand.close()
  ```
</CodeGroup>