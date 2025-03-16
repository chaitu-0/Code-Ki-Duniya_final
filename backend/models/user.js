const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true }, // 🔹 Added username (optional, unique)
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // Role-based access
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
