# Concurrency & Rate Limits

Session limits and rate controls for concurrent browsers

## Key Limits

Browser automation becomes powerful when you can run multiple browser sessions simultaneously. Whether you're scraping data at scale, running parallel tests, or serving multiple users, understanding concurrency and rate limits is critical.

To ensure system stability and fair resource allocation, two key limits apply:

- **Max Concurrent Browsers**: The maximum number of browser sessions that you can run at the same time
- **Session Creation Limit**: The maximum number of new browser sessions you can create within any 60-second period

If either limit is reached, your request will receive a 429 (too many requests) error.

**One Minute Minimum:** each browser session requires dedicated resources and has a minimum runtime of one minute, even if closed before.

## Limits by Plan

These limits depends on your plan:

| Plan      | Free | Developer | Startup | Scale   |
|-----------|------|-----------|---------|---------|
| Max Concurrent Browsers | 1 | 25 | 100 | 250+   |
| Session Creation Limit per minute | 5 | 25 | 50 | 150+  |

## Limits and Concurrency per Project

Concurrency is assigned to the Organization level - so if you're on the Developer plan, you have 25 total concurrent browsers allotted to your Organization, to be distributed to your projects as you see fit.

With one project, all concurrent browsers simply go to that one project. When you create a second project, 1 concurrent browser is automatically added to your second project (since you need at least one browser per project).

If you have two projects, here's how the concurrency will assign by default:
- **Developer plan**: Project 1 (24 browsers) + Project 2 (1 browser)
- **Startup plan**: Project 1 (99 browsers) + Project 2 (1 browser)
- **Scale plan**: Fully custom

## Reaching Limits: 429s

When reaching the session concurrency limit of your plan, any subsequent request to create a new session will return an HTTP `429 Too Many Requests` error.

### Handling 429 Errors

When you encounter rate limits, implement proper error handling:

```typescript
import { Browserbase } from "@browserbasehq/sdk";

async function createSessionWithRetry(maxRetries = 3) {
  const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const session = await bb.sessions.create({
        projectId: process.env.BROWSERBASE_PROJECT_ID!
      });
      return session;
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

## Best Practices for Managing Concurrency

1. **Monitor Your Usage**: Track active sessions to avoid hitting limits
2. **Implement Queuing**: Queue requests when at capacity rather than failing
3. **Use Session Pools**: Reuse sessions when possible to reduce creation overhead
4. **Graceful Degradation**: Handle 429 errors with retries and backoff
5. **Plan Scaling**: Upgrade your plan before hitting limits in production

## Session Management Strategies

### Session Pooling

```typescript
class SessionPool {
  private activeSessions: Set<string> = new Set();
  private maxConcurrency: number;

  constructor(maxConcurrency: number) {
    this.maxConcurrency = maxConcurrency;
  }

  async acquireSession(): Promise<Session | null> {
    if (this.activeSessions.size >= this.maxConcurrency) {
      return null; // Pool exhausted
    }

    const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
    const session = await bb.sessions.create({
      projectId: process.env.BROWSERBASE_PROJECT_ID!
    });

    this.activeSessions.add(session.id);
    return session;
  }

  releaseSession(sessionId: string) {
    this.activeSessions.delete(sessionId);
  }
}
```

### Request Queuing

```typescript
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;

  async addRequest<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      await request();
    }
    
    this.processing = false;
  }
}
```

## Monitoring and Optimization

- **Track Session Duration**: Monitor how long sessions run to optimize usage
- **Implement Health Checks**: Regularly verify session availability
- **Use Analytics**: Monitor 429 error rates and adjust accordingly
- **Load Testing**: Test your concurrency limits before production deployment