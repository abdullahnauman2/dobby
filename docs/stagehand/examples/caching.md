# Caching Actions

> You can cache actions in Stagehand to avoid redundant LLM calls.

Caching actions in Stagehand is useful for actions that are expensive to run, or when the underlying DOM structure is not expected to change.

## Using `observe` to preview an action

`observe` lets you preview an action before taking it. If you are satisfied with the action preview, you can run it in `page.act` with no further LLM calls.

<CodeGroup>
  ```typescript TypeScript
  const [actionPreview] = await page.observe("Click the quickstart link");

  /** actionPreview is a JSON-ified version of a Playwright action:
  {
  	description: "The quickstart link",
  	method: "click",
  	selector: "/html/body/div[1]/div[1]/a",
  	arguments: [],
  }
  **/

  // NO LLM INFERENCE when calling act on the preview
  await page.act(actionPreview)
  ```

  ```python Python
  actions = await page.observe("Click the quickstart link")
  action_preview = actions[0]

  # action_preview is a dictionary version of a Playwright action:
  # {
  #	"description": "The quickstart link",
  #	"method": "click",
  #	"selector": "/html/body/div[1]/div[1]/a",
  #	"arguments": [],
  # }

  # NO LLM INFERENCE when calling act on the preview
  await page.act(action_preview)
  ```
</CodeGroup>

## Simple caching

Let's use a simple file-based cache for this example. We'll write a getter and a setter functions that can read and write to a JSON file:

<CodeGroup>
  ```typescript TypeScript
  // Get the cached value (undefined if it doesn't exist)
  async function getCache(key: string): Promise<ObserveResult | undefined> {
    try {
      const cache = await readFile("cache.json");
      const parsed = JSON.parse(cache);
      return parsed[key];
    } catch {
      return undefined;
    }
  }

  // Set the cached value
  async function setCache(key: string, value: ObserveResult): Promise<void> {
    let cache = {};
    try {
      const existingCache = await readFile("cache.json");
      cache = JSON.parse(existingCache);
    } catch {
      // If file doesn't exist or is invalid, start with empty cache
    }
    
    cache[key] = value;
    await writeFile("cache.json", JSON.stringify(cache, null, 2));
  }
  ```

  ```python Python
  import json
  import os
  from typing import Optional, Dict, Any

  # Get the cached value (None if it doesn't exist)
  async def get_cache(key: str) -> Optional[Dict[str, Any]]:
      try:
          with open("cache.json", "r") as f:
              cache = json.load(f)
              return cache.get(key)
      except:
          return None

  # Set the cached value
  async def set_cache(key: str, value: Dict[str, Any]) -> None:
      cache = {}
      try:
          with open("cache.json", "r") as f:
              cache = json.load(f)
      except:
          # If file doesn't exist or is invalid, start with empty cache
          pass
      
      cache[key] = value
      with open("cache.json", "w") as f:
          json.dump(cache, f, indent=2)
  ```
</CodeGroup>