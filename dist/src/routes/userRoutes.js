"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validation_1 = require("../middleware/validation");
const authorizeSelf_1 = __importDefault(require("../middleware/authorizeSelf"));
const requireAdmin_1 = __importDefault(require("../middleware/requireAdmin"));
const router = express_1.default.Router();
router.get("/", userController_1.getAllUsers);
router.get("/:id", authorizeSelf_1.default, userController_1.getUserById);
router.post("/", requireAdmin_1.default, validation_1.validateCreateUser, userController_1.createUser);
router.put("/:id", authorizeSelf_1.default, validation_1.validateUpdateUser, userController_1.updateUser);
router.delete("/:id", authorizeSelf_1.default, userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map