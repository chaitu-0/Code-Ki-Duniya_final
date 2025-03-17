const express = require('express');
const Profile = require('../models/Profile');
const router = express.Router();

// Create or Update Profile
router.post('/', async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { ...req.body, user: req.user.id },
            { new: true, upsert: true }
        );
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Profile by User ID
router.get('/:userId', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.userId }).populate('user', 'name username');
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
