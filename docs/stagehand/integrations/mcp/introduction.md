# Browserbase MCP Server

> AI-powered browser automation through Model Context Protocol integration with Stagehand

## Overview

The Browserbase MCP Server brings powerful browser automation capabilities to Claude through the Model Context Protocol (MCP). Built on top of [Stagehand](https://docs.stagehand.dev/), this integration provides AI-powered web automation using natural language commands.

<Info>
  This server enables Claude to control browsers, navigate websites, interact with web elements, and extract data—all through simple conversational commands.
</Info>

## Key Features

<CardGroup cols={2}>
  <Card title="Natural Language Automation" icon="wand-magic-sparkles">
    Control browsers using plain English commands like "click the login button" or "fill out the contact form"
  </Card>

  <Card title="Web Interaction" icon="browser">
    Navigate, click, and fill forms with ease
  </Card>

  <Card title="Data Extraction" icon="download">
    Extract structured data from any website automatically
  </Card>

  <Card title="Multi-Session Management" icon="window-restore">
    Run multiple browser sessions simultaneously for complex workflows
  </Card>

  <Card title="Screenshot Capture" icon="camera">
    Capture and analyze webpage screenshots programmatically
  </Card>

  <Card title="Cookie Management" icon="cookie-bite">
    Handle authentication and session persistence across interactions
  </Card>
</CardGroup>

## Core Benefits

<Tabs>
  <Tab title="Ease of Use">
    <CardGroup cols={2}>
      <Card title="Intuitive Commands" icon="wand-magic-sparkles">
        No need to learn complex selectors or automation syntax. Simply describe what you want to do in natural language.
      </Card>

      <Card title="Quick Setup" icon="rocket">
        Get started in minutes with our NPM package or our remote hosted URL.
      </Card>

      <Card title="Smart Automation" icon="brain">
        Stagehand's AI understands web page context and can adapt to different layouts and designs.
      </Card>
    </CardGroup>
  </Tab>

  <Tab title="Powerful Features">
    <CardGroup cols={2}>
      <Card title="Session Persistence" icon="save">
        Maintain browser sessions across multiple interactions with contexts.
      </Card>

      <Card title="Concurrent Sessions" icon="layer-group">
        Run multiple browser sessions simultaneously for parallel workflows.
      </Card>

      <Card title="Error Recovery" icon="shield-check">
        Built-in error handling and recovery mechanisms for reliable automation.
      </Card>
    </CardGroup>
  </Tab>

  <Tab title="Integration">
    <CardGroup cols={2}>
      <Card title="MCP Native" icon="plug">
        Built specifically for the Model Context Protocol, ensuring seamless Claude integration.
      </Card>

      <Card title="Remote Hosting" icon="cloud">
        Use our hosted SHTTP server for zero-configuration deployment.
      </Card>

      <Card title="Local Control" icon="computer">
        Run locally for complete control over your browser automation environment.
      </Card>
    </CardGroup>
  </Tab>
</Tabs>

## Getting Started

Choose your preferred setup method:

<CardGroup cols={2}>
  <Card title="Quick Setup" icon="bolt" href="./setup">
    Get up and running in minutes with our guided setup process
  </Card>

  <Card title="Configuration" icon="gear" href="./configuration">
    Learn about advanced configuration options and customization
  </Card>

  <Card title="Available Tools" icon="toolbox" href="./tools">
    Explore all the browser automation tools at your disposal
  </Card>

  <Card title="Examples" icon="code" href="https://github.com/browserbase/mcp-browserbase">
    Check out practical examples and use cases on GitHub
  </Card>
</CardGroup>

## Example Conversation

```
User: Can you go to Amazon and search for "wireless headphones"?

Claude: I'll help you search for wireless headphones on Amazon. Let me navigate there and perform the search.

[Uses browserbase_stagehand_navigate to go to amazon.com]
[Uses browserbase_stagehand_act to search for "wireless headphones"]

I've successfully navigated to Amazon and searched for "wireless headphones". The search results are now displayed showing various wireless headphone options from different brands.

User: Can you find the top-rated option under $100?

Claude: I'll help you find the top-rated wireless headphones under $100. Let me analyze the search results.

[Uses browserbase_stagehand_extract to get product information]

Based on the search results, I found several highly-rated options under $100. The top-rated one appears to be...
```

## Support

<CardGroup cols={2}>
  <Card title="GitHub Issues" icon="github" href="https://github.com/browserbase/mcp-browserbase/issues">
    Report bugs or request features
  </Card>

  <Card title="Documentation" icon="book" href="https://docs.stagehand.dev">
    Learn more about Stagehand's capabilities
  </Card>
</CardGroup>