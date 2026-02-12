# wiki:comments

Retrieves comments on a specific version of a page.

## Method

GET

## Response

Returns a HAL resource with an embedded array of comments. Each comment
includes the author, body, and timestamp.

## Links Available

- `wiki:version` — Parent version
- `wiki:add-comment` — Add a comment to this version
