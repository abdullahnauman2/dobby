# Install Stagehand

Add Stagehand to a new or existing project.

<Tip>
  For TypeScript/Node.js: We highly recommend using the Node.js runtime environment to run Stagehand scripts, as opposed to newer alternatives like Deno or Bun.

  **Bun does not support Stagehand** since it doesn't support [Playwright](https://github.com/search?q=repo:oven-sh/bun+playwright\&type=issues).

  For Python: We require Python 3.9+ and recommend using [uv](https://docs.astral.sh/uv/) to manage your virtual environment.
</Tip>

<Tabs>
  <Tab title="TypeScript">
    We strongly recommend using Stagehand in a new project with `npx create-browser-app`. Check out our [quickstart guide](https://docs.stagehand.dev/get_started/quickstart) to get started.

    However, if you have an existing project, you can install Stagehand by installing the `@browserbasehq/stagehand` package.

    <Tabs>
      <Tab title="npm">
        ```bash
        npm install @browserbasehq/stagehand
        ```
      </Tab>

      <Tab title="pnpm">
        ```bash
        pnpm add @browserbasehq/stagehand
        ```
      </Tab>

      <Tab title="yarn">
        ```bash
        yarn add @browserbasehq/stagehand
        ```
      </Tab>
    </Tabs>

    <Note>
      You may also need to install the Playwright browser to run your Stagehand scripts, especially if you're running locally.
    </Note>

    ```bash
    playwright install
    ```

    Then, you can use Stagehand in your project by importing the `Stagehand` class.

    ```typescript
    import { Stagehand } from "@browserbasehq/stagehand";

    async function main() {
    	const stagehand = new Stagehand({
    		env: "BROWSERBASE", // or "LOCAL" for local development
    		apiKey: process.env.BROWSERBASE_API_KEY,
    		projectId: process.env.BROWSERBASE_PROJECT_ID,
    	});

    	await stagehand.init();

    	const page = stagehand.page;
    	await page.goto("https://example.com");

    	// Your automation code here

    	await stagehand.close();
    }

    main();
    ```
  </Tab>

  <Tab title="Python">
    Install Stagehand using pip or your preferred package manager:

    ```bash
    pip install stagehand
    ```

    If using uv (recommended):

    ```bash
    uv add stagehand
    ```

    Then you can use Stagehand in your Python scripts:

    ```python
    import asyncio
    import os
    from stagehand import Stagehand, StagehandConfig

    async def main():
        config = StagehandConfig(
            env="BROWSERBASE",  # or "LOCAL" for local development
            api_key=os.getenv("BROWSERBASE_API_KEY"),
            project_id=os.getenv("BROWSERBASE_PROJECT_ID"),
        )

        stagehand = Stagehand(config)
        await stagehand.init()

        page = stagehand.page
        await page.goto("https://example.com")

        # Your automation code here

        await stagehand.close()

    if __name__ == "__main__":
        asyncio.run(main())
    ```
  </Tab>
</Tabs>

## Configuration Options

### Environment Variables

Create a `.env` file in your project root:

```env
BROWSERBASE_API_KEY=your_api_key_here
BROWSERBASE_PROJECT_ID=your_project_id_here
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### Basic Configuration

<CodeGroup>
  ```typescript TypeScript
  const stagehand = new Stagehand({
    env: "BROWSERBASE", // "BROWSERBASE" or "LOCAL"
    
    // Browserbase settings
    apiKey: process.env.BROWSERBASE_API_KEY,
    projectId: process.env.BROWSERBASE_PROJECT_ID,
    
    // LLM settings
    modelName: "openai/gpt-4o", // Default model
    modelClientOptions: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    
    // Enable detailed metrics
    enableMetrics: true,
  });
  ```

  ```python Python
  config = StagehandConfig(
      env="BROWSERBASE",  # "BROWSERBASE" or "LOCAL"
      
      # Browserbase settings
      api_key=os.getenv("BROWSERBASE_API_KEY"),
      project_id=os.getenv("BROWSERBASE_PROJECT_ID"),
      
      # LLM settings
      model="openai/gpt-4o",  # Default model
      model_client_options={
          "apiKey": os.getenv("OPENAI_API_KEY"),
      },
      
      # Enable detailed metrics
      enable_metrics=True,
  )
  
  stagehand = Stagehand(config)
  ```
</CodeGroup>

## Getting API Keys

### Browserbase
1. Sign up at [browserbase.com](https://browserbase.com)
2. Go to your [dashboard](https://browserbase.com/dashboard)
3. Copy your API key and project ID

### OpenAI
1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Go to [API keys](https://platform.openai.com/api-keys)
3. Create a new API key

### Anthropic
1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Go to [API keys](https://console.anthropic.com/settings/keys)
3. Create a new API key