# Telemetry and Evaluations

> How to view LLM usage and run evals on your Stagehand workflows.

<Card title="Check out the Stagehand Evals" icon="scale-balanced" href="https://www.stagehand.dev/evals">
  Check out the [Stagehand Evals](https://www.stagehand.dev/evals) to see different LLMs compare in Stagehand.
</Card>

## View LLM usage and token counts

You can view your token usage at any point with `stagehand.metrics`.

<CodeGroup>
  ```typescript TypeScript
  console.log(stagehand.metrics);
  ```

  ```python Python
  print(stagehand.metrics)
  ```
</CodeGroup>

This will return an object with the following shape:

<CodeGroup>
  ```typescript TypeScript
  {
    actPromptTokens: 4011,
    actCompletionTokens: 51,
    actInferenceTimeMs: 1688,

    extractPromptTokens: 4200,
    extractCompletionTokens: 243,
    extractInferenceTimeMs: 4297,

    observePromptTokens: 347,
    observeCompletionTokens: 43,
    observeInferenceTimeMs: 903,

    totalPromptTokens: 8558,
    totalCompletionTokens: 337,
    totalInferenceTimeMs: 6888
  }
  ```

  ```python Python
  {
    "act_prompt_tokens": 4011,
    "act_completion_tokens": 51,
    "act_inference_time_ms": 1688,

    "extract_prompt_tokens": 4200,
    "extract_completion_tokens": 243,
    "extract_inference_time_ms": 4297,

    "observe_prompt_tokens": 347,
    "observe_completion_tokens": 43,
    "observe_inference_time_ms": 903,

    "total_prompt_tokens": 8558,
    "total_completion_tokens": 337,
    "total_inference_time_ms": 6888
  }
  ```
</CodeGroup>

## Running Evaluations

Evaluations help you measure the performance and reliability of your Stagehand workflows across different LLMs and configurations.

### Setting up Evals

<CodeGroup>
  ```typescript TypeScript
  import { Stagehand } from "@browserbasehq/stagehand";

  async function runEval() {
    const stagehand = new Stagehand({
      env: "BROWSERBASE",
      enableMetrics: true, // Enable detailed metrics collection
    });

    await stagehand.init();

    // Your automation workflow
    const page = stagehand.page;
    await page.goto("https://example.com");
    await page.act("click the login button");
    
    // Collect metrics
    const metrics = stagehand.metrics;
    console.log("Evaluation metrics:", metrics);

    await stagehand.close();
    return metrics;
  }
  ```

  ```python Python
  from stagehand import Stagehand, StagehandConfig

  async def run_eval():
      config = StagehandConfig(
          env="BROWSERBASE",
          enable_metrics=True,  # Enable detailed metrics collection
      )
      
      stagehand = Stagehand(config)
      await stagehand.init()

      # Your automation workflow
      page = stagehand.page
      await page.goto("https://example.com")
      await page.act("click the login button")
      
      # Collect metrics
      metrics = stagehand.metrics
      print("Evaluation metrics:", metrics)

      await stagehand.close()
      return metrics
  ```
</CodeGroup>

### Comparing LLM Performance

<CodeGroup>
  ```typescript TypeScript
  async function compareLLMs() {
    const models = [
      "openai/gpt-4o",
      "anthropic/claude-3-5-sonnet-20241022",
      "google/gemini-2.0-flash"
    ];

    const results = [];

    for (const model of models) {
      const stagehand = new Stagehand({
        env: "BROWSERBASE",
        modelName: model,
        enableMetrics: true,
      });

      await stagehand.init();
      
      const startTime = Date.now();
      
      // Run your test workflow
      const page = stagehand.page;
      await page.goto("https://example.com");
      await page.act("fill in the search box with 'test query'");
      
      const endTime = Date.now();
      const metrics = stagehand.metrics;

      results.push({
        model,
        totalTime: endTime - startTime,
        metrics,
      });

      await stagehand.close();
    }

    return results;
  }
  ```

  ```python Python
  async def compare_llms():
      models = [
          "openai/gpt-4o",
          "anthropic/claude-3-5-sonnet-20241022",
          "google/gemini-2.0-flash"
      ]

      results = []

      for model in models:
          config = StagehandConfig(
              env="BROWSERBASE",
              model=model,
              enable_metrics=True,
          )
          
          stagehand = Stagehand(config)
          await stagehand.init()
          
          start_time = time.time()
          
          # Run your test workflow
          page = stagehand.page
          await page.goto("https://example.com")
          await page.act("fill in the search box with 'test query'")
          
          end_time = time.time()
          metrics = stagehand.metrics

          results.append({
              "model": model,
              "total_time": end_time - start_time,
              "metrics": metrics,
          })

          await stagehand.close()

      return results
  ```
</CodeGroup>