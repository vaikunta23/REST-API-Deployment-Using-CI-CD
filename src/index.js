import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersData from "./data.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// Health checkk endpoint
app.get("/api/v1/health", (req, res) => {
  return res.status(200).json({ status: "OK" });
});

// Get all users
app.get("/api/v1/users", (req, res) => {
  try {
    return res.status(200).json({
      message: "Users retrieved successfully",
      data: usersData.users,
      count: usersData.users.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving users",
      error: error.message,
    });
  }
});

// Get user by ID
app.get("/api/v1/users/:id", (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = usersData.users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving user",
      error: error.message,
    });
  }
});

// Create new user
app.post("/api/v1/users", (req, res) => {
  try {
    const { username, email, firstName, lastName, role = "user" } = req.body;

    if (!username || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "All fields are required (username, email, firstName, lastName)",
      });
    }

    // Create new user
    const newUser = {
      id: Math.max(...usersData.users.map(u => u.id)) + 1,
      username,
      email,
      firstName,
      lastName,
      role
    };

    usersData.users.push(newUser);

    return res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
});

// Delete user
app.delete("/api/v1/users/:id", (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = usersData.users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    usersData.users.splice(userIndex, 1);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
