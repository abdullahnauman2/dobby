# Playwright Interoperability

> How Stagehand interacts with Playwright

Stagehand is built on top of [Playwright](https://playwright.dev/), so you can use Playwright methods directly through the Stagehand instance.

## `page` and `context`

`stagehand.page` and `stagehand.context` are instances of Playwright's `Page` and `BrowserContext` respectively. Use these methods to interact with the Playwright instance that Stagehand is using.

<CodeGroup>
  ```TypeScript TypeScript
  const page = stagehand.page;
  // Base Playwright methods work
  await page.goto("https://github.com/browserbase/stagehand");

  // Stagehand overrides Playwright objects
  await page.act("click on the contributors")
  ```

  ```python Python
  page = stagehand.page
  # Base Playwright methods work
  await page.goto("https://github.com/browserbase/stagehand")

  # Stagehand overrides Playwright objects
  await page.act("click on the contributors")
  ```
</CodeGroup>

## Stagehand v. Playwright

Below is an example of how to extract a list of companies from the AI Grant website using both Stagehand and Playwright.

<img src="https://mintlify.s3.us-west-1.amazonaws.com/stagehand/images/stagehand-playwright.png" alt="Stagehand v. Playwright" />

The above example with Stagehand can be easily reused to extract data from other websites, whereas the Playwright example would need to be rewritten for each new website.

## Using Playwright Methods

All standard Playwright methods are available:

<CodeGroup>
  ```typescript TypeScript
  const page = stagehand.page;
  
  // Navigation
  await page.goto("https://example.com");
  await page.goBack();
  await page.reload();
  
  // Waiting
  await page.waitForTimeout(1000);
  await page.waitForSelector(".my-element");
  await page.waitForLoadState("networkidle");
  
  // Screenshots
  await page.screenshot({ path: "screenshot.png" });
  
  // Evaluation
  const title = await page.evaluate(() => document.title);
  
  // Keyboard and Mouse
  await page.keyboard.press("Enter");
  await page.mouse.move(100, 100);
  
  // Context operations
  const context = stagehand.context;
  const cookies = await context.cookies();
  await context.addCookies([{ name: "test", value: "123", url: "https://example.com" }]);
  ```

  ```python Python
  page = stagehand.page
  
  # Navigation
  await page.goto("https://example.com")
  await page.go_back()
  await page.reload()
  
  # Waiting
  await page.wait_for_timeout(1000)
  await page.wait_for_selector(".my-element")
  await page.wait_for_load_state("networkidle")
  
  # Screenshots
  await page.screenshot(path="screenshot.png")
  
  # Evaluation
  title = await page.evaluate("() => document.title")
  
  # Keyboard and Mouse
  await page.keyboard.press("Enter")
  await page.mouse.move(100, 100)
  
  # Context operations
  context = stagehand.context
  cookies = await context.cookies()
  await context.add_cookies([{"name": "test", "value": "123", "url": "https://example.com"}])
  ```
</CodeGroup>

## Mixing Stagehand and Playwright

You can seamlessly mix Stagehand's AI-powered methods with Playwright's deterministic methods:

<CodeGroup>
  ```typescript TypeScript
  // Use Playwright for precise navigation
  await page.goto("https://amazon.com");
  
  // Use Stagehand for intelligent interaction
  await page.act("search for 'wireless headphones'");
  
  // Use Playwright to wait for results
  await page.waitForSelector(".s-result-item");
  
  // Use Stagehand to extract data
  const products = await page.extract({
    instruction: "extract the top 5 products with their prices",
    schema: z.object({
      products: z.array(z.object({
        name: z.string(),
        price: z.string(),
      }))
    })
  });
  
  // Use Playwright for precise clicking
  await page.click(".s-result-item:first-child");
  ```

  ```python Python
  # Use Playwright for precise navigation
  await page.goto("https://amazon.com")
  
  # Use Stagehand for intelligent interaction
  await page.act("search for 'wireless headphones'")
  
  # Use Playwright to wait for results
  await page.wait_for_selector(".s-result-item")
  
  # Use Stagehand to extract data
  from pydantic import BaseModel
  from typing import List
  
  class Product(BaseModel):
      name: str
      price: str
  
  class ProductList(BaseModel):
      products: List[Product]
  
  result = await page.extract(
      "extract the top 5 products with their prices",
      schema=ProductList
  )
  
  # Use Playwright for precise clicking
  await page.click(".s-result-item:first-child")
  ```
</CodeGroup>

## Best Practices

1. **Use Playwright for deterministic actions**: When you know exact selectors or need precise timing
2. **Use Stagehand for dynamic content**: When dealing with varying layouts or natural language tasks
3. **Combine both approaches**: Start with Playwright for navigation, use Stagehand for complex interactions
4. **Leverage Playwright's waiting**: Use Playwright's wait methods before Stagehand actions for stability
5. **Access browser context**: Use `stagehand.context` for cookie management and other context-level operations

## Common Patterns

### Login Flow

<CodeGroup>
  ```typescript TypeScript
  // Navigate with Playwright
  await page.goto("https://example.com/login");
  
  // Fill form with Stagehand
  await page.act("fill in the email field with user@example.com");
  await page.act("fill in the password field with mypassword");
  
  // Submit with Playwright for reliability
  await page.click("button[type='submit']");
  
  // Wait for navigation with Playwright
  await page.waitForURL("**/dashboard");
  ```

  ```python Python
  # Navigate with Playwright
  await page.goto("https://example.com/login")
  
  # Fill form with Stagehand
  await page.act("fill in the email field with user@example.com")
  await page.act("fill in the password field with mypassword")
  
  # Submit with Playwright for reliability
  await page.click("button[type='submit']")
  
  # Wait for navigation with Playwright
  await page.wait_for_url("**/dashboard")
  ```
</CodeGroup>

### Data Scraping

<CodeGroup>
  ```typescript TypeScript
  // Navigate to listing page
  await page.goto("https://example.com/products");
  
  // Use Playwright to handle pagination
  let allProducts = [];
  
  while (true) {
    // Extract with Stagehand
    const pageProducts = await page.extract({
      instruction: "extract all products on this page",
      schema: z.object({
        products: z.array(z.object({
          name: z.string(),
          price: z.number(),
        }))
      })
    });
    
    allProducts = [...allProducts, ...pageProducts.products];
    
    // Check for next page with Playwright
    const nextButton = await page.$("a.next-page");
    if (!nextButton) break;
    
    await nextButton.click();
    await page.waitForLoadState("networkidle");
  }
  ```

  ```python Python
  # Navigate to listing page
  await page.goto("https://example.com/products")
  
  # Use Playwright to handle pagination
  all_products = []
  
  while True:
      # Extract with Stagehand
      from pydantic import BaseModel
      from typing import List
      
      class Product(BaseModel):
          name: str
          price: float
      
      class ProductPage(BaseModel):
          products: List[Product]
      
      page_data = await page.extract(
          "extract all products on this page",
          schema=ProductPage
      )
      
      all_products.extend(page_data.products)
      
      # Check for next page with Playwright
      next_button = await page.query_selector("a.next-page")
      if not next_button:
          break
      
      await next_button.click()
      await page.wait_for_load_state("networkidle")
  ```
</CodeGroup>