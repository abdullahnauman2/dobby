# Browserbase MCP Server Tools

> This guide covers the specialized tools available in the Browserbase MCP server for browser automation and interaction.

## Overview

The Browserbase MCP server provides comprehensive tools for browser automation and session management. These tools allow you to perform actions like navigating pages, capturing screenshots, manipulating cookies, and managing multiple browser sessions simultaneously.

## Core Browser Automation Tools

These are the primary tools for modern web automation using natural language commands.

<Accordion title="browserbase_stagehand_navigate">
  Navigate to any URL in the browser

  <ParamField path="url" type="string" required>
    The URL to navigate to
  </ParamField>
</Accordion>

<Accordion title="browserbase_stagehand_act">
  Perform an action on the web page using natural language

  <ParamField path="action" type="string" required>
    The action to perform (e.g., "click the login button", "fill form field")
  </ParamField>
</Accordion>

<Accordion title="browserbase_stagehand_extract">
  Extract all text content from the current page (filters out CSS and JavaScript)

  <ParamField path="instruction" type="string">
    Extracted text content from the current page
  </ParamField>
</Accordion>

<Accordion title="browserbase_stagehand_observe">
  Observe and find actionable elements on the web page

  <ParamField path="instruction" type="string" required>
    Specific instruction for observation (e.g., "find the login button", "locate search form")
  </ParamField>
</Accordion>

<Accordion title="browserbase_screenshot">
  Capture a PNG screenshot of the current page

  <Info>No input parameters required</Info>

  <ResponseField name="image" type="string">
    Base-64 encoded PNG data
  </ResponseField>
</Accordion>

## Single Session Management

Traditional approach with one active browser session. Simpler for basic automation tasks and automatically manages the active session.

<Accordion title="browserbase_session_create">
  Create or reuse a cloud browser session

  <ParamField path="options" type="object">
    Session configuration options (optional)
  </ParamField>
</Accordion>

<Accordion title="browserbase_session_close">
  Close the active browser session

  <Info>No input parameters required</Info>
</Accordion>

<Accordion title="browserbase_session_get_active">
  Get information about the currently active session

  <ResponseField name="sessionId" type="string">
    The ID of the active session
  </ResponseField>
  
  <ResponseField name="status" type="string">
    Current session status
  </ResponseField>
</Accordion>

## Multi-Session Management

Advanced control for managing multiple browser sessions simultaneously. Perfect for complex workflows requiring parallel operations.

<Accordion title="browserbase_sessions_create">
  Create a new cloud browser session

  <ParamField path="options" type="object">
    Session configuration options (optional)
  </ParamField>

  <ResponseField name="sessionId" type="string">
    The ID of the created session
  </ResponseField>
</Accordion>

<Accordion title="browserbase_sessions_close">
  Close a specific browser session

  <ParamField path="sessionId" type="string" required>
    The ID of the session to close
  </ParamField>
</Accordion>

<Accordion title="browserbase_sessions_list">
  List all active browser sessions

  <ResponseField name="sessions" type="array">
    Array of active session objects with IDs and metadata
  </ResponseField>
</Accordion>

<Accordion title="browserbase_sessions_switch">
  Switch to a different browser session

  <ParamField path="sessionId" type="string" required>
    The ID of the session to switch to
  </ParamField>
</Accordion>

## Cookie Management

<Accordion title="browserbase_cookies_get">
  Retrieve cookies from the current browser session

  <ParamField path="filter" type="object">
    Optional filter criteria (domain, name, etc.)
  </ParamField>

  <ResponseField name="cookies" type="array">
    Array of cookie objects
  </ResponseField>
</Accordion>

<Accordion title="browserbase_cookies_set">
  Set cookies in the current browser session

  <ParamField path="cookies" type="array" required>
    Array of cookie objects to set
  </ParamField>
</Accordion>

<Accordion title="browserbase_cookies_delete">
  Delete specific cookies from the browser

  <ParamField path="filter" type="object" required>
    Filter criteria to identify cookies to delete
  </ParamField>
</Accordion>

## Context Management

<Accordion title="browserbase_context_get">
  Get the current Browserbase context ID

  <ResponseField name="contextId" type="string">
    The ID of the current context
  </ResponseField>
</Accordion>

<Accordion title="browserbase_context_set">
  Set a Browserbase context for session persistence

  <ParamField path="contextId" type="string" required>
    The context ID to use
  </ParamField>
</Accordion>

## Usage Examples

### Basic Navigation and Interaction

```
User: Can you go to GitHub and search for "browserbase"?

Claude: I'll navigate to GitHub and search for "browserbase" for you.

[Uses browserbase_stagehand_navigate to go to github.com]
[Uses browserbase_stagehand_act to search]
```

### Multi-Session Workflow

```
User: I need to compare prices on Amazon and eBay for "wireless mouse"

Claude: I'll help you compare prices by opening both sites in separate sessions.

[Uses browserbase_sessions_create to create session 1]
[Uses browserbase_stagehand_navigate to go to Amazon]
[Uses browserbase_stagehand_act to search]
[Uses browserbase_sessions_create to create session 2]
[Uses browserbase_stagehand_navigate to go to eBay]
[Uses browserbase_stagehand_act to search]
[Uses browserbase_sessions_switch to compare results]
```

### Data Extraction

```
User: Can you extract all the article titles from the front page of Hacker News?

Claude: I'll extract the article titles from Hacker News for you.

[Uses browserbase_stagehand_navigate to go to news.ycombinator.com]
[Uses browserbase_stagehand_extract to get article titles]
```

## Best Practices

<CardGroup cols={2}>
  <Card title="Use Natural Language" icon="comment">
    Describe actions in plain English for best results
  </Card>

  <Card title="Be Specific" icon="bullseye">
    Provide clear, specific instructions for complex actions
  </Card>

  <Card title="Handle Errors" icon="shield-exclamation">
    Expect and plan for potential failures in automation
  </Card>

  <Card title="Manage Sessions" icon="layer-group">
    Close sessions when done to free up resources
  </Card>
</CardGroup>