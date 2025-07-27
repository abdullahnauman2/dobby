# Screenshots and PDFs

## Screenshots

Browserbase enables screen view and full-screen screenshots using your desired browser automation framework. For optimal performance, we recommend using CDP (Chrome DevTools Protocol) sessions to capture screenshots, as this method is significantly faster than standard approaches.

### Important: Screenshot Buffer Handling

When using Browserbase, screenshots are returned as buffers rather than automatically saved to disk. This differs from local browser automation where the `path` parameter in `page.screenshot()` automatically saves the file. With Browserbase, you must manually save the buffer to disk.

### Save a screenshot locally with Playwright/Puppeteer

When using standard browser automation methods (not CDP), the screenshot is returned as a buffer that needs to be manually saved:

```typescript
import { writeFileSync } from "fs";
import { chromium } from "playwright-core";
import { Browserbase } from "@browserbasehq/sdk";

(async () => {
  const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
  });

  const browser = await chromium.connectOverCDP(session.connectUrl);
  const defaultContext = browser.contexts()[0];
  const page = defaultContext.pages()[0];

  await page.goto("https://example.com");

  // IMPORTANT: With Browserbase, the path parameter is ignored
  // The screenshot is returned as a buffer
  const screenshotBuffer = await page.screenshot({ 
    path: "screenshot.png", // This path is ignored in Browserbase
    fullPage: false 
  });

  // You must manually save the buffer to disk
  writeFileSync("screenshot.png", screenshotBuffer);

  await page.close();
  await browser.close();
})();
```

### Save a screenshot using CDP (Recommended)

First, [create a browser session](/fundamentals/create-browser-session) and [connect to it](/fundamentals/using-browser-session) using your preferred framework. Then you can take a screenshot using CDP sessions for the best performance:

```typescript
import { writeFileSync } from "fs";
import { chromium } from "playwright-core";
import { Browserbase } from "@browserbasehq/sdk";

(async () => {
  console.log("Starting remote browser...");
  const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
  });

  const browser = await chromium.connectOverCDP(session.connectUrl);
  const defaultContext = browser.contexts()[0];
  const page = defaultContext.pages()[0];

  await page.goto("https://news.ycombinator.com");

  console.log("Taking a screenshot using CDP...");

  // Create a CDP session for faster screenshots
  const client = await defaultContext.newCDPSession(page);

  // Capture the screenshot using CDP
  const { data } = await client.send("Page.captureScreenshot", {
    format: "jpeg",
    quality: 80,
    fullpage: true,
  });

  // Convert base64 to buffer and save
  const buffer = Buffer.from(data, "base64");
  writeFileSync("screenshot.jpeg", buffer);

  console.log("Shutting down...");
  await page.close();
  await browser.close();
})().catch((error) => {
  console.error(error);
});
```

### Why use CDP for screenshots?

Using CDP (Chrome DevTools Protocol) for taking screenshots offers several advantages:

1. **Performance**: CDP screenshots are significantly faster than traditional methods
2. **Quality Control**: Better control over image format and quality settings
3. **Full Page Support**: Easy full-page screenshot capture
4. **Resource Efficiency**: Lower overhead compared to standard browser automation methods

## PDFs

You can also generate PDFs of web pages using similar approaches. The CDP method provides the best performance for PDF generation as well.

### Generate PDF using CDP

```typescript
import { writeFileSync } from "fs";
import { chromium } from "playwright-core";
import { Browserbase } from "@browserbasehq/sdk";

(async () => {
  const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
  });

  const browser = await chromium.connectOverCDP(session.connectUrl);
  const defaultContext = browser.contexts()[0];
  const page = defaultContext.pages()[0];

  await page.goto("https://example.com");

  // Create a CDP session for PDF generation
  const client = await defaultContext.newCDPSession(page);

  // Generate PDF using CDP
  const { data } = await client.send("Page.printToPDF", {
    format: "A4",
    printBackground: true,
  });

  // Convert base64 to buffer and save
  const buffer = Buffer.from(data, "base64");
  writeFileSync("page.pdf", buffer);

  await page.close();
  await browser.close();
})();
```

## Best Practices

- **Always handle buffers**: When using Browserbase, remember that screenshots return buffers, not files. Always save the buffer manually using `fs.writeFileSync()` or similar methods
- **Path parameter behavior**: The `path` parameter in `page.screenshot()` is ignored when using Browserbase - it only works with local browser instances
- Use CDP for better performance when taking screenshots or generating PDFs
- Consider image quality vs file size trade-offs when setting JPEG quality
- For full-page screenshots, ensure the page is fully loaded before capturing
- Set appropriate viewport sizes for consistent screenshot dimensions
- When using Stagehand with Browserbase, apply the same buffer handling approach