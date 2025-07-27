# CrewAI Integration

> Automate browser tasks using natural language instructions with CrewAI

This tool integrates the Stagehand Python SDK with CrewAI, allowing agents to interact with websites and automate browser tasks using natural language instructions.

## Description

The StagehandTool wraps the Stagehand Python SDK to provide CrewAI agents with the ability to control a real web browser and interact with websites using three core primitives:

1. **Act**: Perform actions like clicking, typing, or navigating
2. **Extract**: Extract structured data from web pages
3. **Observe**: Identify and analyze elements on the page

## Requirements

Before using this tool, you will need:

1. A [Browserbase](https://www.browserbase.com/) account with API key and project ID
2. An API key for an LLM (OpenAI or Anthropic Claude)
3. The Stagehand Python SDK installed

Install the dependencies:

```bash
pip install stagehand-py crewai crewai-tools
```

## Usage

### Basic Usage

```python
from crewai import Agent, Task, Crew
from crewai_tools import StagehandTool
from stagehand.schemas import AvailableModel

# Initialize the tool with your API keys
stagehand_tool = StagehandTool(
    api_key="your-browserbase-api-key",
    project_id="your-browserbase-project-id",
    model_api_key="your-llm-api-key",  # OpenAI or Anthropic API key
    model_name=AvailableModel.CLAUDE_3_7_SONNET_LATEST,  # Optional: specify which model to use
)

# Create an agent with the tool
researcher = Agent(
    role="Web Researcher",
    goal="Find and summarize information from websites",
    backstory="I'm an expert at finding information online.",
    verbose=True,
    tools=[stagehand_tool],
)

# Create a task that uses the tool
research_task = Task(
    description="Go to https://www.example.com and find the main heading",
    expected_output="The main heading text from the website",
    agent=researcher,
)

# Create and run the crew
crew = Crew(
    agents=[researcher],
    tasks=[research_task],
    verbose=True
)

result = crew.kickoff()
print(result)
```

### Advanced Usage with Multiple Actions

```python
complex_task = Task(
    description="""
    Go to https://news.ycombinator.com and:
    1. Find the top 3 article titles
    2. Click on the first article
    3. Extract the article content
    4. Return a summary
    """,
    expected_output="A summary of the top Hacker News article",
    agent=researcher,
)
```

## Tool Parameters

- `api_key`: Your Browserbase API key
- `project_id`: Your Browserbase project ID  
- `model_api_key`: API key for your chosen LLM (OpenAI or Anthropic)
- `model_name`: The model to use (optional, defaults to GPT-4)

## Available Models

The tool supports various models from different providers:

- OpenAI: `GPT_4O`, `GPT_4O_MINI`
- Anthropic: `CLAUDE_3_5_SONNET_LATEST`, `CLAUDE_3_7_SONNET_LATEST`
- And more...

## Best Practices

1. **Be specific in your task descriptions**: The more detailed your instructions, the better the tool can perform the automation
2. **Handle errors gracefully**: Web automation can be unpredictable, so include error handling in your workflows
3. **Use meaningful agent roles**: Well-defined agent roles help with task execution
4. **Test with simple tasks first**: Start with basic navigation and data extraction before complex multi-step workflows