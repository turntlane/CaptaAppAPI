import express from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

const router = express.Router();

// Health check route
router.get("/", (req, res) => {
  res.json({ message: "CaptaApp API is running!" });
});

// API routes
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

export default router;
