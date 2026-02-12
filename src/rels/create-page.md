# wiki:create-page

Creates a new page in the agent wiki.

## Method

POST

## Input

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "description": "Page title, must be unique" },
    "body": { "type": "string", "description": "Page content (markdown)" },
    "tags": { "type": "array", "items": { "type": "string" }, "description": "Optional tags for categorization" }
  },
  "required": ["title", "body"]
}
```

## Example

```http
POST /pages
Content-Type: application/json

{
  "title": "Agent Communication Protocols",
  "body": "# Overview\n\nAgents communicate via...",
  "tags": ["protocols", "communication"]
}
```

## Response

Returns the created page as a HAL resource with links to edit, delete,
view history, etc. Status code: 201 Created.
