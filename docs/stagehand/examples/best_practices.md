# Best Practices

> Prompting Stagehand places an emphasis on being atomic and specific. Here are some guidelines to help you use Stagehand effectively.

### Use Cursor rules for better AI suggestions

Most of the Stagehand team uses [Cursor](https://www.cursor.com/) to write code. Cursor has a feature called [rules](https://docs.cursor.com/context/rules-for-ai) that allows you to customize the AI's behavior. You can use these rules to make the AI more accurate when suggesting actions.

For Stagehand's Cursor rules, check out [this file](https://github.com/browserbase/stagehand-scaffold/blob/main/.cursorrules).

If you're using Windsurf, you can use the same rules by adding them to your `.windsurfrules` file.

### Avoid sending sensitive information to LLMs

You can use `variables` in an `act` call to avoid sending sensitive information to LLMs.

<CodeGroup>
  ```typescript TypeScript
  await page.act({
  	action: "Type %email% into the email field",
  	variables: {
  		email: "john.doe@example.com",
  	},
  });
  ```

  ```python Python
  await page.act({
  	"Type %email% into the email field",
  	variables={
  		"email": "john.doe@example.com",
  	}
  })
  ```
</CodeGroup>

### Preview actions before running them

You can use `observe()` to get an action to run without running it.
If you're satisfied with the action, you can run it with `act()` without any LLM inference.

<CodeGroup>
  ```typescript TypeScript
  const [topAction] = await page.observe("Click the quickstart link");

  /** The action will map 1:1 with a Playwright action:
  {
  	description: "The quickstart link",
  	method: "click",
  	selector: "/html/body/div[1]/div[1]/a",
  	arguments: [],
  }
  **/

  // NO LLM INFERENCE when calling act on the preview
  await page.act(topAction);
  ```

  ```python Python
  actions = await page.observe("Click the quickstart link")
  top_action = actions[0]

  # The action will map 1:1 with a Playwright action:
  # {
  #	"description": "The quickstart link",
  #	"method": "click",
  #	"selector": "/html/body/div[1]/div[1]/a",
  #	"arguments": [],
  # }

  # NO LLM INFERENCE when calling act on the preview
  await page.act(top_action)
  ```
</CodeGroup>