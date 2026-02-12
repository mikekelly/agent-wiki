import express from 'express';
import rootRouter from './routes/root.js';
import pagesRouter from './routes/pages.js';
import versionsRouter from './routes/versions.js';
import commentsRouter from './routes/comments.js';
import categoriesRouter from './routes/categories.js';
import searchRouter from './routes/search.js';
import relsRouter from './routes/rels.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Set default content type for API responses
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    res.type('application/hal+json');
    return originalJson(body);
  };
  next();
});

app.use('/', rootRouter);
app.use('/pages', pagesRouter);
app.use('/pages', versionsRouter);
app.use('/pages', commentsRouter);
app.use('/categories', categoriesRouter);
app.use('/search', searchRouter);
app.use('/rels', relsRouter);

app.listen(PORT, () => {
  console.log(`Agent Wiki running at http://localhost:${PORT}`);
});
