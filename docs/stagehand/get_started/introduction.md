# What is Stagehand?

> Stagehand allows you to automate browsers with natural language and code.

You can use Stagehand to do anything a web browser can do! Browser automations written with Stagehand are designed to be repeatable, customizable, and maintainable.

![create-browser-app](https://mintlify.s3.us-west-1.amazonaws.com/stagehand/media/create-browser-app.gif)

That entire browser automation can be written in just a few lines of code with Stagehand:

<CodeGroup>
  ```typescript TypeScript
  const page = stagehand.page;
  await page.goto("https://docs.stagehand.dev");

  // Use act() to take an action on the page
  await page.act("Click the search box");

  // Use observe() to plan an action before doing it
  const [action] = await page.observe(
    "Type 'Tell me in one sentence why I should use Stagehand' into the search box"
  );
  await page.act(action);

  // Use extract() to extract structured data from the page
  const { text } = await page.extract({
    instruction: "extract the text of the AI suggestion from the search results",
    schema: z.object({
      text: z.string(),
    }),
  });
  ```

  ```python Python
  page = stagehand.page
  await page.goto("https://docs.stagehand.dev")

  # Use act() to take an action on the page
  await page.act("Click the search box")

  # Use observe() to plan an action before doing it
  actions = await page.observe(
      "Type 'Tell me in one sentence why I should use Stagehand' into the search box"
  )
  await page.act(actions[0])

  # Use extract() to extract structured data from the page
  result = await page.extract("extract the text of the AI suggestion from the search results")
  text = result["text"]
  ```
</CodeGroup>

## Key Features

### Natural Language Actions
Write browser automation using natural language instructions like "click the login button" or "fill in the email field".

### Structured Data Extraction
Extract structured data from web pages using schemas and natural language instructions.

### Cross-Platform Support
Works with TypeScript/JavaScript and Python, supporting both local and cloud-based browser automation.

### AI-Powered Intelligence
Uses advanced AI models to understand web pages and execute complex automation tasks reliably.

### Built for Production
Designed with reliability, maintainability, and scalability in mind for production use cases.

## Use Cases

- **Web Scraping**: Extract data from websites with complex interactions
- **Testing**: Automated testing of web applications
- **Data Entry**: Automate form filling and data submission
- **Monitoring**: Automated monitoring of web services
- **Content Generation**: Generate content by interacting with web tools