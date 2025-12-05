"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRateLimitInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
let LoginRateLimitInterceptor = class LoginRateLimitInterceptor {
    constructor() {
        this.attempts = new Map();
    }
    makeKey(context) {
        const request = context.switchToHttp().getRequest();
        const email = typeof request.body?.email === 'string'
            ? request.body.email.toLowerCase()
            : '';
        return `${request.ip}:${email}`;
    }
    intercept(context, next) {
        const key = this.makeKey(context);
        const now = Date.now();
        const record = this.attempts.get(key);
        if (record && record.expiresAt > now) {
            if (record.count >= MAX_ATTEMPTS) {
                throw new common_1.HttpException('Too many login attempts. Please try again later.', common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
            record.count += 1;
            this.attempts.set(key, record);
        }
        else {
            this.attempts.set(key, { count: 1, expiresAt: now + WINDOW_MS });
        }
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                this.attempts.delete(key);
            },
            error: () => {
                const latest = this.attempts.get(key);
                if (latest && Date.now() > latest.expiresAt) {
                    this.attempts.delete(key);
                }
            },
        }));
    }
};
exports.LoginRateLimitInterceptor = LoginRateLimitInterceptor;
exports.LoginRateLimitInterceptor = LoginRateLimitInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoginRateLimitInterceptor);
//# sourceMappingURL=login-rate-limit.interceptor.js.map