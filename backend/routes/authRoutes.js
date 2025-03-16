const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const router = express.Router();

// 🔹 Register Route
router.post("/register", async (req, res) => {
  let { name, username, email, password } = req.body;

  try {
    // 🔥 Trim all input fields to remove spaces
    name = name.trim();
    username = username.trim().toLowerCase(); // 🔹 Convert username to lowercase
    email = email.trim().toLowerCase(); // 🔹 Convert email to lowercase

    // 🔥 Check if all fields are provided
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔥 Check if username or email already exists
    let existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.username === username 
          ? "Username already taken" 
          : "Email already registered" 
      });
    }

    // 🔥 Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, username, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 Login Route
router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  try {
    email = email.trim().toLowerCase(); // 🔹 Convert email to lowercase

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
