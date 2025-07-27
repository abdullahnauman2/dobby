# LLM Customization

> Stagehand supports a wide variety of LLMs. You can use any LLM that supports structured outputs with our existing clients, or by writing a custom LLM provider.

<Tip>
  Small models on **Ollama** are really difficult to get consistent structured outputs from. Though these models are "supported" via an OpenAI-compatible API, we do not recommend them yet for Stagehand.
</Tip>

## Supported LLMs

Stagehand supports most of the hosted LLM providers. The full list of supported models is below:

### Providers

<Expandable title="Supported Providers">
  * **OpenAI**
  * **Anthropic**
  * **Google**
  * **xAI**
  * **Azure**
  * **Groq**
  * **Cerebras**
  * **TogetherAI**
  * **Mistral**
  * **DeepSeek**
  * **Perplexity**
  * **Ollama**
</Expandable>

### Model Name Format

Stagehand takes the model name in the format of `provider/model`.

For example, to use Gemini 2.0 Flash, you would pass in `google/gemini-2.0-flash`.

### Using a Provider

You can pass in one of these LLMs to the `llm` property in the `Stagehand` constructor.

<CodeGroup>
  ```typescript TypeScript
  const stagehand = new Stagehand({
    modelName: "google/gemini-2.0-flash",
    modelClientOptions: {
      apiKey: process.env.GOOGLE_API_KEY,
    },
  });
  ```

  ```python Python
  stagehand = Stagehand(
    model="google/gemini-2.0-flash",
    model_client_options={"apiKey": os.getenv("GOOGLE_API_KEY")},
  )
  ```
</CodeGroup>

## Custom LLMs

If you need to use a custom LLM provider that's not supported out of the box, you can write a custom LLM provider by implementing the required interface.

### LLM Provider Interface

Your custom LLM provider should implement the following methods:

- `generateResponse()` - Generate a response from the LLM
- `generateStructuredResponse()` - Generate a structured response with schema validation
- `getTokenCount()` - Get token count for pricing/usage tracking

### Example Custom Provider

<CodeGroup>
  ```typescript TypeScript
  import { LLMProvider } from "@browserbasehq/stagehand";

  class CustomLLMProvider implements LLMProvider {
    async generateResponse(prompt: string): Promise<string> {
      // Your custom implementation
      return "response";
    }

    async generateStructuredResponse(prompt: string, schema: any): Promise<any> {
      // Your custom implementation with structured output
      return {};
    }

    getTokenCount(text: string): number {
      // Your token counting logic
      return text.length / 4; // Simple approximation
    }
  }

  const stagehand = new Stagehand({
    llmProvider: new CustomLLMProvider(),
  });
  ```

  ```python Python
  from stagehand import LLMProvider, Stagehand

  class CustomLLMProvider(LLMProvider):
      async def generate_response(self, prompt: str) -> str:
          # Your custom implementation
          return "response"

      async def generate_structured_response(self, prompt: str, schema: dict) -> dict:
          # Your custom implementation with structured output
          return {}

      def get_token_count(self, text: str) -> int:
          # Your token counting logic
          return len(text) // 4  # Simple approximation

  stagehand = Stagehand(
      llm_provider=CustomLLMProvider(),
  )
  ```
</CodeGroup>