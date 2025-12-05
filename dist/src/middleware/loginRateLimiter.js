"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map();
const makeKey = (req) => {
    const email = typeof req.body?.email === "string" ? req.body.email.toLowerCase() : "";
    return `${req.ip}:${email}`;
};
const loginRateLimiter = (req, res, next) => {
    const key = makeKey(req);
    const now = Date.now();
    const record = attempts.get(key);
    if (record && record.expiresAt > now) {
        if (record.count >= MAX_ATTEMPTS) {
            return res
                .status(429)
                .json({ error: "Too many login attempts. Please try again later." });
        }
        record.count += 1;
        attempts.set(key, record);
    }
    else {
        attempts.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    }
    res.on("finish", () => {
        const latest = attempts.get(key);
        if (!latest) {
            return;
        }
        if (res.statusCode >= 200 && res.statusCode < 400) {
            attempts.delete(key);
        }
        else if (Date.now() > latest.expiresAt) {
            attempts.delete(key);
        }
    });
    next();
};
exports.default = loginRateLimiter;
//# sourceMappingURL=loginRateLimiter.js.map