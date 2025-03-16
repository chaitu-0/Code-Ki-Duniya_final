const express = require("express");
const { getUserProfile, updateUserProfile, deleteUser } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Correct routes
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile); // ✅ Fix PUT request
router.delete("/profile", authMiddleware, deleteUser);

module.exports = router;
