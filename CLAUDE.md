# Dobby - Browser Automation System Instructions

You are an expert software engineer specializing in browser automation, working on the Dobby project - a parallel video generation system using BrowserBase and StageHand. The video generation website we're doing this for is https://labs.google/fx/tools/flow. We have permission to help them with this.


<critical_warning>
BrowserBase and StageHand are RECENT technologies that may not be in your training data. You MUST read and reference the documentation in the ./docs/ folder before ANY implementation. Never guess or assume how these libraries work.
</critical_warning>

<update_requirement>
WHENEVER YOU MAKE A CHANGE THAT WOULD BASICALLY REQUIRE AN UPDATE TO THE CLAUDE.MD FILE, MAKE SURE YOU ALSO UPDATE THE CLAUDE.MD FILE SO THAT IT STAYS UP-TO-DATE AND IN SYNC WITH THE STATE OF THE CODEBASE.
</update_requirement>

<project_overview>
We're building a parallel video generation system that maintains 10 persistent browser sessions, each authenticated with a different Google account. The system accepts requests containing a text prompt and reference image, then generates videos through a web-based video generation service. It can handle up to 10 concurrent video generation requests.
</project_overview>

<critical_dependencies>
<dependency name="BrowserBase">
<description>A cloud browser provider for AI agents and applications</description>
<documentation_path>./docs/browserbase/</documentation_path>
<important_note>This is a recent technology. Always check documentation before implementation.</important_note>
</dependency>
<dependency name="StageHand">
<description>Makes it easy for both developers and agents to control a browser</description>
<documentation_path>./docs/stagehand/</documentation_path>
<important_note>This is a recent technology. Always check documentation before implementation.</important_note>
</dependency>
</critical_dependencies>

<mandatory_documentation_process>
For EVERY task involving BrowserBase or StageHand:

1. State which technology you'll use
2. Read the relevant documentation file from ./docs/
3. Quote the specific methods/APIs you'll use directly from the docs
4. Implement based on documented examples
5. Add comments citing doc references (e.g., "// From ./docs/stagehand/reference/act.md")
6. If uncertain about any API or method, say "I need to check the documentation" and read it
   </mandatory_documentation_process>

<hallucination_prevention>

- If you're unsure about a BrowserBase or StageHand method, say "I don't know, let me check the documentation"
- Always cite the specific documentation file and section you're referencing
- Use direct quotes from documentation files when explaining functionality
- Verify each implementation detail against the docs before writing code
- Never make assumptions about APIs - if it's not in the docs, ask for clarification
  </hallucination_prevention>

## Core Architecture Components

### 1. Context-Based Authentication Strategy

<context_strategy>
Instead of maintaining long-running browser sessions, we use Browserbase's context feature. A context is like a saved browser profile that preserves:

- Authentication cookies (Google login state)
- Local storage data
- Session tokens
- Browser cache

We create 10 contexts (dobby.worker0 through dobby.worker9), each logged into the video generation website using a different Google account (dobby.worker0@gmail.com, etc). These contexts persist indefinitely, meaning we only need to log in once during initial setup.
</context_strategy>

### 2. On-Demand Session Creation

<session_workflow>
When a request arrives, we:

1. Find an available context from our worker pool
2. Create a new Browserbase session using that context
3. The session starts already logged in (no authentication needed)
4. Generate the video
5. Close the session and release the context back to the worker pool

Note: In this system, "worker" and "context" are used interchangeably - each worker is a browserbase context.
</session_workflow>

<advantages>
This approach is more reliable than keeping sessions alive because:
- No 6-hour timeout limitations
- Clean browser state for each request
- More resource-efficient (only pay for active generation time)
- Automatic recovery from crashes
</advantages>

## Request Processing Flow

Here is the automation we are building:

### Step 1: Client Request

<step_1_details>
A client sends a POST request to `/generate/text-to-video` containing:

- A text prompt (e.g., "bananas in pajamas")
- TODO: Reference image support will be added in a future update
  </step_1_details>

### Step 2: Context Acquisition

<step_2_details>
The server's Context Pool Manager:

- Tracks which contexts are currently in use
- Finds an available context (e.g., user0-context)
- Marks it as occupied
- If all contexts are busy, the request waits or returns an error
  </step_2_details>

### Step 3: Session Creation

<step_3_details>
Server creates a new Browserbase session:

- Specifies the acquired context ID
- Sets `persist: true` to save any state changes back to the context
- Receives a session ID and connection details
  </step_3_details>

### Step 4: Browser Automation with Stagehand

<step_4_details>
Stagehand (Browserbase's AI-powered automation tool) handles the interaction:

- Navigates to https://labs.google/fx/tools/flow (already logged in via context)
- Clicks the "New Project" button with a plus icon towards the bottom of the page
- Configures generation settings:
  - Clicks the Tune icon in the top right corner of the text box
  - Sets "Outputs per prompt" dropdown to 1
  - Sets "Model" dropdown to "Veo 3 - Fast"
  - Closes the settings menu
- Types the prompt in the text box at the bottom that has hint text "Generate a video with text"
- Clicks the submit button (circle button with arrow → on the bottom right corner of the text box)
- Waits for the video to generate:
  - Flow generates 1 video for each prompt
  - Progress is shown as percentages (e.g., "50%", "100%")
  - Generation is complete when the gray loading frame turns into a vivid video frame
  - The percentage may jump from ~80% directly to completion
  - Maximum wait time: 10 minutes (increased from 5 minutes)
  - Server timeout is set to 12 minutes to accommodate long video generation
- Takes a screenshot to track progress after the video is generated
- For the video:
  - Hovers over the video frame to reveal floating action menu
  - Clicks the download icon (first of three icons in top right corner)
  - Selects "Original sized" from the download menu (not "Animated GIF" or "upscaled")
- Downloads the MP4 file to Browserbase storage
    </step_4_details>

### Step 5: Video Download Handling

<step_5_details>
When the download button is clicked:

- The video file downloads to Browserbase's cloud storage (not locally)
- The file receives a timestamp to prevent naming conflicts
- Download completes in the background
- One MP4 file is stored
  </step_5_details>

### Step 6: File Retrieval

<step_6_details>
Server retrieves the generated video:

- Uses Browserbase Downloads API to list files for the session
- Retrieves all downloads as a zip file containing the MP4 file
- TODO: Extract the MP4 file from the zip
- Returns the video to the client
  </step_6_details>

### Step 7: Client Response

<step_7_details>
Server returns the video to the client:

- TODO: Extract and stream the MP4 file from the zip
- Sets appropriate headers (Content-Type: video/mp4)
- Streams file directly to avoid memory issues
- Includes metadata like generation time and progress screenshot
  </step_7_details>

### Step 8: Cleanup

<step_8_details>
After successful response:

- Close the Browserbase session
- Release the context back to the pool
- Context is immediately available for the next request
  </step_8_details>

## Model Configuration

### Recommended LLM Model

<model_recommendation>
We recommend using Google's Gemini 2.5 Pro instead of GPT-4o for the following reasons:
- **Advanced Reasoning**: Enhanced thinking capabilities for complex browser automation tasks
- **No Rate Limits**: Avoids the 30k TPM limit issues with GPT-4o 
- **Superior Performance**: State-of-the-art performance on a wide range of benchmarks
- **Large Context**: 1 million token context window (2 million coming soon)
- **Thinking Models**: Built-in reasoning capabilities for improved accuracy

The system automatically uses Gemini if GOOGLE_API_KEY is set, otherwise falls back to OpenAI.
</model_recommendation>

## Key Design Decisions

### Why Multiple Users?

<multiple_users_rationale>
Browserbase contexts cannot be used concurrently. If we used a single user account, we could only process one video at a time. With 10 different Google accounts and contexts, we achieve parallel processing.
</multiple_users_rationale>

### Why Contexts Instead of Persistent Sessions?

<context_advantages>

- **Reliability**: No session timeout issues (6-hour maximum)
- **Cost**: Only pay for actual generation time
- **Stability**: Fresh browser instance for each request
- **Maintenance**: Contexts persist authentication indefinitely
  </context_advantages>

### File Handling Through Browserbase

<file_handling_flow>
All file operations go through Browserbase's APIs:

- **Uploads**: Client → Your Server → Browserbase Storage → Website
- **Downloads**: Website → Browserbase Storage → Your Server → Client

This is necessary because Browserbase sessions don't have direct filesystem access.
</file_handling_flow>

## Setup Process

### One-Time Context Creation

<setup_instructions>

1. Create 10 Google accounts (or use existing ones)
2. For each account:
   - Create a Browserbase session with a new context ID
   - Use Session Live View to manually log in via Google
   - Complete any two-factor authentication
   - Navigate to the video generation site
   - Context automatically saves the authentication state
     </setup_instructions>

### Context Pool Manager

<pool_manager_structure>
Maintains a data structure tracking:

- Context IDs (dobby.worker0 through dobby.worker9)
- Availability status (in-use/available)
- Last used timestamp (for sync delays)
- Health status (working/needs-reauth)
  </pool_manager_structure>

## Error Handling and Edge Cases

### Authentication Expiry

<auth_error_handling>

- Monitor each request for login redirects
- Mark contexts as unhealthy if authentication fails
- Alert for manual re-authentication
- Exclude unhealthy contexts from the pool
  </auth_error_handling>

### Extraction Schema Best Practices

<extraction_best_practices>
When using Stagehand's extract method for monitoring video generation status:

- Use nullable types (`.nullable()`) for fields that might not be present
- Include an "unknown" enum value for status fields
- Implement fallback extraction logic with simpler schemas
- Log extraction failures and continue gracefully
- Use clear, specific instructions that account for missing elements

Example pattern:
```typescript
// Primary extraction with flexible schema
const status = await page.extract({
  instruction: "Look for status, return null if not found",
  schema: z.object({
    field: z.type().nullable(),
    status: z.enum(["state1", "state2", "unknown"])
  })
});

// Fallback with simpler schema if primary fails
```
</extraction_best_practices>

### Request Queueing

<queue_handling>
When all contexts are busy, return "service busy" error for now, we will implement a queue later
</queue_handling>

## Documentation Structure

<stagehand_docs>

### Stagehand Documentation for Implementation Reference

When implementing Stagehand features, ALWAYS consult these documents first:

- **[Interact with a website](./docs/stagehand/concepts/act.md)**: Use Stagehand to intelligently interact with a website using AI
- **[Build a web browsing agent](./docs/stagehand/concepts/agent.md)**: Build an AI agent that can autonomously control a browser
- **[Best Practices](./docs/stagehand/examples/best_practices.md)**: Prompting guidelines - emphasis on being atomic and specific
- **[Caching Actions](./docs/stagehand/examples/caching.md)**: Cache actions to avoid redundant LLM calls
- **[Computer Use Agents](./docs/stagehand/examples/computer_use.md)**: Incorporate Computer Use APIs from Anthropic and OpenAI
- **[Contribute to Stagehand](./docs/stagehand/examples/contributing.md)**: Best practices for contributions
- **[LLM Customization](./docs/stagehand/examples/custom_llms.md)**: Support for various LLMs with structured outputs
- **[Browser Customization](./docs/stagehand/examples/customize_browser.md)**: Run on any Chromium-based browser
- **[Stagehand in Next.js](./docs/stagehand/examples/nextjs.md)**: Integration with Next.js framework
- **[Telemetry and Evaluations](./docs/stagehand/examples/running_evals.md)**: View LLM usage and run evals
- **[Install Stagehand](./docs/stagehand/get_started/integrate_stagehand.md)**: Installation guide
- **[What is Stagehand?](./docs/stagehand/get_started/introduction.md)**: Overview of browser automation with natural language
- **[Quickstart](./docs/stagehand/get_started/quickstart.md)**: Getting started quickly
- **[CrewAI Integration](./docs/stagehand/integrations/crew-ai.md)**: Automate browser tasks with CrewAI
- **[TypeScript Playbook](./docs/stagehand/integrations/guides.md)**: Ready-to-run templates
- **[Langchain JS](./docs/stagehand/integrations/langchain.md)**: Integrate with Langchain JS
- **[MCP Server Configuration](./docs/stagehand/integrations/mcp/configuration.md)**: Configure browser automation
- **[MCP Server](./docs/stagehand/integrations/mcp/introduction.md)**: AI-powered browser automation through MCP
- **[MCP Server Setup](./docs/stagehand/integrations/mcp/setup.md)**: Add MCP Server to Claude
- **[MCP Server Tools](./docs/stagehand/integrations/mcp/tools.md)**: Specialized tools for browser automation

### Core Stagehand API Reference

- **[Act](./docs/stagehand/reference/act.md)**: Perform actions on the current page
- **[Agent](./docs/stagehand/reference/agent.md)**: Web AI agents for any task
- **[Extract](./docs/stagehand/reference/extract.md)**: Extract structured data from the page
- **[Configuration](./docs/stagehand/reference/initialization_config.md)**: How to configure Stagehand
- **[Observe](./docs/stagehand/reference/observe.md)**: Get candidate DOM elements for actions
- **[Playwright Interoperability](./docs/stagehand/reference/playwright_interop.md)**: How Stagehand interacts with Playwright
  </stagehand_docs>

<browserbase_docs>

### Browserbase Documentation for Implementation Reference

When implementing Browserbase features, ALWAYS consult these documents first:

#### Features

- **[Browser Extensions](./docs/browserbase/features/browser-extensions.md)**: Augment sessions with Chrome extensions
- **[Contexts](./docs/browserbase/features/contexts.md)**: Reuse cookies, authentication, and cached data across sessions
- **[Downloads](./docs/browserbase/features/downloads.md)**: Triggering and retrieving downloaded files
- **[Proxies](./docs/browserbase/features/proxies.md)**: Route automation traffic with precision & control
- **[Screenshots and PDFs](./docs/browserbase/features/screenshots.md)**: Capture visual content
- **[Session Inspector](./docs/browserbase/features/session-inspector.md)**: Real-time monitoring and debugging tools
- **[Live View](./docs/browserbase/features/session-live-view.md)**: Interactive window to display or control sessions
- **[Metadata](./docs/browserbase/features/session-metadata.md)**: Tag and query Sessions with custom data
- **[Session Replay](./docs/browserbase/features/session-replay.md)**: Replay Sessions to inspect actions and network requests
- **[Stealth Mode](./docs/browserbase/features/stealth-mode.md)**: CAPTCHA solving and anti-bot avoidance
- **[Uploads](./docs/browserbase/features/uploads.md)**: Upload files to browser sessions
- **[Viewports](./docs/browserbase/features/viewports.md)**: Configure viewport sizes

#### Fundamentals

- **[Create a Browser Session](./docs/browserbase/fundamentals/create-browser-session.md)**: Create and configure sessions
- **[Manage a Browser Session](./docs/browserbase/fundamentals/manage-browser-session.md)**: Manage termination and inspect completed sessions
- **[Using a Browser Session](./docs/browserbase/fundamentals/using-browser-session.md)**: Connect to and interact with sessions

#### Guides

- **[Handling Authentication](./docs/browserbase/guides/authentication.md)**: Managing 2FA and other authentication flows
- **[Concurrency & Rate Limits](./docs/browserbase/guides/concurrency-rate-limits.md)**: Session limits and rate controls
  </browserbase_docs>
+
<implementation_checklist>

## Implementation Checklist

Before writing any code:

- [ ] Identify which technology (BrowserBase, StageHand, or both) is needed
- [ ] Read the relevant documentation sections
- [ ] Quote the specific APIs/methods from the docs
- [ ] Plan implementation based on documented examples
- [ ] Write code with inline documentation references

During implementation:

- [ ] Add comments citing specific doc sections
- [ ] Verify each method call against documentation
- [ ] Handle errors based on documented error patterns
- [ ] Test against documented behavior

If uncertain:

- [ ] Say "I need to check the documentation"
- [ ] Re-read relevant sections
- [ ] Quote directly from docs when explaining
- [ ] Ask for clarification if docs are insufficient
      </implementation_checklist>

<error_handling_protocol>
When encountering issues:

1. Check if the issue is documented in the relevant docs
2. Quote the error handling section from documentation
3. If not documented, explicitly state "This scenario is not covered in the documentation"
4. Never guess at solutions - ask for clarification or additional documentation
   </error_handling_protocol>
