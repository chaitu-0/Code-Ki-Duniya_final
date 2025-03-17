const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bio: { type: String },
    skills: [String],
    github: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
