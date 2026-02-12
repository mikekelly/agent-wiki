# wiki:categories

Retrieves all categories (derived from page tags).

## Method

GET

## Response

Returns a HAL resource with an embedded array of categories. Each category
includes its name, the count of pages in it, and the list of page IDs.

## Links Available

- `wiki:pages` — All pages
