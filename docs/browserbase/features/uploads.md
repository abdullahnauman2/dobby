# Uploads

You can easily upload files to websites using Playwright, Puppeteer, or Selenium. The approach varies depending on your framework:

## Playwright

### Direct Upload

For Playwright, you can upload files directly from your local path. After [creating and connecting to a session](/fundamentals/using-browser-session), follow these steps:

1. Make sure your file is available where you're running your Playwright code
2. Use the `setInputFiles` method to upload the file
3. The file path should be relative to your current working directory

```typescript
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

  await page.goto("https://browser-tests-alpha.vercel.app/api/upload-test");

  const fileInput = page.locator("#fileUpload");
  // logo.png is available relative to the current working directory
  await fileInput.setInputFiles("logo.png");
})().catch((error) => console.error(error));
```

### Large Files Upload

For larger files, you can use the Session Uploads API:

```typescript
// Set your file name below
const fileName = "YOUR_FILE_NAME.EXAMPLE";

import { chromium } from "playwright-core";
import { Browserbase } from "@browserbasehq/sdk";
import * as fs from "fs";

const apiKey = process.env.BROWSERBASE_API_KEY!;
const projectId = process.env.BROWSERBASE_PROJECT_ID!;

async function uploadLargeFile() {
  // 1. Initialize Browserbase Client
  const bb = new Browserbase({ apiKey });

  // 2. Create Browser Session
  const session = await bb.sessions.create({ projectId });

  // 3. Upload file via the Uploads API
  const fileStream = fs.createReadStream(fileName);
  const result = await bb.sessions.uploads.create(session.id, {
    file: fileStream,
  });

  // 4. Connect to the session
  const browser = await chromium.connectOverCDP(session.connectUrl);
  const defaultContext = browser.contexts()[0];
  const page = defaultContext.pages()[0];

  // 5. Navigate to the upload page
  await page.goto("https://browser-tests-alpha.vercel.app/api/upload-test");

  // 6. Use CDP to set the file input
  const client = await defaultContext.newCDPSession(page);
  await client.send("DOM.setFileInputFiles", {
    files: [result.filePath],
    objectId: await page.locator("#fileUpload").getAttribute("id"),
  });

  await page.close();
  await browser.close();
}

uploadLargeFile().catch(console.error);
```

## Best Practices

- For small files (< 10MB), use direct upload with `setInputFiles`
- For larger files, use the Session Uploads API to avoid timeout issues
- Ensure files exist in the correct path relative to your working directory
- Handle errors gracefully when file uploads fail
- Close browser sessions after upload completion

## File Size Limitations

- Direct uploads work well for files under 10MB
- Use Session Uploads API for larger files
- Check with Browserbase documentation for maximum file size limits

## Security Considerations

- Never upload sensitive files unnecessarily
- Ensure proper access controls on uploaded files
- Clean up temporary files after uploads complete