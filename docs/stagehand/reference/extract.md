# Extract

> Extract structured data from the page

<CodeGroup>
  ```typescript TypeScript
  const data = await page.extract({
    instruction: "extract the price of the item",
    schema: z.object({
      price: z.number(),
    }),
  });
  ```

  ```python Python
  data = await page.extract("extract the price of the item")
  ```
</CodeGroup>

`extract()` is used to extract structured data from the current page using natural language instructions and schemas.

## Single Object Extraction

Extract a single piece of data from the page:

<CodeGroup>
  ```typescript TypeScript
  const item = await page.extract({
    instruction: "extract the price of the item",
    schema: z.object({
      price: z.number(),
    }),
  });
  ```

  ```python Python
  from pydantic import BaseModel

  class Item(BaseModel):
      price: float

  item = await page.extract(
      "extract the price of the item",
      schema=Item
  )
  ```
</CodeGroup>

## Link Extraction

Extract links and URLs from the page:

<CodeGroup>
  ```typescript TypeScript
  const extraction = await page.extract({
    instruction: "extract the link to the 'contact us' page",
    schema: z.object({
      link: z.string().url(),
    }),
  });
  ```

  ```python Python
  from pydantic import BaseModel, HttpUrl

  class ContactLink(BaseModel):
      link: HttpUrl

  extraction = await page.extract(
      "extract the link to the 'contact us' page",
      schema=ContactLink
  )
  ```
</CodeGroup>

## List Object Extraction

Extract multiple items as a list:

<CodeGroup>
  ```typescript TypeScript
  const apartments = await page.extract({
    instruction: "Extract ALL the apartment listings and their details",
    schema: z.object({
      list_of_apartments: z.array(
        z.object({
          address: z.string(),
          price: z.string(),
          square_feet: z.string(),
        }),
      ),
    })
  });
  ```

  ```python Python
  from pydantic import BaseModel
  from typing import List

  class Apartment(BaseModel):
      address: str
      price: str
      square_feet: str

  class ApartmentList(BaseModel):
      list_of_apartments: List[Apartment]

  apartments = await page.extract(
      "Extract ALL the apartment listings and their details",
      schema=ApartmentList
  )
  ```
</CodeGroup>

## Additional Context

Provide additional context for more accurate extraction:

<CodeGroup>
  ```typescript TypeScript
  const data = await page.extract({
    instruction: "extract product details",
    schema: z.object({
      name: z.string(),
      price: z.number(),
      inStock: z.boolean(),
    }),
    content: "focus on the main product card, not the related items",
  });
  ```

  ```python Python
  from pydantic import BaseModel

  class Product(BaseModel):
      name: str
      price: float
      in_stock: bool

  data = await page.extract(
      "extract product details",
      schema=Product,
      content="focus on the main product card, not the related items"
  )
  ```
</CodeGroup>

### **Arguments:** [`ExtractOptions`](https://github.com/browserbase/stagehand/blob/main/types/stagehand.ts)

<Tabs>
  <Tab title="TypeScript">
    <ParamField path="instruction" type="string" required>
      Natural language instruction for what to extract
    </ParamField>

    <ParamField path="schema" type="ZodSchema" required>
      Zod schema defining the structure of the data to extract
    </ParamField>

    <ParamField path="content" type="string" optional>
      Additional context or content to help with extraction
    </ParamField>

    <ParamField path="modelName" type="AvailableModel" optional>
      Specific model to use for extraction
    </ParamField>

    <ParamField path="domSettleTimeoutMs" type="number" optional>
      Time to wait for DOM to settle before extraction. Default: 30000
    </ParamField>

    <ParamField path="useTextExtract" type="boolean" optional>
      Use text-only extraction for better performance. Default: true
    </ParamField>

    <ParamField path="useVision" type="boolean" optional>
      Use visual analysis for extraction. Default: false
    </ParamField>

    <ParamField path="requestId" type="string" optional>
      Custom request ID for tracking
    </ParamField>

    <ParamField path="timeout" type="number" optional>
      Maximum time to wait for extraction in milliseconds
    </ParamField>
  </Tab>

  <Tab title="Python">
    When using just a string:
    - The string is the instruction for extraction

    When using with schema:
    <ParamField path="instruction" type="str" required>
      Natural language instruction for what to extract
    </ParamField>

    <ParamField path="schema" type="Type[BaseModel]" optional>
      Pydantic model defining the structure of the data to extract
    </ParamField>

    <ParamField path="content" type="str" optional>
      Additional context or content to help with extraction
    </ParamField>

    <ParamField path="model_name" type="AvailableModel" optional>
      Specific model to use for extraction
    </ParamField>

    <ParamField path="dom_settle_timeout_ms" type="int" optional>
      Time to wait for DOM to settle before extraction. Default: 30000
    </ParamField>

    <ParamField path="use_text_extract" type="bool" optional>
      Use text-only extraction for better performance. Default: True
    </ParamField>

    <ParamField path="use_vision" type="bool" optional>
      Use visual analysis for extraction. Default: False
    </ParamField>

    <ParamField path="request_id" type="str" optional>
      Custom request ID for tracking
    </ParamField>

    <ParamField path="timeout" type="int" optional>
      Maximum time to wait for extraction in milliseconds
    </ParamField>
  </Tab>
</Tabs>

### **Returns:**

<Tabs>
  <Tab title="TypeScript">
    Returns the extracted data matching the provided schema type. The return type is inferred from your Zod schema.
  </Tab>

  <Tab title="Python">
    Returns the extracted data as an instance of the provided Pydantic model, or as a dictionary if no schema is provided.
  </Tab>
</Tabs>

## Best Practices

1. **Be specific in instructions**: Clear, specific instructions yield better results
2. **Use appropriate schemas**: Match your schema to the expected data structure
3. **Handle missing data**: Use optional fields in your schema for data that might not always be present
4. **Consider performance**: Use `useTextExtract: true` (default) for faster extraction when visual analysis isn't needed
5. **Lists vs single items**: When extracting multiple items, explicitly ask for "ALL" items and structure your schema with an array/list