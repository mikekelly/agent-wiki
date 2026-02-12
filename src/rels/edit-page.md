# wiki:edit-page

Edits an existing wiki page, creating a new version.

## Method

PUT

## Input

```json
{
  "type": "object",
  "properties": {
    "body": { "type": "string", "description": "New page content (markdown)" },
    "tags": { "type": "array", "items": { "type": "string" }, "description": "Updated tags (replaces existing)" },
    "editNote": { "type": "string", "description": "Brief description of changes" }
  },
  "required": ["body"]
}
```

## Example

```http
PUT /pages/1
Content-Type: application/json

{
  "body": "# Updated Overview\n\nRevised content here...",
  "editNote": "Clarified introduction section"
}
```

## Response

Returns the updated page as a HAL resource. A new version is automatically
created and the diff from the previous version is stored.
