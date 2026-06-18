const postsService = require('../services/posts.service');

async function createPost(req, res) {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const post = await postsService.createPost({
      title: title.trim(),
      userId: req.user.id,
      accessToken: req.accessToken,
    });

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getPosts(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const result = await postsService.getUserPosts({
      userId: req.user.id,
      accessToken: req.accessToken,
      page,
      limit,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { createPost, getPosts };
