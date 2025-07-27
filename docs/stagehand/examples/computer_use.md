# Computer Use Agents

> Incorporate Computer Use APIs from Anthropic and OpenAI with one line of code in Stagehand.

## What is a Computer Use Agent?

<iframe width="100%" height="400" src="https://www.youtube.com/embed/ODaHJzOyVCQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />

You might've heard of [Claude Computer Use](https://www.anthropic.com/news/3-5-models-and-computer-use) or [OpenAI's Computer Using Agent](https://openai.com/index/computer-using-agent/).

These are powerful tools that can convert natural language into actions on the computer. However, you'd otherwise need to write your own code to convert these actions into Playwright commands.

Stagehand not only handles the execution of Computer Use outputs, but also lets you hot-swap between OpenAI and Anthropic models with one line of code.

## How to use a Computer Use Agent in Stagehand

Stagehand lets you use Computer Use Agents with one line of code:

<Note>
  **IMPORTANT! Configure your browser dimensions**

  Computer Use Agents will often return XY-coordinates to click on the screen, so you'll need to configure your browser dimensions.

  If not specified, the default browser dimensions are 1024x768. You can also configure the browser dimensions in the `browserbaseSessionCreateParams` or `localBrowserLaunchOptions` options.
</Note>

### Configuring browser dimensions

Browser configuration differs by environment:

<Tabs>
  <Tab title="BROWSERBASE">
    <CodeGroup>
      ```typescript TypeScript
      import { Stagehand } from "@browserbasehq/stagehand";

      const stagehand = new Stagehand({
      	env: "BROWSERBASE",
        	apiKey: process.env.BROWSERBASE_API_KEY /* API key for authentication */,
          projectId: process.env.BROWSERBASE_PROJECT_ID /* Project ID for the session */,
          browserbaseSessionCreateParams: {
            browserSettings: {
              viewport: { width: 1280, height: 720 },
            },
          },
      });
      ```

      ```python Python
      from stagehand import Stagehand, StagehandConfig

      config = StagehandConfig(
          env="BROWSERBASE",
          api_key=os.getenv("BROWSERBASE_API_KEY"),
          project_id=os.getenv("BROWSERBASE_PROJECT_ID"),
          browserbase_session_create_params={
              "browserSettings": {
                  "viewport": {"width": 1280, "height": 720},
              },
          },
      )

      stagehand = Stagehand(config)
      ```
    </CodeGroup>
  </Tab>

  <Tab title="LOCAL">
    <CodeGroup>
      ```typescript TypeScript
      import { Stagehand } from "@browserbasehq/stagehand";

      const stagehand = new Stagehand({
      	env: "LOCAL",
          localBrowserLaunchOptions: {
            viewport: { width: 1280, height: 720 },
          },
      });
      ```

      ```python Python
      from stagehand import Stagehand, StagehandConfig

      config = StagehandConfig(
          env="LOCAL",
          local_browser_launch_options={
              "viewport": {"width": 1280, "height": 720},
          },
      )

      stagehand = Stagehand(config)
      ```
    </CodeGroup>
  </Tab>
</Tabs>

### Creating a Computer Use Agent

<CodeGroup>
  ```typescript TypeScript
  const agent = stagehand.agent({
    provider: "openai",
    model: "computer-use-preview"
  });

  // Or use Anthropic's Computer Use
  const agent = stagehand.agent({
    provider: "anthropic",
    model: "claude-3-5-sonnet-20241022"
  });
  ```

  ```python Python
  agent = stagehand.agent(
      provider="openai",
      model="computer-use-preview"
  )

  # Or use Anthropic's Computer Use
  agent = stagehand.agent(
      provider="anthropic",
      model="claude-3-5-sonnet-20241022"
  )
  ```
</CodeGroup>