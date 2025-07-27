# Browserbase MCP Server Setup

> Add the Browserbase MCP Server to Claude

## Quick Installation

<Card title="Install with Cursor" icon="arrow-pointer" href="cursor://anysphere.cursor-deeplink/mcp/install?name=browserbase&config=eyJjb21tYW5kIjoibnB4IEBicm93c2VyYmFzZWhxL21jcCIsImVudiI6eyJCUk9XU0VSQkFTRV9BUElfS0VZIjoiIiwiQlJPV1NFUkJBU0VfUFJPSkVDVF9JRCI6IiIsIkdFTUlOSV9BUElfS0VZIjoiIn19">
  One-click installation directly in Cursor with pre-configured settings
</Card>

We support multiple transport methods for our MCP server: STDIO and SHTTP. We recommend using SHTTP with our remote hosted URL to take advantage of the server at full capacity.

## Prerequisites

<Steps>
  <Step title="Get your Browserbase credentials">
    Get your Browserbase API key and project ID from the [Browserbase Dashboard](https://www.browserbase.com/overview).

    <Frame>
      <img src="https://mintlify.s3.us-west-1.amazonaws.com/stagehand/images/quickstart/api-key.png" alt="Browserbase API Key and Project ID settings" />
    </Frame>

    Then copy your API Key and Project ID directly from the input.
  </Step>
</Steps>

## Installation Methods

<Tabs>
  <Tab title="Remote URL (SHTTP)">
    Go to [smithery.ai](https://smithery.ai/server/@browserbasehq/mcp-browserbase) and enter your API keys and configuration to get a remote hosted URL.

    ![Smithery](https://mintlify.s3.us-west-1.amazonaws.com/stagehand/images/mcp/smithery.png)

    Then add the URL to your Claude Desktop configuration:

    <Tabs>
      <Tab title="macOS">
        Edit: `~/Library/Application Support/Claude/claude_desktop_config.json`
      </Tab>
      
      <Tab title="Windows">
        Edit: `%APPDATA%/Claude/claude_desktop_config.json`
      </Tab>
    </Tabs>

    ```json
    {
      "mcpServers": {
        "browserbase": {
          "url": "https://your-generated-url.smithery.ai/",
          "transport": "shttp"
        }
      }
    }
    ```

    <Note>
      The Smithery URL already includes your API keys, so you don't need to configure them separately.
    </Note>
  </Tab>

  <Tab title="NPX (STDIO)">
    Run the server using NPX with your API keys:

    <Tabs>
      <Tab title="macOS">
        Edit: `~/Library/Application Support/Claude/claude_desktop_config.json`
      </Tab>
      
      <Tab title="Windows">
        Edit: `%APPDATA%/Claude/claude_desktop_config.json`
      </Tab>
    </Tabs>

    ```json
    {
      "mcpServers": {
        "browserbase": {
          "command": "npx",
          "args": ["@browserbasehq/mcp"],
          "env": {
            "BROWSERBASE_API_KEY": "your-api-key",
            "BROWSERBASE_PROJECT_ID": "your-project-id"
          }
        }
      }
    }
    ```

    <Warning>
      Make sure to replace `your-api-key` and `your-project-id` with your actual credentials.
    </Warning>
  </Tab>

  <Tab title="Local Development">
    Clone and run the server locally for development:

    ```bash
    git clone https://github.com/browserbase/mcp-browserbase.git
    cd mcp-browserbase
    npm install
    npm run build
    ```

    Configure Claude Desktop:

    ```json
    {
      "mcpServers": {
        "browserbase": {
          "command": "node",
          "args": ["/path/to/mcp-browserbase/dist/index.js"],
          "env": {
            "BROWSERBASE_API_KEY": "your-api-key",
            "BROWSERBASE_PROJECT_ID": "your-project-id"
          }
        }
      }
    }
    ```
  </Tab>
</Tabs>

## Verify Installation

<Steps>
  <Step title="Restart Claude Desktop">
    After updating the configuration, completely quit and restart Claude Desktop.
  </Step>

  <Step title="Check MCP Connection">
    Look for the MCP icon (🔌) in Claude's interface. Click it to see connected servers.
  </Step>

  <Step title="Test the Integration">
    Try a simple command:
    ```
    Can you navigate to https://example.com and take a screenshot?
    ```
  </Step>
</Steps>

## Troubleshooting

<AccordionGroup>
  <Accordion title="Server not showing up in Claude">
    - Ensure the configuration file is valid JSON
    - Check that the file path is correct for your operating system
    - Restart Claude Desktop completely (quit and reopen)
  </Accordion>

  <Accordion title="Authentication errors">
    - Verify your API key and project ID are correct
    - Check that your Browserbase account is active
    - Ensure the environment variables are properly set
  </Accordion>

  <Accordion title="NPX command not found">
    - Install Node.js 18 or higher
    - Verify npm is installed: `npm --version`
    - Try using the full path to npx
  </Accordion>
</AccordionGroup>

## Next Steps

<CardGroup cols={2}>
  <Card title="Configuration Options" icon="sliders" href="./configuration">
    Learn about advanced configuration settings
  </Card>

  <Card title="Available Tools" icon="wrench" href="./tools">
    Explore all available browser automation tools
  </Card>
</CardGroup>