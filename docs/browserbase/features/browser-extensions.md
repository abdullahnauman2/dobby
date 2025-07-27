# Browser Extensions

For applications requiring enhanced functional capabilities, providing your own Chrome extension is a great option. With Browserbase, using extensions is easy.

## Sample Extension

Here's a simple example extension that modifies page titles. It consists of two files:

### manifest.json

```json
{
    "manifest_version": 3,
    "version": "1.0",
    "name": "My Test Extension",
    "description": "Test of a simple browser extension",
    "content_scripts": [
        {
            "matches": [
                "https://www.sfmoma.org/*"
            ],
            "js": [
                "content-script.js"
            ]
        }
    ]
}
```

You can download this sample extension [here](http://browser-tests-alpha.vercel.app/demo-extension.zip). The extension must be in a `.zip` file format with a `manifest.json` at the root. The file must be smaller than 4.5 MB.

## Upload Your Extension

Once you have your extension files zipped up, you can upload it using our SDK:

### Python

```python
from browserbase import Browserbase

bb = Browserbase(api_key="your-api-key")

# Upload the extension
with open("extension.zip", "rb") as f:
    extension = bb.extensions.create(f)

extension_id = extension.id
print(f"Extension uploaded with ID: {extension_id}")
```

## Create a Session with Your Extension

To use your extension, create a new session with the extension enabled:

### Python

```python
from browserbase import Browserbase

bb = Browserbase(api_key="your-api-key")

# Create a session with the extension
session = bb.sessions.create(
    project_id="your-project-id",
    extension_id="your-extension-id"
)

print(f"Session created with ID: {session.id}")
```

Starting a new session with an extension can increase the session creation time. The browser must be restarted to load the extension, which itself has nonzero load time.

## Verify the Extension

To verify your extension is working:

1. Connect to your session using your preferred browser automation framework
2. Navigate to the target website where your extension should be active
3. Check if the expected behavior is working (e.g., modified page titles in our example)