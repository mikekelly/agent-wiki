import { Router } from 'express';
import { getVersions, getVersion } from '../store.js';
import {
  withCuries,
  selfLink,
  versionToHal,
  versionSummaryToHal,
} from '../hal.js';

const router = Router();

// GET /pages/:id/history — version list (newest first)
router.get('/:id/history', (req, res) => {
  const versions = getVersions(req.params.id);
  if (!versions) {
    res.status(404).json({ error: 'Page not found' });
    return;
  }

  res.json({
    _links: withCuries({
      self: selfLink(`/pages/${req.params.id}/history`),
      'wiki:page': { href: `/pages/${req.params.id}`, title: 'Current page' },
      'wiki:version': { href: `/pages/${req.params.id}/versions/{vid}`, templated: true, title: 'View a specific version' },
    }),
    _embedded: {
      'wiki:version': versions.map(versionSummaryToHal),
    },
    totalCount: versions.length,
  });
});

// GET /pages/:id/versions/:vid — single version with diff
router.get('/:id/versions/:vid', (req, res) => {
  const vid = parseInt(req.params.vid, 10);
  if (isNaN(vid)) {
    res.status(400).json({ error: 'Invalid version ID' });
    return;
  }

  const versions = getVersions(req.params.id);
  if (!versions) {
    res.status(404).json({ error: 'Page not found' });
    return;
  }

  const version = getVersion(req.params.id, vid);
  if (!version) {
    res.status(404).json({ error: 'Version not found' });
    return;
  }

  res.json(versionToHal(version, versions.length));
});

export default router;
