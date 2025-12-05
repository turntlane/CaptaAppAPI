"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const loginRateLimiter_1 = __importDefault(require("../middleware/loginRateLimiter"));
const router = express_1.default.Router();
router.post("/register", validation_1.validateRegister, authController_1.register);
router.post("/login", loginRateLimiter_1.default, validation_1.validateLogin, authController_1.login);
router.post("/refresh", validation_1.validateRefresh, authController_1.refresh);
router.post("/logout", validation_1.validateRefresh, authController_1.logout);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map