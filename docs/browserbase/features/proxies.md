# Proxies

## Overview

Browserbase offers a flexible proxy system, enabling you to control how your automation traffic is routed across the internet. Whether you need anonymity, geolocation control, or improved reliability, Browserbase makes it easy to integrate proxies into your workflows.

## Proxy Configuration Options

With Browserbase, you can:

- Use built-in proxies
- Bring your own proxies
- Combine multiple proxies

Proxies are configured when creating a session through the API or SDK.

### Use Built-in Proxies

Use Browserbase's built-in proxies to route traffic through managed, residential proxies. Setting `proxies: true` will make a best-effort attempt to use a US-based proxy.

```typescript
import { Browserbase } from "@browserbasehq/sdk";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });

async function createSessionWithProxies() {
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    proxies: true,
  });
  return session;
}
```

### Set Proxy Geolocation

Set the geolocation of the proxy to a specific country, state, and city.

```typescript
async function createSessionWithGeoLocation() {
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    proxies: [
      {
        "type": "browserbase",
        "geolocation": {
          "city": "NEW_YORK",
          "state": "NY",
          "country": "US"
        }
      }
    ],
  });
  return session;
}
```

### Custom Proxies

Browserbase supports custom proxy configurations for HTTP or HTTPS proxies.

```typescript
async function createSessionWithCustomProxies() {
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    proxies: [
      {
        "type": "external",
        "server": "http://proxy-server:port",
        "username": "proxy-username",
        "password": "proxy-password"
      }
    ],
  });
  return session;
}
```

## Proxy Types

### Browserbase Proxies
- Managed residential proxies
- Built-in geolocation support
- High reliability and performance

### External Proxies
- Bring your own proxy infrastructure
- Support for HTTP/HTTPS proxies
- Authentication support (username/password)

## Best Practices

- Use Browserbase proxies for most use cases unless you have specific proxy requirements
- Consider geolocation settings for location-specific testing
- Monitor proxy performance and switch providers if needed
- Combine with stealth mode for enhanced anonymity