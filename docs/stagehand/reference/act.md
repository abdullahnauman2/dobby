# Act

> Perform actions on the current page

<CodeGroup>
  ```typescript TypeScript
  await page.act("click on add to cart");
  ```

  ```python Python
  await page.act("click on add to cart")
  ```
</CodeGroup>

`act()` allows Stagehand to interact with a web page. Provide an `action` like `"Click on the add to cart button"`, or `"Type 'Browserbase' into the search bar"`.

You can define variables that will not be shared with LLM providers

<CodeGroup>
  ```typescript TypeScript
  await page.act({
    action: "fill in the form with %username% and %password%",
    variables: {
      username: "john.doe",
      password: "secretpass123",
    },
  });
  ```

  ```python Python
  await page.act({
    "fill in the form with %username% and %password%",
    variables={
      "username": "john.doe",
      "password": "secretpass123",
    },
  })
  ```
</CodeGroup>

Small atomic goals perform the best. Avoid using `act()` to perform complex actions. For multi-step actions, use [`Agent`](/reference/agent) instead

<Tip>
  You can pass an `ObserveResult` to `act()` to perform the suggested action, which will yield a faster and cheaper result (no LLM inference).
</Tip>

### **Arguments:** [`ActOptions`](https://github.com/browserbase/stagehand/blob/main/types/stagehand.ts)  |  [`ObserveResult`](https://github.com/browserbase/stagehand/blob/main/types/stagehand.ts)

<Tabs>
  <Tab title="TypeScript">
    `ActOptions`:

    <ParamField path="action" type="string" required>
      Describes the action to perform
    </ParamField>

    <ParamField path="modelName" type="AvailableModel" optional>
      Specifies the model to use for this action
    </ParamField>

    <ParamField path="variables" type="Record<string, string>" optional>
      Variables to use in the action. Variables will be replaced but not sent to the LLM.
    </ParamField>

    <ParamField path="domSettleTimeoutMs" type="number" optional>
      Maximum time to wait for the DOM to settle before taking action. Default: 30000 (30 seconds)
    </ParamField>

    <ParamField path="useVision" type="boolean" optional>
      Uses visual analysis for actions. May improve performance on visually complex pages. Default: false
    </ParamField>

    <ParamField path="retries" type="number" optional>
      Number of retry attempts on failure. Default: 0
    </ParamField>

    <ParamField path="delay" type="number" optional>
      Delay in milliseconds before taking action. Default: 0
    </ParamField>

    <ParamField path="captureScreenshot" type="boolean" optional>
      Captures a screenshot after the action. Default: false
    </ParamField>

    `ObserveResult`:

    <ParamField path="selector" type="string" required>
      XPath selector for the element
    </ParamField>

    <ParamField path="description" type="string" required>
      Description of the element
    </ParamField>

    <ParamField path="method" type="string" optional>
      Suggested action method (e.g., 'click', 'fill')
    </ParamField>

    <ParamField path="arguments" type="any[]" optional>
      Arguments for the suggested action
    </ParamField>
  </Tab>

  <Tab title="Python">
    When using a string:
    - The string describes the action to perform

    When using a dictionary:

    <ParamField path="action" type="str" required>
      Describes the action to perform
    </ParamField>

    <ParamField path="model_name" type="AvailableModel" optional>
      Specifies the model to use for this action
    </ParamField>

    <ParamField path="variables" type="Dict[str, str]" optional>
      Variables to use in the action. Variables will be replaced but not sent to the LLM.
    </ParamField>

    <ParamField path="dom_settle_timeout_ms" type="int" optional>
      Maximum time to wait for the DOM to settle before taking action. Default: 30000 (30 seconds)
    </ParamField>

    <ParamField path="use_vision" type="bool" optional>
      Uses visual analysis for actions. May improve performance on visually complex pages. Default: False
    </ParamField>

    <ParamField path="retries" type="int" optional>
      Number of retry attempts on failure. Default: 0
    </ParamField>

    <ParamField path="delay" type="int" optional>
      Delay in milliseconds before taking action. Default: 0
    </ParamField>

    <ParamField path="capture_screenshot" type="bool" optional>
      Captures a screenshot after the action. Default: False
    </ParamField>
  </Tab>
</Tabs>

### **Returns:** 

<Tabs>
  <Tab title="TypeScript">
    `Promise<void>` - The method returns after the action has been performed.
  </Tab>

  <Tab title="Python">
    `None` - The method returns after the action has been performed.
  </Tab>
</Tabs>