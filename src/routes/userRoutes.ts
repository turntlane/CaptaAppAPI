import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import {
  validateCreateUser,
  validateUpdateUser,
} from "../middleware/validation";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.use(authenticate);

// User routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", validateCreateUser, createUser);
router.put("/:id", validateUpdateUser, updateUser);
router.delete("/:id", deleteUser);

export default router;
