# Browserbase MCP Server Configuration

> Configure your browser automation with command-line flags, environment variables, and advanced options

## Configuration Overview

The Browserbase MCP server supports extensive configuration options through command-line flags and environment variables. Configure browser behavior, proxy settings, stealth modes, model selection, and more to customize your browser automation workflows.

<Note>
  Command-line flags are only available when running the server locally (`npx @browserbasehq/mcp` with flags or local development setup).
</Note>

## Environment Variables

Configure the essential Browserbase credentials and optional debugging settings:

<CardGroup cols={2}>
  <Card title="BROWSERBASE_API_KEY" icon="key">
    Your Browserbase API key for authentication
  </Card>

  <Card title="BROWSERBASE_PROJECT_ID" icon="key">
    Your Browserbase project ID
  </Card>
</CardGroup>

## Command-Line Flags

### Available Flags

| Flag                       | Description                                                                 |
| -------------------------- | --------------------------------------------------------------------------- |
| `--proxies`                | Enable Browserbase proxies for the session                                  |
| `--advancedStealth`        | Enable Browserbase Advanced Stealth (Scale Plan only)                       |
| `--contextId <contextId>`  | Specify a Browserbase Context ID to use                                     |
| `--persist [boolean]`      | Whether to persist the Browserbase context (default: true)                  |
| `--port <port>`            | Port to listen on for HTTP/SHTTP transport                                  |
| `--host <host>`            | Host to bind server to (default: localhost, use 0.0.0.0 for all interfaces) |
| `--cookies [json]`         | JSON array of cookies to inject into the browser                            |
| `--browserWidth <width>`   | Browser viewport width (default: 1024)                                      |
| `--browserHeight <height>` | Browser viewport height (default: 768)                                      |
| `--modelName <model>`      | The model to use for Stagehand (default: `gemini-2.0-flash-exp`)           |

### Usage Examples

<Tabs>
  <Tab title="NPX with Flags">
    ```json
    {
      "mcpServers": {
        "browserbase": {
          "command": "npx",
          "args": [
            "@browserbasehq/mcp",
            "--proxies",
            "--browserWidth", "1920",
            "--browserHeight", "1080",
            "--contextId", "my-saved-context"
          ],
          "env": {
            "BROWSERBASE_API_KEY": "your-api-key",
            "BROWSERBASE_PROJECT_ID": "your-project-id"
          }
        }
      }
    }
    ```
  </Tab>

  <Tab title="Local Development">
    ```bash
    node dist/index.js \
      --proxies \
      --advancedStealth \
      --browserWidth 1920 \
      --browserHeight 1080 \
      --modelName "openai/gpt-4o"
    ```
  </Tab>
</Tabs>

## Advanced Configuration

### Proxy Settings

Enable proxies to route your browser traffic through different locations:

```json
{
  "args": ["@browserbasehq/mcp", "--proxies"]
}
```

<Info>
  Proxies help with accessing geo-restricted content and avoiding rate limits.
</Info>

### Stealth Mode

For sites with advanced bot detection:

```json
{
  "args": ["@browserbasehq/mcp", "--advancedStealth"]
}
```

<Warning>
  Advanced Stealth is only available on Browserbase Scale plans.
</Warning>

### Browser Contexts

Save and reuse browser sessions with contexts:

```json
{
  "args": [
    "@browserbasehq/mcp",
    "--contextId", "shopping-logged-in",
    "--persist", "true"
  ]
}
```

### Cookie Injection

Pre-configure cookies for your sessions:

```json
{
  "args": [
    "@browserbasehq/mcp",
    "--cookies", "[{\"name\":\"session\",\"value\":\"abc123\",\"domain\":\".example.com\"}]"
  ]
}
```

### Custom Viewport

Set specific browser dimensions:

```json
{
  "args": [
    "@browserbasehq/mcp",
    "--browserWidth", "1920",
    "--browserHeight", "1080"
  ]
}
```

## Model Configuration

Choose from various AI models for browser automation:

<Tabs>
  <Tab title="Google Models">
    - `gemini-2.0-flash-exp` (default)
    - `gemini-1.5-flash`
    - `gemini-1.5-pro`
  </Tab>

  <Tab title="OpenAI Models">
    - `openai/gpt-4o`
    - `openai/gpt-4o-mini`
    - `openai/gpt-4-turbo`
  </Tab>

  <Tab title="Anthropic Models">
    - `anthropic/claude-3-5-sonnet-latest`
    - `anthropic/claude-3-opus-latest`
  </Tab>
</Tabs>

Configure your preferred model:

```json
{
  "args": ["@browserbasehq/mcp", "--modelName", "openai/gpt-4o"]
}
```

## Complete Configuration Example

Here's a comprehensive configuration for advanced use cases:

```json
{
  "mcpServers": {
    "browserbase": {
      "command": "npx",
      "args": [
        "@browserbasehq/mcp",
        "--proxies",
        "--advancedStealth",
        "--browserWidth", "1920",
        "--browserHeight", "1080",
        "--contextId", "my-automation-context",
        "--persist", "true",
        "--modelName", "openai/gpt-4o"
      ],
      "env": {
        "BROWSERBASE_API_KEY": "your-api-key",
        "BROWSERBASE_PROJECT_ID": "your-project-id",
        "OPENAI_API_KEY": "your-openai-key"
      }
    }
  }
}
```

## Best Practices

<CardGroup cols={2}>
  <Card title="Use Contexts" icon="save">
    Save authentication state and preferences across sessions
  </Card>

  <Card title="Enable Proxies" icon="globe">
    Use proxies for better reliability and geo-targeting
  </Card>

  <Card title="Set Viewport" icon="expand">
    Match your target website's expected dimensions
  </Card>

  <Card title="Choose Models Wisely" icon="brain">
    Select models based on speed vs accuracy needs
  </Card>
</CardGroup>