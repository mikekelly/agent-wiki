import { Router } from 'express';
import {
  createPage,
  editPage,
  deletePage,
  getPage,
  getAllPages,
} from '../store.js';
import {
  withCuries,
  selfLink,
  pageToHal,
  pageSummaryToHal,
} from '../hal.js';

const router = Router();

// GET /pages — list all pages
router.get('/', (_req, res) => {
  const pages = getAllPages();
  res.json({
    _links: withCuries({
      self: selfLink('/pages'),
      'wiki:create-page': { href: '/pages', title: 'Create a new page' },
      'wiki:search': { href: '/search{?q}', templated: true, title: 'Search pages' },
    }),
    _embedded: {
      'wiki:page': pages.map(pageSummaryToHal),
    },
    totalCount: pages.length,
  });
});

// POST /pages — create a page
router.post('/', (req, res) => {
  const { title, body, tags } = req.body;
  if (!title || !body) {
    res.status(400).json({ error: 'title and body are required' });
    return;
  }
  const page = createPage(title, body, tags);
  res.status(201).json(pageToHal(page));
});

// GET /pages/:id — get a single page
router.get('/:id', (req, res) => {
  const page = getPage(req.params.id);
  if (!page) {
    res.status(404).json({ error: 'Page not found' });
    return;
  }
  res.json(pageToHal(page));
});

// PUT /pages/:id — edit a page
router.put('/:id', (req, res) => {
  const { body, tags, editNote } = req.body;
  if (!body) {
    res.status(400).json({ error: 'body is required' });
    return;
  }
  const page = editPage(req.params.id, body, tags, editNote);
  if (!page) {
    res.status(404).json({ error: 'Page not found' });
    return;
  }
  res.json(pageToHal(page));
});

// DELETE /pages/:id — delete a page
router.delete('/:id', (req, res) => {
  const deleted = deletePage(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Page not found' });
    return;
  }
  res.status(204).send();
});

export default router;
