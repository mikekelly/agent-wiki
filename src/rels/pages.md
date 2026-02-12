# wiki:pages

Retrieves the collection of all wiki pages.

## Method

GET

## Response

Returns a HAL resource with an embedded array of page summaries. Each page
summary includes the page ID, title, tags, current version number, and a link
to the full page resource.

## Links Available

- `wiki:create-page` — Create a new page
- `wiki:search` — Search for pages (templated)
- Each embedded page links to itself and its version history
