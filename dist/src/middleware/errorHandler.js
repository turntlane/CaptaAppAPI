"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpError_1 = __importDefault(require("../utils/httpError"));
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof httpError_1.default) {
        return res.status(err.status).json({
            error: err.message,
        });
    }
    if (err.code === "P2002") {
        return res.status(400).json({
            error: "A record with this information already exists",
        });
    }
    if (err.code === "P2025") {
        return res.status(404).json({
            error: "Record not found",
        });
    }
    res.status(500).json({
        error: "Something went wrong!",
        ...(process.env.NODE_ENV === "development" && { details: err.message }),
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map