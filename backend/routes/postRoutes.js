const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const Post = require("../models/post");

const router = express.Router();

// 📌 Create a Post (Protected Route)
router.post(
    "/",
    [auth, [check("text", "Text is required").not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newPost = new Post({
                user: req.user.id,
                text: req.body.text,
            });

            const post = await newPost.save();
            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    },
);

// 📌 Get All Posts (Protected Route)
router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", ["name", "email"])
            .sort({ createdAt: -1 });
        res.json(posts);
       
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 📌 Update a Post (NEWLY ADDED)
router.put(
    "/:id",
    [auth, [check("text", "Text is required").not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const post = await Post.findById(req.params.id);
            if (!post)
                return res.status(404).json({ message: "Post not found" });

            // Check if the logged-in user is the owner
            if (post.user.toString() !== req.user.id) {
                return res
                    .status(401)
                    .json({ message: "Not authorized to edit this post" });
            }

            // Update post text
            post.text = req.body.text;
            await post.save();

            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    },
);

// 📌 Like/Unlike a Post (Protected Route)
router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const likedIndex = post.likes.findIndex(
            (like) => like.user.toString() === req.user.id,
        );

        if (likedIndex !== -1) {
            post.likes.splice(likedIndex, 1); // Unlike the post
        } else {
            post.likes.push({ user: req.user.id }); // Like the post
        }

        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 📌 Add Comment to a Post (Protected Route)
router.post(
    "/comment/:id",
    [auth, [check("text", "Text is required").not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const post = await Post.findById(req.params.id);
            if (!post)
                return res.status(404).json({ message: "Post not found" });

            const newComment = {
                user: req.user.id,
                text: req.body.text,
            };

            post.comments.push(newComment);
            await post.save();
            res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    },
);

// 📌 Delete a Post (Protected Route)
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.user.toString() !== req.user.id) {
            return res
                .status(401)
                .json({ message: "Not authorized to delete this post" });
        }

        await post.deleteOne();
        res.json({ message: "Post deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
