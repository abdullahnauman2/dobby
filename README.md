WHENEVER YOU MAKE A CHANGE THAT WOULD BASICALLY REQUIRE AN UPDATE TO THE CLAUDE.MD FILE, MAKE SURE YOU ALSO UPDATE THE CLAUDE.MD FILE SO THAT IT STAYS UP-TO-DATE AND IN SYNC WITH THE STATE OF THE CODEBASE.

# Dobby

A TypeScript Express server designed for deployment on Google Cloud Run.

## Features

- TypeScript with ES2022 target
- Express.js framework
- Configured for Google Cloud Run (port 8080)
- Hot-reloading development environment
- Strict TypeScript configuration

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

```bash
npm install
```

## Available Scripts

- `npm run dev` - Start the development server with hot-reloading
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled production server

## API Endpoints

### GET /
Returns a JSON message showing the service status.

**Response:**
```json
{
  "status": "running",
  "service": "dobby",
  "message": "Dobby is free! Service is running successfully.",
  "timestamp": "2024-01-25T12:00:00.000Z"
}
```

### POST /generate-video
Right now, accepts a JSON body and returns a "Hello World" response.

**Request Body:**
```json
{
  "any": "data"
}
```

**Response:**
```json
{
  "message": "Hello World",
  "timestamp": "2024-01-25T12:00:00.000Z",
  "receivedData": { "any": "data" }
}
```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=8080
```

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The server will start on `http://localhost:8080`

## Production Build

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Deployment to Google Cloud Run

This server is configured to listen on port 8080, which is the default port for Google Cloud Run.

1. Build your container image
2. Deploy to Cloud Run
3. The service will automatically use port 8080

## Project Structure

```
dobby/
├── src/
│   └── server.ts      # Main server file
├── dist/              # Compiled JavaScript (generated)
├── .env               # Environment variables
├── .gitignore         # Git ignore file
├── package.json       # Project dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── README.md          # This file
```

# What we are trying to build
## Browserbase Video Generation System - Complete Architecture

### System Overview

We're building a parallel video generation system that maintains 10 persistent browser sessions, each authenticated with a different Google account. The system accepts requests containing a text prompt and reference image, then generates videos through a web-based video generation service. It can handle up to 10 concurrent video generation requests.

### Core Architecture Components

#### 1. **Context-Based Authentication Strategy**
Instead of maintaining long-running browser sessions, we use Browserbase's context feature. A context is like a saved browser profile that preserves:
- Authentication cookies (Google login state)
- Local storage data
- Session tokens
- Browser cache

We create 10 contexts (user0-context through user9-context), each logged into the video generation website using a different Google account. These contexts persist indefinitely, meaning we only need to log in once during initial setup.

#### 2. **On-Demand Session Creation**
When a request arrives, we:
- Find an available context from our pool
- Create a new Browserbase session using that context
- The session starts already logged in (no authentication needed)
- Generate the video
- Close the session and release the context

This approach is more reliable than keeping sessions alive because:
- No 6-hour timeout limitations
- Clean browser state for each request
- More resource-efficient (only pay for active generation time)
- Automatic recovery from crashes

### Request Processing Flow

#### Step 1: Client Request
A client sends a POST request to `/generate-video` containing:
- A text prompt (e.g., "bananas in pajamas")
- A reference image file (e.g., banana.png)

#### Step 2: Context Acquisition
The server's Context Pool Manager:
- Tracks which contexts are currently in use
- Finds an available context (e.g., user0-context)
- Marks it as occupied
- If all contexts are busy, the request waits or returns an error

#### Step 3: File Upload to Browserbase
The reference image must be uploaded to Browserbase's cloud storage:
- Server reads the client's image file
- Uses Browserbase Upload API to transfer it to their storage
- Receives a file identifier for use within the browser session

#### Step 4: Session Creation
Server creates a new Browserbase session:
- Specifies the acquired context ID
- Sets `persist: true` to save any state changes back to the context
- Receives a session ID and connection details

#### Step 5: Browser Automation with Stagehand
Stagehand (Browserbase's AI-powered automation tool) handles the interaction:
- Navigates to the video generation website (already logged in via context)
- Uses natural language commands like:
  - "Type 'bananas in pajamas' into the prompt field"
  - "Upload the image to the file upload area"
  - "Click the generate video button"
  - "Wait for video generation to complete"
  - "Click the download button"

#### Step 6: Video Download Handling
When the download button is clicked:
- The video file downloads to Browserbase's cloud storage (not locally)
- The file receives a timestamp to prevent naming conflicts
- The download completes in the background

#### Step 7: File Retrieval
Server retrieves the generated video:
- Uses Browserbase Downloads API to list files for the session
- Finds the MP4 file by extension
- Downloads the file from Browserbase to the server

#### Step 8: Client Response
Server streams the video back to the client:
- Sets appropriate headers (Content-Type: video/mp4)
- Streams the file directly to avoid memory issues
- Includes metadata like generation time

#### Step 9: Cleanup
After successful response:
- Close the Browserbase session
- Release the context back to the pool
- Context is immediately available for the next request

### Key Design Decisions

#### Why Multiple Users?
Browserbase contexts cannot be used concurrently. If we used a single user account, we could only process one video at a time. With 10 different Google accounts and contexts, we achieve true parallel processing.

#### Why Contexts Instead of Persistent Sessions?
- **Reliability**: No session timeout issues (6-hour maximum)
- **Cost**: Only pay for actual generation time
- **Stability**: Fresh browser instance for each request
- **Maintenance**: Contexts persist authentication indefinitely

#### File Handling Through Browserbase
All file operations go through Browserbase's APIs:
- **Uploads**: Client → Your Server → Browserbase Storage → Website
- **Downloads**: Website → Browserbase Storage → Your Server → Client

This is necessary because Browserbase sessions don't have direct filesystem access.

### Setup Process

#### One-Time Context Creation
1. Create 10 Google accounts (or use existing ones)
2. For each account:
   - Create a Browserbase session with a new context ID
   - Use Session Live View to manually log in via Google
   - Complete any two-factor authentication
   - Navigate to the video generation site
   - Context automatically saves the authentication state

#### Context Pool Manager
Maintains a data structure tracking:
- Context IDs (user0-context through user9-context)
- Availability status (in-use/available)
- Last used timestamp (for sync delays)
- Health status (working/needs-reauth)

### Error Handling and Edge Cases

#### Authentication Expiry
- Monitor each request for login redirects
- Mark contexts as unhealthy if authentication fails
- Alert for manual re-authentication
- Exclude unhealthy contexts from the pool

#### Request Queueing
When all contexts are busy:
- Option 1: Return "service busy" error immediately
- Option 2: Implement a queue with timeout
- Option 3: Show estimated wait time

#### Context Synchronization
After a session uses a context, there's a brief delay before it's ready for reuse. The system adds a 2-second buffer between context uses to ensure proper state synchronization.

### Monitoring and Maintenance

#### Health Checks
- Periodic validation of context authentication
- Track success/failure rates per context
- Alert on repeated failures

#### Performance Metrics
- Average video generation time
- Context utilization rates
- Queue depths and wait times
- File upload/download speeds

### Scalability Considerations

To scale beyond 10 concurrent videos:
- Create additional Google accounts and contexts
- Implement multiple server instances with shared context pool
- Consider context rotation strategies
- Monitor Google account limits and rate limiting

This architecture provides a robust, scalable solution for parallel video generation while handling the complexities of authentication persistence and file management in a headless browser environment.

## Stagehand Docs For When Writing Stagehand Code

- [Interact with a website](https://docs.stagehand.dev/concepts/act.md): You can use Stagehand to intelligently interact with a website using AI
- [Build a web browsing agent](https://docs.stagehand.dev/concepts/agent.md): Build an AI agent that can autonomously control a browser with Stagehand
- [Best Practices](https://docs.stagehand.dev/examples/best_practices.md): Prompting Stagehand places an emphasis on being atomic and specific. Here are some guidelines to help you use Stagehand effectively.
- [Caching Actions](https://docs.stagehand.dev/examples/caching.md): You can cache actions in Stagehand to avoid redundant LLM calls.
- [Computer Use Agents](https://docs.stagehand.dev/examples/computer_use.md): Incorporate Computer Use APIs from Anthropic and OpenAI with one line of code in Stagehand.
- [Contribute to Stagehand](https://docs.stagehand.dev/examples/contributing.md): Best practices for making a meaningful contribution to Stagehand
- [LLM Customization](https://docs.stagehand.dev/examples/custom_llms.md): Stagehand supports a wide variety of LLMs. You can use any LLM that supports structured outputs with our existing clients, or by writing a custom LLM provider.
- [Browser Customization](https://docs.stagehand.dev/examples/customize_browser.md): Stagehand can run on any Chromium-based browser, like Chrome, Edge, Arc, and Brave.
- [Stagehand in Next.js](https://docs.stagehand.dev/examples/nextjs.md): Next.js is a popular framework for developing web-based applications in production. It powers Stagehand apps like [Director](https://director.ai), [Brainrot](https://brainrot.run) and [Open Operator](https://operator.browserbase.com).
- [Telemetry and Evaluations](https://docs.stagehand.dev/examples/running_evals.md): How to view LLM usage and run evals on your Stagehand workflows.
- [Install Stagehand](https://docs.stagehand.dev/get_started/integrate_stagehand.md)
- [What is Stagehand?](https://docs.stagehand.dev/get_started/introduction.md): Stagehand allows you to automate browsers with natural language and code.
- [Quickstart](https://docs.stagehand.dev/get_started/quickstart.md)
- [CrewAI Integration](https://docs.stagehand.dev/integrations/crew-ai.md): Automate browser tasks using natural language instructions with CrewAI
- [TypeScript Playbook](https://docs.stagehand.dev/integrations/guides.md): Ready-to-run templates via npx create-browser-app
- [Langchain JS](https://docs.stagehand.dev/integrations/langchain.md): Integrate Stagehand with Langchain JS
- [Browserbase MCP Server Configuration](https://docs.stagehand.dev/integrations/mcp/configuration.md): Configure your browser automation with command-line flags, environment variables, and advanced options
- [Browserbase MCP Server](https://docs.stagehand.dev/integrations/mcp/introduction.md): AI-powered browser automation through Model Context Protocol integration with Stagehand
- [Browserbase MCP Server Setup](https://docs.stagehand.dev/integrations/mcp/setup.md): Add the Browserbase MCP Server to Claude
- [Browserbase MCP Server Tools](https://docs.stagehand.dev/integrations/mcp/tools.md): This guide covers the specialized tools available in the Browserbase MCP server for browser automation and interaction.
- [Act](https://docs.stagehand.dev/reference/act.md): Perform actions on the current page
- [Agent](https://docs.stagehand.dev/reference/agent.md): Web AI agents for any task
- [Extract](https://docs.stagehand.dev/reference/extract.md): Extract structured data from the page
- [Configuration](https://docs.stagehand.dev/reference/initialization_config.md): How to configure Stagehand
- [Observe](https://docs.stagehand.dev/reference/observe.md): Get candidate DOM elements for actions
- [Playwright Interoperability](https://docs.stagehand.dev/reference/playwright_interop.md): How Stagehand interacts with Playwright
# Browserbase Documentation

## Docs

- [Browser Extensions](https://docs.browserbase.com/features/browser-extensions.md): Augment your browser sessions with your own Chrome extensions.
- [Contexts](https://docs.browserbase.com/features/contexts.md): Reuse cookies, authentication, and cached data across browser sessions.
- [Downloads](https://docs.browserbase.com/features/downloads.md): Triggering and retrieving downloaded files
- [Proxies](https://docs.browserbase.com/features/proxies.md): Route your automation traffic with precision & control
- [Screenshots and PDFs](https://docs.browserbase.com/features/screenshots.md)
- [Session Inspector](https://docs.browserbase.com/features/session-inspector.md): Real-time monitoring and debugging tools for your browser sessions
- [Live View](https://docs.browserbase.com/features/session-live-view.md): An interactive window to display or control a browser session.
- [Metadata](https://docs.browserbase.com/features/session-metadata.md): Tag and query Sessions with custom data
- [Session Replay](https://docs.browserbase.com/features/session-replay.md): Replay a Session to inspect the actions performed and network requests
- [Stealth Mode](https://docs.browserbase.com/features/stealth-mode.md): How to use Stealth Mode for CAPTCHA solving and anti-bot avoidance.
- [Uploads](https://docs.browserbase.com/features/uploads.md)
- [Viewports](https://docs.browserbase.com/features/viewports.md): Configure viewport sizes for your sessions
- [Create a Browser Session](https://docs.browserbase.com/fundamentals/create-browser-session.md): Learn how to create and configure browser sessions in Browserbase
- [Manage a Browser Session](https://docs.browserbase.com/fundamentals/manage-browser-session.md): Learn how to manage session termination and inspect completed sessions
- [Using a Browser Session](https://docs.browserbase.com/fundamentals/using-browser-session.md): Learn how to connect to and interact with browser sessions
- [Handling Authentication](https://docs.browserbase.com/guides/authentication.md): Managing 2FA and other authentication flows.
- [Concurrency & Rate Limits](https://docs.browserbase.com/guides/concurrency-rate-limits.md): Session limits and rate controls for concurrent browsers

Whenever you make a change that would basically require an update to the claw.md file, make sure you also update the claw.md file so that it stays up-to-date and in sync with the state of the codebase. 