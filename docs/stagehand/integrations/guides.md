# TypeScript Playbook

> Ready-to-run templates via npx create-browser-app

<Note>
  These examples are most relevant for TypeScript. The Python section is coming soon.
</Note>

<Card title="Check out the Playbook" icon="github" href="https://github.com/browserbase/playbook">
  We've created a Github repository with plenty of ready-to-run guides for Stagehand, including persistent contexts and deploying to Vercel.
</Card>

## Next.js + Vercel

Check out the [Next.js + Vercel example](https://github.com/browserbase/stagehand-nextjs-quickstart) to see how to build a Next.js app and one-click deploy it to Vercel.

## Custom LLM Clients

```bash
# For Vercel AI SDK
npx create-browser-app --example custom-client-aisdk

# For Ollama
npx create-browser-app --example custom-client-ollama
```

This example shows how to use a custom LLM client in Stagehand. We have working examples for [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction) and [Ollama](https://ollama.ai/). This helps you use your own LLM client in Stagehand if you don't want to use 4o/Sonnet.

This helps you connect to LLMs like DeepSeek, Llama, Perplexity, Groq, and more!

## Persistent Contexts

```bash
npx create-browser-app --example persist-context
```

This example uses Browserbase's context persistence to create a persistent context that can be used across multiple runs.

This is really useful for automating on sites that require login, or for automating on sites that have a captcha. Once you've logged in, you can use the same context to automate on the same site without having to log in again.

## Deploying to Vercel

```bash
npx create-browser-app --example deploy-vercel
```

This example creates a scaffolded Vercel deployment that you can use to deploy your Stagehand app to Vercel with one click.

## Multi-Step Workflows

```bash
npx create-browser-app --example multi-step-workflow
```

This example demonstrates how to build complex, multi-step browser automation workflows that can handle:

- Sequential actions across multiple pages
- Error handling and retry logic
- Data collection and processing
- Conditional branching based on page content

## E-commerce Automation

```bash
npx create-browser-app --example ecommerce-automation
```

This example shows how to automate common e-commerce tasks like:

- Product search and filtering
- Adding items to cart
- Checkout flow automation
- Price monitoring

## Social Media Automation

```bash
npx create-browser-app --example social-media
```

Demonstrates automation for social media platforms:

- Content posting
- Engagement tracking
- Profile management
- Analytics collection

## Data Scraping Workflows

```bash
npx create-browser-app --example data-scraping
```

Advanced data extraction patterns:

- Handling dynamic content
- Pagination automation
- Structured data extraction
- Export to various formats

## Getting Started

1. Choose an example that matches your use case
2. Run the command to generate the template
3. Follow the README instructions in the generated project
4. Customize the code for your specific needs

Each template includes:
- Complete working code
- Environment setup instructions
- Best practices documentation
- Common patterns and utilities