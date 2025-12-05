"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.json({ message: "CaptaApp API is running!" });
});
router.use("/users", userRoutes_1.default);
router.use("/auth", authRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map