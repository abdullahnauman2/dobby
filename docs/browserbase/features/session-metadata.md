# Metadata

## Overview

As your number of sessions grows, attaching metadata helps to organize your sessions based on your application's specific needs. The [List Sessions](/reference/api/list-sessions) endpoint supports filtering sessions by status, which is helpful but not highly configurable. Session metadata allows you to attach arbitrary JSON data to sessions, which then gives you additional flexibility when querying sessions.

### Creating a Session with Metadata

Metadata is attached to a session when hitting the [Create Session](/reference/api/create-a-session) endpoint. This metadata can be any JSON-serializable object. 

This metadata is attached to the stored session object and can be queried against using the [List Sessions](/reference/api/list-sessions) endpoint.

Below is an example for attaching an order status to a created session. This will attach the object `{"order": {"status": "shipped"}}` to the created session.

```typescript
import Browserbase from "@browserbasehq/sdk";

const bb = new Browserbase({ apiKey: process.env["BROWSERBASE_API_KEY"]! });

async function createSessionWithMetadata() {
  const session = await bb.sessions.create({
    projectId: process.env["BROWSERBASE_PROJECT_ID"]!,
    userMetadata: {
      key: "value",
      key2: {
        key2A: "value2A",
        key2B: "value2B",
      },
    },
  });
  return session;
}

const session = await createSessionWithMetadata();
console.log("Session URL: https://browserbase.com/sessions/" + session.id);
```

The size of the stored JSON object is limited to 512 characters. This is measured by converting the object into a JSON string and measuring its length.

### Querying Sessions by Session Metadata

Querying using session metadata is done via the `q` query parameter on the [List Sessions](/reference/api/list-sessions) endpoint. 

To query for all sessions with an order status of `"shipped"`, you can use the following query:

```
user_metadata['order']['status']:'shipped'
```

This query contains:
- `user_metadata` is the "base" of the query
- `['order']['status']` navigates the nested JSON structure
- `:'shipped'` matches the exact value

### Query Examples

Here are some common query patterns:

#### Simple Key-Value Match
```
user_metadata['environment']:'production'
```

#### Nested Object Query
```
user_metadata['user']['role']:'admin'
```

#### Multiple Conditions
```
user_metadata['status']:'active' AND user_metadata['priority']:'high'
```

## Limitations

- Maximum metadata size: 512 characters (JSON string length)
- Only JSON-serializable data types are supported
- Queries are case-sensitive
- Complex queries may have performance implications

## Best Practices

- Keep metadata concise due to size limitations
- Use consistent naming conventions for metadata keys
- Consider indexing frequently queried metadata fields
- Use metadata for filtering and organization, not for storing large data sets