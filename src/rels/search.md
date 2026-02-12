# wiki:search

Searches for pages matching a query string.

## Method

GET

## Template Variables

- `q` — Search query string. Searches page titles, bodies, and tags.

## Example

```http
GET /search?q=protocols
```

## Response

Returns a HAL resource with an embedded array of matching page summaries,
identical in structure to the pages collection response.
