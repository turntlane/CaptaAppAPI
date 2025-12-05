"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const authorizeSelf = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
    }
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "User id parameter is required" });
    }
    if (id !== req.user.id && req.user.role !== client_1.Role.ADMIN) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};
exports.default = authorizeSelf;
//# sourceMappingURL=authorizeSelf.js.map