# Stealth Mode

## Overview

"Morally 'good' automations play a vital role in modern web development with automated browsers performing legitimate tasks like testing, scraping, and content aggregation."

Stealth Mode enables automated browser sessions to mimic real user behavior across different sessions and IPs.

- **Basic Stealth Mode** handles surface-level challenges like visual CAPTCHAs and generates random, realistic fingerprints and viewports for each session.
- **Advanced Stealth Mode** mimics human-like environmental signals using a custom-built Chromium browser to avoid bot detection.

## Basic Stealth Mode

Basic Stealth Mode focuses on solving visual CAPTCHAs and browser fingerprint clues commonly used to detect bots.

Browserbase automatically generates random browser fingerprints and viewports for each session, eliminating the need for manual configuration.

> Browser fingerprint customization is no longer available for direct configuration to ensure better results and fewer detection issues.

## Advanced Stealth Mode

Advanced Stealth Mode is only available for Scale Plan customers.

While Basic Stealth Mode automatically detects and solves most CAPTCHAs, Advanced Stealth Mode reduces bot detection chances by using a custom Chrome browser.

### Node.js Example

```typescript
import Browserbase from "@browserbasehq/sdk";

const bb = new Browserbase({apiKey: process.env.BROWSERBASE_API_KEY!});

async function createAdvStealthSession() {
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    browserSettings: {
      advancedStealth: true,
    },
    proxies: true,
  });
  return session;
}
```

## CAPTCHA Solving

Many websites use CAPTCHAs to distinguish between automated and human interactions.

**How CAPTCHA Solving Works**:
- Browserbase attempts to solve CAPTCHAs in the background
- Solving can take up to 30 seconds
- Recommended to enable proxies for higher success rates
- Custom CAPTCHA selectors can guide the solution process

### CAPTCHA Solving Events

Browserbase emits console logs when solving CAPTCHAs:

```typescript
// Listen for CAPTCHA solving events
page.on('console', (msg) => {
  if (msg.text().includes('CAPTCHA')) {
    console.log('CAPTCHA solving:', msg.text());
  }
});
```

### Custom CAPTCHA Selectors

You can provide custom selectors to help identify CAPTCHA elements:

```typescript
const session = await bb.sessions.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID!,
  browserSettings: {
    captchaSelector: "#captcha-container",
  },
});
```

## Anti-Detection Features

### Automatic Fingerprint Randomization
- User agents are randomized for each session
- Screen resolutions vary naturally
- Browser plugins and extensions are randomized
- Timezone and language settings are varied

### Behavioral Mimicry
- Mouse movements appear natural
- Typing patterns include realistic delays
- Page interactions follow human-like patterns
- Network requests are timed naturally

## Best Practices

1. **Combine with Proxies**: Use proxies alongside stealth mode for better anonymity
2. **Respect Rate Limits**: Don't overwhelm servers with rapid requests
3. **Monitor Success Rates**: Track CAPTCHA solving success rates
4. **Use Appropriate Delays**: Add realistic delays between actions
5. **Test Thoroughly**: Verify stealth effectiveness on target websites

## Limitations

- Some advanced bot detection systems may still identify automation
- CAPTCHA solving is not 100% reliable
- Advanced Stealth Mode requires Scale Plan subscription
- Performance may be slightly reduced due to additional anti-detection measures