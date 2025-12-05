"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./src/routes/index"));
const errorHandler_1 = __importDefault(require("./src/middleware/errorHandler"));
const database_1 = __importDefault(require("./src/models/database"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
app.use("/api", index_1.default);
app.use(errorHandler_1.default);
app.listen(3000, "0.0.0.0", () => console.log("API on :3000"));
process.on("beforeExit", async () => {
    await database_1.default.$disconnect();
});
//# sourceMappingURL=index.js.map