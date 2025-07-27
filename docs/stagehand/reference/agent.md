# Agent

> Web AI agents for any task

<CodeGroup>
  ```typescript TypeScript
  const agent = stagehand.agent();
  await agent.execute("Sign me up for a library card");
  ```

  ```python Python
  # Native Stagehand agent support for Python is coming soon.
  # agent = stagehand.agent()
  # await agent.execute("Sign me up for a library card")
  ```
</CodeGroup>

Software has always been deterministic and repeatable, but with AI agents it's difficult to replicate a workflow. **Stagehand combines the best of both worlds: intelligence and determinism**.

Web Agents in Stagehand are fully customizable. You can use any LLM / VLM / Computer Use provider, set system prompts, add custom tools, and more.

<CodeGroup>
  ```typescript TypeScript
  // For Computer Use Agent (CUA) models
  const agent = stagehand.agent({
    provider: "openai",
    model: "computer-use-preview",
    instructions: "You are a helpful assistant that can use a web browser.",
    options: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  });

  // You can define additional options like max_steps and auto_screenshot
  await agent.execute({
    instruction="Sign me up for a library card",
    max_steps=20,
  })
  ```

  ```python Python
  # For Computer Use Agent (CUA) models
  agent = stagehand.agent({
      model="computer-use-preview",
      instructions="You are a helpful assistant that can use a web browser.",
      options={
        "apiKey": os.getenv("OPENAI_API_KEY"),
      },
  })

  # You can define additional options like max_steps and auto_screenshot
  result = await agent.execute({
      instruction="Sign me up for a library card",
      max_steps=20
  })

  ```
</CodeGroup>

### **Arguments:** [`AgentOptions`](https://github.com/browserbase/stagehand/blob/main/types/agent.ts)

<Tabs>
  <Tab title="TypeScript">
    <ParamField path="provider" type="'openai' | 'anthropic'" required>
      The AI provider to use for the agent
    </ParamField>

    <ParamField path="model" type="string" required>
      The model name to use (e.g., 'computer-use-preview', 'claude-3-5-sonnet-20241022')
    </ParamField>

    <ParamField path="instructions" type="string" optional>
      System instructions for the agent. Default: "You are a helpful assistant that can use a web browser."
    </ParamField>

    <ParamField path="options" type="object" optional>
      Provider-specific options including API keys and configuration
    </ParamField>

    <ParamField path="enableCaching" type="boolean" optional>
      Enable caching of agent actions. Default: false
    </ParamField>

    <ParamField path="maxSteps" type="number" optional>
      Maximum number of steps the agent can take. Default: 10
    </ParamField>

    <ParamField path="autoScreenshot" type="boolean" optional>
      Automatically take screenshots between steps. Default: true
    </ParamField>
  </Tab>

  <Tab title="Python">
    <ParamField path="provider" type="'openai' | 'anthropic'" required>
      The AI provider to use for the agent
    </ParamField>

    <ParamField path="model" type="str" required>
      The model name to use (e.g., 'computer-use-preview', 'claude-3-5-sonnet-20241022')
    </ParamField>

    <ParamField path="instructions" type="str" optional>
      System instructions for the agent. Default: "You are a helpful assistant that can use a web browser."
    </ParamField>

    <ParamField path="options" type="dict" optional>
      Provider-specific options including API keys and configuration
    </ParamField>

    <ParamField path="enable_caching" type="bool" optional>
      Enable caching of agent actions. Default: False
    </ParamField>

    <ParamField path="max_steps" type="int" optional>
      Maximum number of steps the agent can take. Default: 10
    </ParamField>

    <ParamField path="auto_screenshot" type="bool" optional>
      Automatically take screenshots between steps. Default: True
    </ParamField>
  </Tab>
</Tabs>

### **Execute Options:** [`ExecuteOptions`](https://github.com/browserbase/stagehand/blob/main/types/agent.ts)

<Tabs>
  <Tab title="TypeScript">
    <ParamField path="instruction" type="string" required>
      The task or instruction for the agent to execute
    </ParamField>

    <ParamField path="maxSteps" type="number" optional>
      Override the default maximum steps for this execution
    </ParamField>

    <ParamField path="autoScreenshot" type="boolean" optional>
      Override the default screenshot behavior for this execution
    </ParamField>
  </Tab>

  <Tab title="Python">
    <ParamField path="instruction" type="str" required>
      The task or instruction for the agent to execute
    </ParamField>

    <ParamField path="max_steps" type="int" optional>
      Override the default maximum steps for this execution
    </ParamField>

    <ParamField path="auto_screenshot" type="bool" optional>
      Override the default screenshot behavior for this execution
    </ParamField>
  </Tab>
</Tabs>

### **Returns:**

<Tabs>
  <Tab title="TypeScript">
    `Promise<AgentResult>` - An object containing:
    - `success`: boolean indicating if the task was completed
    - `steps`: array of steps taken by the agent
    - `finalState`: final state of the browser/page
    - `error`: error message if the task failed
  </Tab>

  <Tab title="Python">
    `AgentResult` - An object containing:
    - `success`: bool indicating if the task was completed
    - `steps`: list of steps taken by the agent
    - `final_state`: final state of the browser/page
    - `error`: error message if the task failed
  </Tab>
</Tabs>

## Custom Tools

You can extend the agent's capabilities by providing custom tools:

<CodeGroup>
  ```typescript TypeScript
  const agent = stagehand.agent({
    provider: "openai",
    model: "gpt-4o",
    tools: [
      {
        name: "get_weather",
        description: "Get the current weather for a location",
        parameters: {
          type: "object",
          properties: {
            location: { type: "string" }
          }
        },
        handler: async ({ location }) => {
          // Your custom implementation
          return `Weather in ${location}: Sunny, 72°F`;
        }
      }
    ]
  });
  ```

  ```python Python
  # Custom tools for Python agents coming soon
  ```
</CodeGroup>