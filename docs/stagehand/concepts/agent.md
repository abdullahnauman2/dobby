# Build a web browsing agent

> Build an AI agent that can autonomously control a browser with Stagehand

## Stagehand MCP
- Uses Claude 3.5/3.7 Sonnet for multimodal tool calling
- Allows an agent to "reason about the browser state and take actions separate from one another"

## Stagehand + Computer Use Models
Provides code examples in TypeScript and Python for creating browser agents with one-line setup:

```typescript
const agent = stagehand.agent({
  provider: "openai",
  model: "computer-use-preview"
});
```

## Sequential Tool Calling (Open Operator)
Describes a method for browser automation where an agent:
1. Goes to a default URL
2. Examines browser state
3. Uses an LLM to determine next actions
4. Executes actions using `page.act()`

The documentation includes code examples, diagrams, and a utility function for replaying agent actions, demonstrating Stagehand's flexibility in web browsing automation.