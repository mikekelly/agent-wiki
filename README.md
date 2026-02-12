# agent-wiki

A HAL+JSON wiki API designed for AI agent exploration. It serves as a reference implementation of an API that is fully self-describing — not through OpenAPI specs or static documentation, but through hypermedia links and natural-language relation documentation that an LLM can read, reason about, and act on.

## The idea

Most API integrations today follow a pattern: a human reads documentation, writes deterministic code, and ships it. The API's capabilities are frozen into that code at write time. If the API adds a new endpoint, the integration doesn't notice.

Hyperlinked APIs were designed to solve this — clients follow links at runtime instead of hardcoding URLs. But the approach never gained traction because traditional clients couldn't reason about unfamiliar link relations. They need to know in advance what `wiki:create-page` means and what to send.

LLMs change this. An agent can:

1. **Discover** — follow `self`-describing links from a root resource
2. **Read** — fetch the relation documentation (a markdown "prompt file") to understand what a link does, what method to use, and what input to provide
3. **Act** — construct the right request through inference, not hardcoded logic

This is **progressive disclosure for APIs**. The agent doesn't need a complete schema upfront. It starts at the root, sees what's available, reads what it needs, and explores deeper — just like a human browsing a website.

### From exploration to determinism

The exploration phase is non-deterministic — the agent reasons, makes choices, and occasionally takes wrong turns. But that's the discovery phase, not the production phase. Once an agent has explored a workflow (using [hal-walk](../hal-walk)), the traversal is recorded as a directed graph and can be **distilled into a deterministic path spec** — a declarative description of the exact steps, relations, and inputs needed to reproduce the workflow without any LLM inference at all.

The non-deterministic explorer produces deterministic artifacts. The AI writes the integration so the code doesn't need AI to run.

## Running

```bash
npm install
npm run dev
```

The server starts at `http://localhost:3000`.

## API structure

Every response uses `application/hal+json`. The root resource links to everything:

```
GET /                                          → Root (entry point)
GET /pages                                     → Page collection
POST /pages                                    → Create a page
GET /pages/:id                                 → Single page (latest version)
PUT /pages/:id                                 → Edit page (creates new version)
DELETE /pages/:id                              → Delete page
GET /pages/:id/history                         → Version history
GET /pages/:id/versions/:vid                   → Specific version (with diff)
GET /pages/:id/versions/:vid/comments          → Comments on a version
POST /pages/:id/versions/:vid/comments         → Add a comment
GET /categories                                → Categories (derived from tags)
GET /search?q=...                              → Full-text search
```

## CURIEs and relation documentation

All custom link relations use the `wiki:` CURIE prefix. The root resource declares the expansion template:

```json
{
  "curies": [{
    "name": "wiki",
    "href": "http://localhost:3000/rels/{rel}",
    "templated": true
  }]
}
```

So `wiki:create-page` expands to `http://localhost:3000/rels/create-page`, which returns a markdown document describing the relation — its HTTP method, input schema, an example request, and what to expect in the response. These are **prompt files**: documentation written for LLM consumption, not for a parser. The agent reads them and infers what to do.

## Design choices

- **In-memory store** — no database setup, restarts clean. This is a playground.
- **Versioning with diffs** — every edit creates a new version with a unified diff from the previous one. This gives agents a way to reason about change history.
- **Tags as categories** — categories are derived from page tags, not managed separately. Keeps the model simple while still providing a browsable taxonomy.
- **Markdown relation docs** — deliberately not JSON Schema or machine-readable specs. The point is that the agent's LLM reads and reasons about them, which is what makes the system work for novel APIs the agent has never seen before.
