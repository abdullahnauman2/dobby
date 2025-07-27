# Live View

An interactive window to display or control a browser session.

## Uses

While Browserbase helps with anti-bot mechanisms, scraping, and reliable file downloads, some scenarios remain challenging to fully automate. Live Views can be useful for:

- Debugging and observability - watch everything happening live
- Human in the loop - instantly take control or provide input
  - Handle iframes
  - Delegate credentials
- Embedding - use within an application (desktop and mobile)

## Getting Started

Node.js example:

```javascript
const liveViewLinks = await bb.sessions.debug(session.id);
const liveViewLink = liveViewLinks.debuggerFullscreenUrl;
console.log(`🔍 Live View Link: ${liveViewLink}`);
```

## Multitab

Each tab has a unique live view URL. Recommend listening to the Playwright new tab event to get new live view URLs.

```javascript
// Open a new tab and navigate to google
const newTab = await defaultContext.newPage();
newTab.goto("https://www.google.com");

// Get the live view links after the new tab is opened
const liveViewLinks = await bb.sessions.debug(session.id);
const allTabs = liveViewLinks.pages;
const secondTabLiveViewLink = allTabs[1].debuggerFullscreenUrl;
```

## Embed

Add the live view link to an iframe:

```html
<iframe
  src="{liveViewLink}"
  sandbox="allow-same-origin allow-scripts"
  allow="clipboard-read; clipboard-write"
  style="pointer-events: none;"
/>
```

## Mobile

Show a mobile live view by setting viewport and fingerprint parameters:

```javascript
browserSettings: {
  fingerprint: {
    devices: ["mobile"],
    locales: ["en-US"],
    operatingSystems: ["android"],
  },
  viewport: { 
    width: 360,
    height: 800,
  },
},
```

## Styling Options

### Browser with Borders

```javascript
const liveViewLinks = await bb.sessions.debug(session.id);
const liveViewLink = liveViewLinks.debuggerFullscreenUrl;
```

### Fullscreen Browser

```javascript
const liveViewLinks = await bb.sessions.debug(session.id);
const fullscreenLiveViewLink = liveViewLinks.debuggerFullscreenUrl;
```

## Interactive Control

Live View allows you to:
- Click elements directly in the browser
- Type in form fields
- Navigate between pages
- Debug automation issues in real-time
- Take manual control when automation gets stuck

## Security Considerations

- Live View links provide direct access to the browser session
- Ensure proper access controls when sharing live view links
- Links expire when the session ends
- Consider using iframe sandboxing for embedded live views