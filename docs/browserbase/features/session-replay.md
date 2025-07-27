# Session Replay

## Overview

Session Replays are a powerful feature of Browserbase that allows you to replay a Session to inspect actions performed and network requests, page by page.

## Install the Browserbase SDK

```bash
npm install @browserbasehq/sdk tsx
```

## Create a Script to Record a Session and View the Replay

```typescript
import { chromium } from "playwright-core";
import Browserbase from "@browserbasehq/sdk";

if (!process.env.BROWSERBASE_API_KEY || !process.env.BROWSERBASE_PROJECT_ID) {
  throw new Error("Missing required environment variables");
}

const BROWSERBASE_PROJECT_ID = process.env.BROWSERBASE_PROJECT_ID;
const BROWSERBASE_API_KEY = process.env.BROWSERBASE_API_KEY;

const bb = new Browserbase({
  apiKey: BROWSERBASE_API_KEY,
});

(async () => {
  // Create a new session
  const session = await bb.sessions.create({
    projectId: BROWSERBASE_PROJECT_ID,
  });

  // Connect to the session
  const browser = await chromium.connectOverCDP(session.connectUrl);

  // Getting the default context to ensure the sessions are recorded.
  const defaultContext = browser.contexts()[0];
  const page = defaultContext?.pages()[0];

  // Navigate to the Browserbase docs and wait for 10 seconds
  await page.goto("https://docs.browserbase.com/introduction");
  await page.waitForTimeout(10000);
  await page.close();
  await browser.close();

  // Log the session replay URL
  console.log(
    `Session complete! View replay at https://browserbase.com/sessions/${session.id}`,
  );
})().catch((error) => console.error(error.message));
```

## Key Features

- Replay entire browser sessions
- Inspect network requests
- View console logs
- Analyze DOM changes
- Support for HAR (HTTP Archive) recordings

## Debugging Options

- Run the session again
- Use Live View for real-time debugging

## Limitations

- Not suitable for multi-tab sessions with complex interactions
- Replay speed may differ from actual session execution
- Some dynamic content may not replay exactly as it occurred

## Viewing Replays

Session replays can be viewed in the Browserbase dashboard at:
```
https://browserbase.com/sessions/{session-id}
```

## Programmatic Access

You can also access session replay data programmatically:

```typescript
import Browserbase from "@browserbasehq/sdk";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });

// Get session details including replay information
const session = await bb.sessions.get(sessionId);
console.log("Session replay URL:", `https://browserbase.com/sessions/${session.id}`);

// Get session logs for detailed analysis
const logs = await bb.sessions.logs.list(sessionId);
```

## Use Cases

- **Debugging**: Identify where automation scripts fail
- **Performance Analysis**: Analyze page load times and resource usage
- **Compliance**: Record sessions for audit purposes
- **Training**: Create examples of successful automation workflows
- **Monitoring**: Track automated process execution over time