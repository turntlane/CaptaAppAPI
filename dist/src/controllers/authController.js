"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const extractMetadata = (req) => ({
    ip: req.ip,
    userAgent: req.headers["user-agent"] ?? undefined,
});
const register = async (req, res, next) => {
    try {
        const result = await (0, authService_1.registerUser)(req.body, extractMetadata(req));
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const result = await (0, authService_1.loginUser)(req.body, extractMetadata(req));
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken || typeof refreshToken !== "string") {
            return res.status(400).json({ error: "refreshToken is required" });
        }
        const result = await (0, authService_1.refreshSession)(refreshToken, extractMetadata(req));
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.refresh = refresh;
const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken || typeof refreshToken !== "string") {
            return res.status(400).json({ error: "refreshToken is required" });
        }
        await (0, authService_1.revokeSession)(refreshToken);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map