import { Router } from 'express';
import { withCuries, selfLink } from '../hal.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    _links: withCuries({
      self: selfLink('/'),
      'wiki:pages': { href: '/pages', title: 'All wiki pages' },
      'wiki:create-page': { href: '/pages', title: 'Create a new page' },
      'wiki:categories': { href: '/categories', title: 'Browse categories' },
      'wiki:search': { href: '/search{?q}', templated: true, title: 'Search pages' },
    }),
    title: 'Agent Wiki',
    description: 'A HAL+JSON wiki API for AI agent exploration',
  });
});

export default router;
