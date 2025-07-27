# Contexts

Reuse cookies, authentication, and cached data across browser sessions.

## Overview

Contexts allow you to **persist user data across multiple browser sessions**, enabling smoother automation, authentication, and performance optimizations. By default, each Browserbase session starts with a fresh user data directory, meaning cookies, cache, and session storage are wiped between sessions.

## Why use Contexts?

- **Reusing Cookies & Session Data**: Maintain login states across multiple sessions without needing to log in repeatedly.
- **Preserving Authentication**: Store and reuse authentication tokens, reducing the need to re-enter credentials.
- **Speeding Up Page Loads**: Cache assets, API responses, and other browser data to decrease load times.

**Note**: Context data can include stored credentials and other sensitive browsing data. Contexts are uniquely encrypted at rest to ensure security.

## Creating a Context

To create a context, use the Create Context API. This will return a unique context ID, which you can pass into new sessions to persist data.

```typescript
import { Browserbase } from "@browserbasehq/sdk";

async function createContext() {
  const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
  const context = await bb.contexts.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
  });
  return context;
}

createContext()
  .then((context) => console.log("Context ID:", context.id))
  .catch((error) => console.error("Error:", error));
```

## Initializing a Session with Context

After creating a context, you can use it in a new session to reuse cookies, authentication, and cached data.

```typescript
import { Browserbase } from "@browserbasehq/sdk";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });

async function useContext(contextId: string) {
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    browserSettings: {
      context: {
        id: contextId,
        persist: true,
      },
    },
  });
  
  return session;
}
```

## Context Persistence

When using contexts with `persist: true`, any changes made during the session (cookies, localStorage, authentication tokens) are saved back to the context. This means subsequent sessions using the same context will have access to this updated data.

## Best Practices

- Use contexts for maintaining authentication across multiple sessions
- Set `persist: true` when you want to save session changes back to the context
- Consider security implications when storing sensitive data in contexts
- Contexts are encrypted at rest for security