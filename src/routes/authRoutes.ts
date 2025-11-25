import express from "express";
import { login, logout, refresh, register } from "../controllers/authController";
import {
  validateLogin,
  validateRefresh,
  validateRegister,
} from "../middleware/validation";
import loginRateLimiter from "../middleware/loginRateLimiter";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", loginRateLimiter, validateLogin, login);
router.post("/refresh", validateRefresh, refresh);
router.post("/logout", validateRefresh, logout);

export default router;
