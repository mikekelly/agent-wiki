import { Router } from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
const relsDir = join(__dirname, '..', 'rels');

// GET /rels/:name — serve relation documentation as markdown
router.get('/:name', (req, res) => {
  const name = req.params.name;
  const filePath = join(relsDir, `${name}.md`);

  try {
    const content = readFileSync(filePath, 'utf-8');
    res.type('text/markdown').send(content);
  } catch {
    res.status(404).type('text/markdown').send(`# Not Found\n\nRelation \`wiki:${name}\` is not documented.`);
  }
});

export default router;
