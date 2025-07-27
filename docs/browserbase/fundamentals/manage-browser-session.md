# Manage a Browser Session

"While Browserbase automatically handles session termination when you disconnect, understanding how sessions end helps you debug failed runs, manage long-running sessions, optimize resource usage, and investigate timeouts or errors."

## Session Termination

Browser sessions can end in these ways:

1. **Automatic Timeout**
   - Sessions have a default timeout configured at the project level
   - Can be customized when creating a session
   - For longer tasks, enable [keep alive](/guides/long-running-sessions)

2. **Manual Termination**
   - End sessions by:
     - Closing browser programmatically (`browser.close()` or `driver.quit()`)
     - Using the Sessions API
     - Releasing keep-alive sessions when no longer needed

3. **Unhandled Errors**
   - Automation code errors can disconnect from the browser prematurely
   - Common scenarios include:
     - Network interruptions
     - Uncaught exceptions
     - Exceeded resource limits
   - Prevent premature termination by implementing proper error handling and cleanup

## Session Timeout Settings

Configure timeouts at two levels:

**Project Level**
- Set default timeout for all sessions in project settings

**Session Level**
- Override project timeout when creating specific sessions
- Provides fine-grained control over individual session durations

## Debugging Completed Sessions

Use the [Session Inspector](/features/session-inspector) to analyze completed sessions, including:
- Session Replay
- Network Monitor
- Console & Logs
- Performance Metrics

## Measuring Usage

Track browser session usage through:
- Dashboard at [browserbase.com/overview](https://browserbase.com/overview)
- Sessions List at [browserbase.com/sessions](https://browserbase.com/sessions)
- Programmatic access via Measuring Usage Guide