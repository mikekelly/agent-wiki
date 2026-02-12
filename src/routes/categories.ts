import { Router } from 'express';
import { getAllCategories, getCategory } from '../store.js';
import { withCuries, selfLink, categoryToHal } from '../hal.js';

const router = Router();

// GET /categories — list all categories
router.get('/', (_req, res) => {
  const categories = getAllCategories();

  res.json({
    _links: withCuries({
      self: selfLink('/categories'),
      'wiki:pages': { href: '/pages', title: 'All pages' },
    }),
    _embedded: {
      'wiki:category': categories.map(categoryToHal),
    },
    totalCount: categories.length,
  });
});

// GET /categories/:name — single category
router.get('/:name', (req, res) => {
  const category = getCategory(decodeURIComponent(req.params.name));
  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  res.json(categoryToHal(category));
});

export default router;
