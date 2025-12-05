"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../utils/token");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authentication required" });
    }
    const token = authHeader.slice(7).trim();
    try {
        const payload = (0, token_1.verifyAccessToken)(token);
        req.user = {
            id: payload.sub,
            email: payload.email,
            username: payload.username,
            role: payload.role,
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = authenticate;
//# sourceMappingURL=authenticate.js.map