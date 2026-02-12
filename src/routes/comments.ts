import { Router } from 'express';
import { addComment, getComments, getComment } from '../store.js';
import { withCuries, selfLink, commentToHal } from '../hal.js';

const router = Router();

// GET /pages/:id/versions/:vid/comments — list comments
router.get('/:id/versions/:vid/comments', (req, res) => {
  const vid = parseInt(req.params.vid, 10);
  if (isNaN(vid)) {
    res.status(400).json({ error: 'Invalid version ID' });
    return;
  }

  const comments = getComments(req.params.id, vid);
  if (comments === undefined) {
    res.status(404).json({ error: 'Page or version not found' });
    return;
  }

  res.json({
    _links: withCuries({
      self: selfLink(`/pages/${req.params.id}/versions/${vid}/comments`),
      'wiki:version': {
        href: `/pages/${req.params.id}/versions/${vid}`,
        title: 'Parent version',
      },
      'wiki:add-comment': {
        href: `/pages/${req.params.id}/versions/${vid}/comments`,
        title: 'Add a comment',
      },
    }),
    _embedded: {
      'wiki:comment': comments.map(commentToHal),
    },
    totalCount: comments.length,
  });
});

// POST /pages/:id/versions/:vid/comments — add a comment
router.post('/:id/versions/:vid/comments', (req, res) => {
  const vid = parseInt(req.params.vid, 10);
  if (isNaN(vid)) {
    res.status(400).json({ error: 'Invalid version ID' });
    return;
  }

  const { author, body } = req.body;
  if (!author || !body) {
    res.status(400).json({ error: 'author and body are required' });
    return;
  }

  const comment = addComment(req.params.id, vid, author, body);
  if (!comment) {
    res.status(404).json({ error: 'Page or version not found' });
    return;
  }

  res.status(201).json(commentToHal(comment));
});

// GET /pages/:id/versions/:vid/comments/:cid — single comment
router.get('/:id/versions/:vid/comments/:cid', (req, res) => {
  const vid = parseInt(req.params.vid, 10);
  if (isNaN(vid)) {
    res.status(400).json({ error: 'Invalid version ID' });
    return;
  }

  const comment = getComment(req.params.id, vid, req.params.cid);
  if (!comment) {
    res.status(404).json({ error: 'Comment not found' });
    return;
  }

  res.json(commentToHal(comment));
});

export default router;
