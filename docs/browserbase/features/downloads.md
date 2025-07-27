# Downloads

Unlike screenshots and PDFs which are saved locally, files downloaded during browser automation are stored in Browserbase's cloud storage. These files must be retrieved using our API.

A typical use case for headless browsers is downloading files from web pages. Our browsers are configured to sync any file you download to our storage infrastructure. We add a Unix timestamp onto the end of the file name to avoid naming conflicts when downloading multiple files (e.g., `sample.pdf` will become `sample-1719265797164.pdf`).

## Triggering Downloads

First, trigger a download in your browser automation:

1. [Create a browser session](/fundamentals/create-browser-session) and get the session ID
2. [Connect to the session](/fundamentals/using-browser-session) using your preferred framework
3. Configure your library's downloads location
4. Perform the download action in your automation script

### Node.js (Playwright)

```javascript
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

  // Required to avoid playwright overriding location
  const client = await defaultContext.newCDPSession(page);
  await client.send("Browser.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: "downloads",
    eventsEnabled: true,
  });

  await page.goto("https://browser-tests-alpha.vercel.app/api/download-test");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#download").click(),
  ]);

  let downloadError = await download.failure();
  if (downloadError !== null) {
    console.log("Error happened on download:", downloadError);
  }

  await page.close();
  await browser.close();
})();
```

## Retrieving Downloaded Files

After triggering a download, you can retrieve the files using the Browserbase SDK:

### List Downloads

```typescript
import { Browserbase } from "@browserbasehq/sdk";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });

// List all downloads for a session
const downloads = await bb.sessions.downloads.list(sessionId);
console.log("Downloaded files:", downloads);
```

### Download a File

```typescript
// Download a specific file
const fileBuffer = await bb.sessions.downloads.get(sessionId, fileName);

// Save to local filesystem
import { writeFileSync } from "fs";
writeFileSync("downloaded-file.pdf", fileBuffer);
```

## Important Notes

- Downloaded files are automatically timestamped to prevent naming conflicts
- Files are stored in Browserbase's cloud storage, not locally
- You must use the Browserbase API to retrieve downloaded files
- Configure your browser automation framework to allow downloads to the specified path