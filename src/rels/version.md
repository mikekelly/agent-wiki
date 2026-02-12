# wiki:version

Retrieves a specific version of a page.

## Method

GET

## Response

Returns a HAL resource with the full page content at that version,
including a unified diff from the previous version (null for version 1).

## Links Available

- `wiki:page` — Current page
- `wiki:history` — Version history
- `wiki:comments` — Comments on this version
- `wiki:add-comment` — Add a comment to this version
- `prev` — Previous version (if exists)
- `next` — Next version (if exists)
