# Handling Authentication

Managing 2FA and other authentication flows.

## Strategies for Handling Authentication

Handling authentication in automation requires **maintaining session state, avoiding bot detection, and resolving challenges like CAPTCHAs or multi-factor authentication (MFA)**.

### Create an Session with Contexts, Proxies, and Fingerprinting

Ensure seamless authentication by:
- Applying Contexts to store cookies, session tokens, and local storage
- Enabling Stealth Mode to adjust browser settings
- Using Proxies to rotate residential IPs

Example Node.js code:

```typescript
import { Browserbase } from "@browserbasehq/sdk";

async function createAuthSession(contextId: string) {
  const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });

  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    browserSettings: {
      context: {
        id: contextId,
        persist: true
      }
    },
    proxies: [{
      type: "browserbase",
      geolocation: {
        city: "New York",
        state: "NY",
        country: "US"
      }
    }]
  });

  return session;
}
```

### 2FA Challenges

Two strategies for handling two-factor verification:
1. Disable 2FA or create an app password
2. Enable Remote Control of your Session

### Handling Passkeys

To prevent passkey prompts from blocking automation, disable them using Chrome DevTools Protocol (CDP):

```typescript
import { chromium } from "playwright-core";
import { Browserbase } from "@browserbasehq/sdk";

async function createSessionWithoutPasskeys() {
  const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!
  });

  const browser = await chromium.connectOverCDP(session.connectUrl);
  const client = await browser.newContext();
  
  // Disable passkeys
  await client.addInitScript(`
    navigator.credentials = {
      create: () => Promise.reject(new Error('Passkeys disabled')),
      get: () => Promise.reject(new Error('Passkeys disabled'))
    };
  `);

  return { session, browser };
}
```

## Authentication Best Practices

1. **Use Contexts for Persistent Authentication**: Store login state across sessions to avoid repeated authentication
2. **Enable Stealth Mode**: Prevent bot detection during authentication flows
3. **Handle 2FA Gracefully**: Use Session Live View or disable 2FA when possible
4. **Manage Passkeys**: Disable passkey prompts that could block automation
5. **Use Residential Proxies**: Avoid IP-based blocking during authentication

## Troubleshooting Authentication Issues

- **Session Expired**: Check if cookies are being properly persisted in contexts
- **Bot Detection**: Enable stealth mode and use residential proxies
- **2FA Blocking**: Use Session Live View for manual intervention or disable 2FA
- **Passkey Prompts**: Implement passkey disabling using CDP commands