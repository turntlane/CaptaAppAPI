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
import authorizeSelf from "../middleware/authorizeSelf";
import requireAdmin from "../middleware/requireAdmin";

const router = express.Router();

// router.use(authenticate);

// User routes
router.get("/", /*requireAdmin,*/ getAllUsers);
router.get("/:id", authorizeSelf, getUserById);
router.post("/", requireAdmin, validateCreateUser, createUser);
router.put("/:id", authorizeSelf, validateUpdateUser, updateUser);
router.delete("/:id", authorizeSelf, deleteUser);

export default router;
