# wiki:history

Retrieves the version history of a page, ordered newest first.

## Method

GET

## Response

Returns a HAL resource with an embedded array of version summaries.
Each summary includes the version ID (vid), edit note, timestamp, and a link
to the full version resource.

## Links Available

- `wiki:page` — Back to the current page
- Each embedded version links to itself and its comments
