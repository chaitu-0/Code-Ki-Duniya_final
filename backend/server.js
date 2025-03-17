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
const postRoutes = require("./routes/postRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", profileRoutes); // ✅ Correct path for profile routes
app.use("/api/posts", postRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend is Working .....");
//   res.status(201).json({
//     success : true,
//     massege : "Backend is Working"
// })
});

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
