# Langchain JS

> Integrate Stagehand with Langchain JS

Stagehand can be integrated into Langchain JS by wrapping Stagehand's browser automation functionality with the `StagehandToolkit`.

This toolkit provides specialized tools such as `navigate`, `act`, `extract`, and `observe`, all powered by Stagehand's underlying capabilities.

For more details on this integration and how to work with Langchain, see the [official Langchain documentation](https://js.langchain.com/docs/integrations/tools/stagehand/).

Below is a high-level overview to get started:

## Installation

Install the necessary packages:

```bash
npm install @langchain/langgraph @langchain/community @langchain/core @browserbasehq/stagehand
```

## Create a Stagehand instance

```typescript
const stagehand = new Stagehand({
	env: "LOCAL",
	verbose: 2,
	enableCaching: false,
});
```

## Generate a Stagehand Toolkit object

```typescript
const stagehandToolkit = await StagehandToolkit.fromStagehand(stagehand);
```

## Use the tools

* `stagehand_navigate`: Navigate to a specific URL.
* `stagehand_act`: Perform browser automation tasks like clicking buttons and typing in fields.
* `stagehand_extract`: Extract structured data from pages using Zod schemas.
* `stagehand_observe`: Investigate the DOM for possible actions or relevant elements.

Example standalone usage:

```typescript
// Find the relevant tool
const navigateTool = stagehandToolkit.tools.find(
(t) => t.name === "stagehand_navigate");

// Invoke it
await navigateTool.invoke("https://www.google.com");

// Suppose you want to act on the page
const actionTool = stagehandToolkit.tools.find(
(t) => t.name === "stagehand_act");

await actionTool.invoke('Search for "OpenAI"');

// Observe the current page
const observeTool = stagehandToolkit.tools.find(
(t) => t.name === "stagehand_observe");

const observations = await observeTool.invoke();
console.log(observations);
```

## Complete Example with Langchain Agent

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { Stagehand } from "@browserbasehq/stagehand";
import { StagehandToolkit } from "@langchain/community/agents/toolkits";

async function main() {
  // Initialize Stagehand
  const stagehand = new Stagehand({
    env: "BROWSERBASE",
    apiKey: process.env.BROWSERBASE_API_KEY,
    projectId: process.env.BROWSERBASE_PROJECT_ID,
  });
  
  await stagehand.init();

  // Create toolkit
  const toolkit = await StagehandToolkit.fromStagehand(stagehand);

  // Create LLM
  const llm = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0,
  });

  // Create agent
  const agent = createReactAgent({
    llm,
    tools: toolkit.tools,
  });

  // Run the agent
  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "Go to hacker news and tell me the top story",
      },
    ],
  });

  console.log(result);
  
  await stagehand.close();
}

main();
```

## Available Tools in Detail

### stagehand_navigate
Navigate to any URL in the browser.

```typescript
await navigateTool.invoke("https://example.com");
```

### stagehand_act
Perform actions on the page using natural language.

```typescript
await actionTool.invoke("Click the login button");
await actionTool.invoke("Type 'hello@example.com' in the email field");
```

### stagehand_extract
Extract structured data from the current page.

```typescript
const extractTool = toolkit.tools.find(t => t.name === "stagehand_extract");
const data = await extractTool.invoke({
  instruction: "Extract all product prices",
  schema: z.object({
    prices: z.array(z.string()),
  }),
});
```

### stagehand_observe
Get information about actionable elements on the page.

```typescript
const observations = await observeTool.invoke("Find all clickable buttons");
console.log(observations);
```