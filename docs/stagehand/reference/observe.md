# Observe

> Get candidate DOM elements for actions

`observe()` is used to get a list of actions that can be taken on the current page. It's useful for adding context to your planning step, or if you unsure of what page you're on.

<CodeGroup>
  ```typescript TypeScript
  const observations = await page.observe();
  ```

  ```python Python
  observations = await page.observe()
  ```
</CodeGroup>

`observe()` returns an array of objects, each with an XPath `selector` and short `description`.

If you are looking for a specific element, you can also pass in an instruction to observe:

<CodeGroup>
  ```typescript TypeScript
  const observations = await page.observe({
    instruction: "Find the buttons on this page",
  });
  ```

  ```python Python
  observations = await page.observe("Find the buttons on this page")
  ```
</CodeGroup>

Observe can also return a suggested action for the candidate element by setting the `returnAction` option to true. Here is a sample `ObserveResult`:

```json
{
  "description": "A brief description of the component",
  "method": "click",
  "arguments": [],
  "selector": "xpath=/html/body[1]/div[1]/main[1]/button[1]"
}
```

<Note>
  In Python, the ObserveResult is wrapped in a Pydantic model. You can use model\_dump() to get the `dict` equivalent.
</Note>

### **Arguments:** [`ObserveOptions`](https://github.com/browserbase/stagehand/blob/main/types/stagehand.ts)

<Tabs>
  <Tab title="TypeScript">
    <ParamField path="instruction" type="string" optional>
      Provides instructions for the observation. Defaults to "Find actions that can be performed on this page."
    </ParamField>

    <ParamField path="returnAction" type="boolean" optional>
      Returns an observe result object that contains a suggested action for the candidate element. The suggestion includes method, and arguments (e.g., fill, click, select, etc.). Default: false
    </ParamField>

    <ParamField path="modelName" type="AvailableModel" optional>
      Specifies the model to use for observation
    </ParamField>

    <ParamField path="domSettleTimeoutMs" type="number" optional>
      Maximum time to wait for the DOM to settle. Default: 30000 (30 seconds)
    </ParamField>

    <ParamField path="useVision" type="boolean" optional>
      Use visual analysis for observation. Default: false
    </ParamField>

    <ParamField path="requestId" type="string" optional>
      Custom request ID for tracking
    </ParamField>

    <ParamField path="includeHidden" type="boolean" optional>
      Include hidden elements in observations. Default: false
    </ParamField>

    <ParamField path="maxElements" type="number" optional>
      Maximum number of elements to return. Default: 50
    </ParamField>
  </Tab>

  <Tab title="Python">
    When using just a string:
    - The string is used as the instruction for observation

    When using a dictionary:
    <ParamField path="instruction" type="str" optional>
      Provides instructions for the observation. Defaults to "Find actions that can be performed on this page."
    </ParamField>

    <ParamField path="return_action" type="bool" optional>
      Returns an observe result object that contains a suggested action for the candidate element. Default: False
    </ParamField>

    <ParamField path="model_name" type="AvailableModel" optional>
      Specifies the model to use for observation
    </ParamField>

    <ParamField path="dom_settle_timeout_ms" type="int" optional>
      Maximum time to wait for the DOM to settle. Default: 30000 (30 seconds)
    </ParamField>

    <ParamField path="use_vision" type="bool" optional>
      Use visual analysis for observation. Default: False
    </ParamField>

    <ParamField path="request_id" type="str" optional>
      Custom request ID for tracking
    </ParamField>

    <ParamField path="include_hidden" type="bool" optional>
      Include hidden elements in observations. Default: False
    </ParamField>

    <ParamField path="max_elements" type="int" optional>
      Maximum number of elements to return. Default: 50
    </ParamField>
  </Tab>
</Tabs>

### **Returns:** 

<Tabs>
  <Tab title="TypeScript">
    `Promise<ObserveResult[]>` - An array of observation results, each containing:
    - `selector`: XPath selector for the element
    - `description`: Brief description of the element
    - `method` (optional): Suggested action method when `returnAction` is true
    - `arguments` (optional): Arguments for the suggested action
  </Tab>

  <Tab title="Python">
    `List[ObserveResult]` - A list of observation results, each containing:
    - `selector`: XPath selector for the element
    - `description`: Brief description of the element
    - `method` (optional): Suggested action method when `return_action` is True
    - `arguments` (optional): Arguments for the suggested action
  </Tab>
</Tabs>

## Usage Examples

### Basic Observation

<CodeGroup>
  ```typescript TypeScript
  // Get all actionable elements on the page
  const observations = await page.observe();
  
  observations.forEach(obs => {
    console.log(`${obs.description} at ${obs.selector}`);
  });
  ```

  ```python Python
  # Get all actionable elements on the page
  observations = await page.observe()
  
  for obs in observations:
      print(f"{obs.description} at {obs.selector}")
  ```
</CodeGroup>

### Targeted Observation

<CodeGroup>
  ```typescript TypeScript
  // Find specific types of elements
  const buttons = await page.observe({
    instruction: "Find all submit and action buttons"
  });
  
  const forms = await page.observe({
    instruction: "Find all form input fields"
  });
  ```

  ```python Python
  # Find specific types of elements
  buttons = await page.observe("Find all submit and action buttons")
  
  forms = await page.observe("Find all form input fields")
  ```
</CodeGroup>

### Observation with Suggested Actions

<CodeGroup>
  ```typescript TypeScript
  // Get elements with suggested actions
  const actionsToTake = await page.observe({
    instruction: "Find the login form elements",
    returnAction: true
  });
  
  // Use the suggested action
  if (actionsToTake.length > 0) {
    await page.act(actionsToTake[0]);
  }
  ```

  ```python Python
  # Get elements with suggested actions
  actions_to_take = await page.observe({
      "instruction": "Find the login form elements",
      "return_action": True
  })
  
  # Use the suggested action
  if actions_to_take:
      await page.act(actions_to_take[0])
  ```
</CodeGroup>

## Best Practices

1. **Use specific instructions**: More specific instructions yield more relevant results
2. **Combine with act()**: Use observe results directly with act() for efficient automation
3. **Check before acting**: Use observe to verify elements exist before attempting actions
4. **Limit scope**: Use targeted instructions to reduce noise in results
5. **Handle empty results**: Always check if observations returned any results before using them