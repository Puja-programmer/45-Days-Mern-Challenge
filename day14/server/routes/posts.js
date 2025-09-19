const express = require('express');
const auth = require('../middleware/auth');
const Post = require('../models/Post');

const router = express.Router();

// Create Post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user.id,
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get All Posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email');
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;