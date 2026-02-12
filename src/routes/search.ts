import { Router } from 'express';
import { searchPages } from '../store.js';
import { withCuries, selfLink, pageSummaryToHal } from '../hal.js';

const router = Router();

// GET /search?q=... — search pages
router.get('/', (req, res) => {
  const q = (req.query.q as string) || '';
  const results = q ? searchPages(q) : [];

  res.json({
    _links: withCuries({
      self: selfLink(`/search?q=${encodeURIComponent(q)}`),
      'wiki:pages': { href: '/pages', title: 'All pages' },
    }),
    _embedded: {
      'wiki:page': results.map(pageSummaryToHal),
    },
    query: q,
    totalCount: results.length,
  });
});

export default router;
