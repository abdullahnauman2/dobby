# Create a Browser Session

## Overview

"A browser session represents a single browser instance running in the cloud. It's the fundamental building block of Browserbase, providing an isolated environment for your web automation tasks."

## Creating a Session

Browser sessions are created through the [Sessions API](/reference/api/create-a-session), which provides full control over configuration and features. After creation, you'll receive a connection URL to use with your preferred automation framework.

> Note: The create session API is rate limited based on your plan's concurrent session limits. See [Concurrency & Rate Limits](/guides/concurrency-rate-limits) for details.

### Code Example (Node.js)

```typescript
import { Browserbase } from "@browserbasehq/sdk";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
const session = await bb.sessions.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID!,
  // Add configuration options here
});
```

## Configuration Options

### Basic Settings

- **Region**: Choose where your browser runs to decrease latency
- **Viewport**: Set custom screen dimensions
- **Keep Alive**: Enable longer-running sessions
- **Recording**: Enable/disable session recording (default: enabled)
- **Logging**: Enable/disable session logging (default: enabled)

### Advanced Features

- **[Stealth Mode](/features/stealth-mode)**: Configure anti-bot mitigations
- **[Extensions](/features/browser-extensions)**: Load custom browser extensions
- **[Browser Context](/features/contexts)**: Configure isolated browsing contexts
- **[User Metadata](/features/session-metadata)**: Attach custom data for session organization

## Next Steps

1. Connect to the session using your preferred automation framework
2. Monitor through the [Session Inspector](/features/session-inspector)
3. End manually or let it timeout