const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const postsRoutes = require('./routes/posts.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
