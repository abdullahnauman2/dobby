# Interact with a website

> You can use Stagehand to intelligently interact with a website using AI

## Executing actions

Stagehand has an `act()` function that can be used to execute actions on a page using natural language. Here's an example of Stagehand to find jobs on LinkedIn:

![Take actions with Stagehand](https://mintlify.s3.us-west-1.amazonaws.com/stagehand/media/linkedin.gif)

This workflow is as simple as the following lines of code:

<CodeGroup>
  ```typescript TypeScript
  const page = stagehand.page
  // Navigate to the URL
  await page.goto("https://linkedin.com");
  // Click on jobs menu selection
  await page.act("click 'jobs'");
  // Click on first posting
  await page.act("click the first job posting");
  ```

  ```python Python
  page = stagehand.page
  # Navigate to the URL
  await page.goto("https://linkedin.com")
  # Click on jobs menu selection
  await page.act("click 'jobs'")
  # Click on first posting
  await page.act("click the first job posting")
  ```
</CodeGroup>

The `page` object extends the Playwright page object, so you can use any of the [Playwright page methods](https://playwright.dev/docs/api/class-page) with it.

## Get structured data from the page

You can use `extract()` to get structured data from the page.
Here's an example of how to extract the job title from the job posting:

<CodeGroup>
  ```typescript TypeScript
  const { jobTitle } = await page.extract({
  	instruction: "Extract the job title from the job posting",
  	schema: z.object({
  		jobTitle: z.string(),
  	}),
  });
  ```

  ```python Python
  result = await page.extract("Extract the job title from the job posting")
  ```
</CodeGroup>

<Info>
  Stagehand uses [Zod](https://zod.dev/) for schema validation in TypeScript.
</Info>