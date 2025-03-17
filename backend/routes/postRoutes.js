const express = require('express');
const Post = require('../models/Post');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a Post
router.post('/', authenticateJWT, async (req, res) => {
    try {
        const post = new Post({ user: req.user.id, text: req.body.text });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get All Posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update a Post
router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        post.text = req.body.text || post.text;
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Like/Unlike a Post
router.put('/like/:id', authenticateJWT, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        if (post.likes.includes(req.user.id)) {
            post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
        } else {
            post.likes.push(req.user.id);
        }
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add Comment to a Post
router.post('/comment/:id', authenticateJWT, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const comment = { user: req.user.id, text: req.body.text, createdAt: new Date() };
        post.comments.push(comment);
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a Post
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
