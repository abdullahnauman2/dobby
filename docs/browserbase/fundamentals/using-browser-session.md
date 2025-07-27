# Using a Browser Session

## Connecting to a Session

Once you [create a session](/fundamentals/create-browser-session), you'll receive a connection URL that you can use with your preferred automation framework.

### Connection Methods

The documentation provides connection examples for multiple frameworks, with a Node.js/Stagehand example:

```typescript
import { Browserbase } from "@browserbasehq/sdk";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });

// Create a session
const session = await bb.sessions.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID
});

// Connect and automate
const browser = await bb.connect(session.id);
```

## Connection Best Practices

1. **Connection Timeout**
   - 5 minutes to connect to a newly created session
   - Enable keep alive for long-running sessions
   - Use connection URL immediately after receiving it

2. **Use Default Context**
   - Always use the default context and page for proper functionality

## Controlling the Browser

Use your preferred framework's APIs to control the browser. Supported frameworks include:
- Stagehand
- Playwright
- Puppeteer
- Selenium

## Browserbase Features

Special cloud browser operations include:
- File Downloads
- Screenshots
- PDF Generation
- File Upload

## Live View Features

### Session Inspector
Real-time debugging capabilities including:
- Live browser state
- Network requests/responses
- Console output
- Performance metrics
- Session recording

### Embedded View
Integrate live browser sessions directly into applications

## Ending Your Session

Browserbase automatically handles session termination when you disconnect. For detailed session management, refer to the [Manage a Browser Session](/fundamentals/manage-browser-session) guide.