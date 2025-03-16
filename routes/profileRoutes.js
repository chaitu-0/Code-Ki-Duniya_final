// const express = require("express");
// const { getUserProfile } = require("../controllers/profileController");
// const protect = require("../middleware/authMiddleware");

// const router = express.Router();

// // Route to get user profile (protected)
// router.get("/profile", protect, getUserProfile);

// module.exports = router;
const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  deleteUser,
} = require("../controllers/profileController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Route to get user profile (protected)
router.get("/profile", protect, getUserProfile);

// Route to update user profile (protected)
router.put("/profile", protect, updateUserProfile);

// Route to delete user (protected)
router.delete("/profile", protect, deleteUser);

module.exports = router;
