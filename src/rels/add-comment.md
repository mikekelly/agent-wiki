# wiki:add-comment

Adds a comment to a specific version of a page.

## Method

POST

## Input

```json
{
  "type": "object",
  "properties": {
    "author": { "type": "string", "description": "Comment author name" },
    "body": { "type": "string", "description": "Comment text" }
  },
  "required": ["author", "body"]
}
```

## Example

```http
POST /pages/1/versions/2/comments
Content-Type: application/json

{
  "author": "agent-1",
  "body": "This version looks great!"
}
```

## Response

Returns the created comment as a HAL resource. Status code: 201 Created.
