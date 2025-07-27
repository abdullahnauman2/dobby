# Stagehand in Next.js

> Next.js is a popular framework for developing web-based applications in production. It powers Stagehand apps like [Director](https://director.ai), [Brainrot](https://brainrot.run) and [Open Operator](https://operator.browserbase.com).

<Card title="Check out the Stagehand Next.js Quickstart" icon="github" href="https://github.com/browserbase/stagehand-nextjs-quickstart">
  Clone our [GitHub repo](https://github.com/browserbase/stagehand-nextjs-quickstart) to get started with Stagehand in Next.js.
</Card>

## Add Stagehand to an existing Next.js project

If you'd like to add Stagehand to an existing Next.js project, you can do so by installing the dependencies:

<Tabs>
  <Tab title="npm">
    ```bash
    npm install @browserbasehq/stagehand @browserbasehq/sdk playwright zod
    ```
  </Tab>

  <Tab title="pnpm">
    ```bash
    pnpm add @browserbasehq/stagehand @browserbasehq/sdk playwright zod
    ```
  </Tab>

  <Tab title="yarn">
    ```bash
    yarn add @browserbasehq/stagehand @browserbasehq/sdk playwright zod
    ```
  </Tab>
</Tabs>

### Write a server action

Next, let's define our `main` function as a server action in `app/stagehand/main.ts`. This file will have the following three functions:

1. **`main`: Run the main Stagehand script**
2. **`runStagehand`: Initialize and run the `main` function**
3. **`startBBSSession`: Start a Browserbase session**

```ts app/stagehand/main.ts
// 🤘 Welcome to Stagehand!
// This file is from the [Stagehand docs](https://docs.stagehand.dev/sections/examples/nextjs)

"use server";

import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

export async function main(stagehand: Stagehand) {
  const page = stagehand.page;

  await page.goto("https://docs.stagehand.dev");

  const { headerText } = await page.extract({
    instruction: "extract the header text",
    schema: z.object({
      headerText: z.string().describe("the header text on the page"),
    }),
  });

  console.log("Header text:", headerText);

  return headerText;
}

export async function runStagehand() {
  const stagehand = await startBBSSession();
  
  try {
    const result = await main(stagehand);
    return result;
  } finally {
    await stagehand.close();
  }
}

async function startBBSSession() {
  const stagehand = new Stagehand({
    env: "BROWSERBASE",
    apiKey: process.env.BROWSERBASE_API_KEY,
    projectId: process.env.BROWSERBASE_PROJECT_ID,
  });

  await stagehand.init();
  return stagehand;
}
```

### Create a page component

Now create a page component that calls the server action:

```tsx app/page.tsx
"use client";

import { useState } from "react";
import { runStagehand } from "./stagehand/main";

export default function Home() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleRunStagehand = async () => {
    setLoading(true);
    try {
      const headerText = await runStagehand();
      setResult(headerText);
    } catch (error) {
      console.error("Error:", error);
      setResult("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stagehand Next.js Example</h1>
      
      <button
        onClick={handleRunStagehand}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Running..." : "Run Stagehand"}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold">Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
```

### Environment Variables

Make sure to set your environment variables in `.env.local`:

```env
BROWSERBASE_API_KEY=your_api_key_here
BROWSERBASE_PROJECT_ID=your_project_id_here
```