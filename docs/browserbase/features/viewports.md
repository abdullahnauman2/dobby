# Viewports

## Overview

A viewport defines the visible area of a web page in a browser window. While setting a custom viewport is optional in Browserbase, it can be helpful for specific use cases — such as visual testing, screenshot generation, or automations that rely on precise layout behavior.

By default, Browserbase generates realistic, randomized viewports to enhance stealth and reduce detection. However, if your automation requires a consistent viewport size (e.g., for comparing screenshots across sessions), you can select from a predefined set of supported dimensions.

## Supported Viewport Sizes

When creating a session, you can choose from the following **approved viewport dimensions**. These values are optimized for reliability and stealth, and are the only sizes currently supported.

### Desktop Viewports

| Width | Height | Device |
|-------|--------|--------|
| 1920 | 1080 | Standard Full HD (Desktop) |
| 1366 | 768 | Widescreen Laptop |
| 1536 | 864 | High-Resolution Laptop |
| 1280 | 720 | Small Desktop Monitor |
| 1024 | 768 | Minimum Supported Desktop Viewport |

### Mobile Viewports

| Width | Height | Device |
|-------|--------|--------|
| 414 | 896 | iPhone XR, iPhone 11 |
| 390 | 844 | iPhone 12, iPhone 13, iPhone 14 |
| 375 | 812 | iPhone X, iPhone XS |
| 360 | 800 | Standard Android Phone |
| 320 | 568 | iPhone SE, Small Devices |

**Only the viewports listed above are supported.** Custom dimensions outside these values are **not allowed** to ensure consistent performance, rendering accuracy, and anti-bot stealth effectiveness.

## How to Set a Viewport in Your Session

Use the `viewport` and `fingerprint.screen` fields when creating a session to specify the desired width and height. Below are examples in both Node.js and Python SDKs.

### Node.js Example

```javascript
import Browserbase from "@browserbasehq/sdk";

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });

async function createSessionWithViewport() {
  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    browserSettings: {
      fingerprint: {
        screen: {
          maxWidth: 1920,
          maxHeight: 1080,
          minWidth: 1024,
          minHeight: 768,
        }
      },
      viewport: {
        width: 1920,
        height: 1080,
      },
    },
  });
  
  return session;
}
```

### Python Example

```python
from browserbase import Browserbase

bb = Browserbase(api_key="your-api-key")

session = bb.sessions.create(
    project_id="your-project-id",
    browser_settings={
        "fingerprint": {
            "screen": {
                "maxWidth": 1920,
                "maxHeight": 1080,
                "minWidth": 1024,
                "minHeight": 768,
            }
        },
        "viewport": {
            "width": 1920,
            "height": 1080,
        },
    },
)
```

## Mobile Viewport Configuration

For mobile testing, combine viewport settings with device fingerprinting:

```javascript
const session = await bb.sessions.create({
  projectId: process.env.BROWSERBASE_PROJECT_ID!,
  browserSettings: {
    fingerprint: {
      devices: ["mobile"],
      operatingSystems: ["android"],
      locales: ["en-US"],
    },
    viewport: {
      width: 390,
      height: 844,
    },
  },
});
```

## Best Practices

- **Use Consistent Viewports**: For screenshot comparisons or visual testing
- **Match Device Type**: Use mobile viewports with mobile fingerprints
- **Consider Content Layout**: Choose viewports that work well with your target websites
- **Test Multiple Sizes**: Verify your automation works across different viewport dimensions
- **Default is Often Best**: Let Browserbase randomize viewports for better stealth unless you have specific requirements

## Common Use Cases

- **Visual Testing**: Consistent screenshots across test runs
- **Responsive Design Testing**: Test different screen sizes
- **Mobile vs Desktop**: Compare how sites render on different devices
- **Layout-Dependent Automation**: Ensure elements are visible and clickable

## Limitations

- Only predefined viewport sizes are supported
- Custom dimensions outside the approved list are not allowed
- Viewport changes require creating a new session