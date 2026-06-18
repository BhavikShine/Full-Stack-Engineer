const { Router } = require('express');
const postsController = require('../controllers/posts.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

router.post('/', authenticate, postsController.createPost);
router.get('/', authenticate, postsController.getPosts);

module.exports = router;
