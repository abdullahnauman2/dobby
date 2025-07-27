# Quickstart

You can get started with Stagehand in just 1 minute! Choose your preferred language below.

<Tip>
  For TypeScript/Node.js: We highly recommend using the Node.js runtime environment to run Stagehand scripts, as opposed to newer alternatives like Deno or Bun.

  **Bun does not support Stagehand** since it doesn't support [Playwright](https://github.com/search?q=repo:oven-sh/bun+playwright\&type=issues).

  For Python: We require Python 3.9+ and recommend using [uv](https://docs.astral.sh/uv/) to manage your virtual environment.
</Tip>

<Tabs>
  <Tab title="TypeScript">
    Before you begin, you'll need to install Node.js and NPM. We highly recommend using [nvm](https://github.com/nvm-sh/nvm) to manage your Node.js versions, and running on Node version 20+.

    <Steps>
      <Step title="Create a new project">
        You can use [npx](https://docs.npmjs.com/cli/v8/commands/npx) to create a new project. You should have npx included with `npm`, the default package manager for Node.js.

        <Tabs>
          <Tab title="npm">
            ```bash
            npx create-browser-app
            ```
          </Tab>

          <Tab title="pnpm">
            ```bash
            pnpm create browser-app
            ```
          </Tab>

          <Tab title="yarn">
            ```bash
            yarn create browser-app
            ```
          </Tab>
        </Tabs>

        To use our [Contexts](https://docs.browserbase.com/features/contexts) with Stagehand, run:

        <Tabs>
          <Tab title="npm">
            ```bash
            npx create-browser-app --example persist-context
            ```
          </Tab>

          <Tab title="pnpm">
            ```bash
            pnpm create browser-app --example persist-context
            ```
          </Tab>

          <Tab title="yarn">
            ```bash
            yarn create browser-app --example persist-context
            ```
          </Tab>
        </Tabs>
      </Step>

      <Step title="Set up your environment">
        Create a `.env.local` file in your project root and add your API keys:

        ```env
        BROWSERBASE_API_KEY=your_api_key_here
        BROWSERBASE_PROJECT_ID=your_project_id_here
        OPENAI_API_KEY=your_openai_key_here
        ```

        You can get your Browserbase credentials from the [Browserbase dashboard](https://browserbase.com/dashboard).
      </Step>

      <Step title="Run your first automation">
        ```bash
        npm run dev
        ```

        This will run a simple example that navigates to the Stagehand docs and extracts some information from the page.
      </Step>
    </Steps>
  </Tab>

  <Tab title="Python">
    Before you begin, make sure you have Python 3.9+ installed. We recommend using [uv](https://docs.astral.sh/uv/) for dependency management.

    <Steps>
      <Step title="Create a new project">
        ```bash
        mkdir my-stagehand-project
        cd my-stagehand-project
        ```

        If using uv:
        ```bash
        uv init
        uv add stagehand
        ```

        If using pip:
        ```bash
        python -m venv venv
        source venv/bin/activate  # On Windows: venv\Scripts\activate
        pip install stagehand
        ```
      </Step>

      <Step title="Create your first script">
        Create a file called `main.py`:

        ```python
        import asyncio
        from stagehand import Stagehand, StagehandConfig

        async def main():
            config = StagehandConfig(
                env="BROWSERBASE",
                # Add your API keys here or use environment variables
            )
            
            stagehand = Stagehand(config)
            await stagehand.init()

            page = stagehand.page
            await page.goto("https://docs.stagehand.dev")

            # Extract the page title
            result = await page.extract("What is the main heading on this page?")
            print(f"Page heading: {result}")

            await stagehand.close()

        if __name__ == "__main__":
            asyncio.run(main())
        ```
      </Step>

      <Step title="Set up your environment">
        Create a `.env` file in your project root:

        ```env
        BROWSERBASE_API_KEY=your_api_key_here
        BROWSERBASE_PROJECT_ID=your_project_id_here
        OPENAI_API_KEY=your_openai_key_here
        ```
      </Step>

      <Step title="Run your script">
        ```bash
        python main.py
        ```
      </Step>
    </Steps>
  </Tab>
</Tabs>

## Next Steps

Now that you have Stagehand running, you can:

1. **Learn the core concepts**: Check out [Act](../concepts/act.md) and [Extract](../reference/extract.md) to understand how to interact with web pages
2. **Explore examples**: Look at our [examples](../examples/best_practices.md) for common patterns and best practices
3. **Integrate with your app**: See how to use Stagehand in [Next.js](../examples/nextjs.md) or other frameworks
4. **Customize your setup**: Learn about [browser customization](../examples/customize_browser.md) and [LLM options](../examples/custom_llms.md)