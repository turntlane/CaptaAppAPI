"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenConfig = exports.generateRefreshToken = exports.hashToken = exports.verifyAccessToken = exports.createAccessToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpError_1 = __importDefault(require("./httpError"));
const getEnv = (key, fallback) => {
    const value = process.env[key] ?? fallback;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};
const parseAccessTtl = () => getEnv("JWT_ACCESS_TTL", "15m");
const refreshTtlDays = () => {
    const ttl = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "7");
    if (Number.isNaN(ttl) || ttl <= 0) {
        throw new Error("REFRESH_TOKEN_TTL_DAYS must be a positive number");
    }
    return ttl;
};
const createAccessToken = (payload) => {
    const secret = getEnv("JWT_ACCESS_SECRET");
    const options = {
        expiresIn: parseAccessTtl(),
    };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.createAccessToken = createAccessToken;
const verifyAccessToken = (token) => {
    try {
        const secret = getEnv("JWT_ACCESS_SECRET");
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch {
        throw new httpError_1.default(401, "Invalid or expired token");
    }
};
exports.verifyAccessToken = verifyAccessToken;
const hashToken = (token) => {
    return crypto_1.default.createHash("sha256").update(token).digest("hex");
};
exports.hashToken = hashToken;
const generateRefreshToken = () => {
    const token = crypto_1.default.randomBytes(64).toString("hex");
    const tokenHash = (0, exports.hashToken)(token);
    const expiresAt = new Date(Date.now() + refreshTtlDays() * 24 * 60 * 60 * 1000);
    return { token, tokenHash, expiresAt };
};
exports.generateRefreshToken = generateRefreshToken;
exports.tokenConfig = {
    accessTtl: parseAccessTtl(),
    refreshTtlDays: refreshTtlDays(),
};
//# sourceMappingURL=token.js.map