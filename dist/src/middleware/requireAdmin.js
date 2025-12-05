"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
    }
    if (req.user.role !== client_1.Role.ADMIN) {
        return res.status(403).json({ error: "Admin privileges required" });
    }
    next();
};
exports.default = requireAdmin;
//# sourceMappingURL=requireAdmin.js.map