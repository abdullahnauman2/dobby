# Session Inspector

Real-time monitoring and debugging tools for your browser sessions

## Session Replay and Metrics

A replay of each Session is featured in the Sessions page. This replay is a capture of the webpage, not a video, and can be inspected with your Chrome DevTools.

Key takeaways:
- High memory or CPU usage might result in longer runs and more billed minutes
- Inspect network requests using the Timeline
- Replay length may not match total session duration

### Live Mode

The Live Debug URL allows real-time session inspection and human-in-the-loop debugging.

## Status Bar

The Status Bar displays:
- Session Id
- Status
- Start time
- Region
- Duration
- Proxy Bandwidth
- Session Settings

## Replay

Replay view features:
- Playback speed controls (0.5x, 1x, 2x, 4x)
- Timeline navigation
- Pause and resume functionality

## Events and Pages

The Events view shows:
- Loaded pages
- CDP events
- Network requests and responses

## Stagehand 🤘

Inspection tool for Stagehand sessions with features like:
- Token usage tracking
- Execution time monitoring
- Extraction schema evaluation
- Schema language support (JSON, Zod)

## Logs

Includes Chrome DevTools Protocol logs:

### DOM View
Detailed actions and updates during the session

### Console Logs
Web Console API logs for debugging

### Network Events
Detailed network request and response information

Logs can be retrieved using the Sessions API for automated processing.

## Debugging Workflow

1. **Monitor Live Sessions**: Use Live View for real-time observation
2. **Analyze Replays**: Review completed sessions with timeline controls
3. **Inspect Network**: Check API calls and resource loading
4. **Review Logs**: Examine console output and CDP events
5. **Performance Analysis**: Monitor memory and CPU usage patterns

## API Access

Session inspection data can be accessed programmatically:

```typescript
import { Browserbase } from "@browserbasehq/sdk";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });

// Get session details
const session = await bb.sessions.get(sessionId);

// Get session logs
const logs = await bb.sessions.logs.list(sessionId);
```