const Post = require("./models/post.js");
const express = require("express");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", profileRoutes); // 🔹 Added profile routes

// Root route
app.get("/", (req, res) => {
    res.send("🚀 API is running...");
});

//post route starting
const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
