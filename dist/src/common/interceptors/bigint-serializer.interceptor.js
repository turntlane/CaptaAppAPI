"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigIntSerializerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let BigIntSerializerInterceptor = class BigIntSerializerInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => this.transformBigInt(data)));
    }
    transformBigInt(obj) {
        if (obj === null || obj === undefined) {
            return obj;
        }
        if (typeof obj === 'bigint') {
            return obj.toString();
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => this.transformBigInt(item));
        }
        if (typeof obj === 'object') {
            const transformed = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    transformed[key] = this.transformBigInt(obj[key]);
                }
            }
            return transformed;
        }
        return obj;
    }
};
exports.BigIntSerializerInterceptor = BigIntSerializerInterceptor;
exports.BigIntSerializerInterceptor = BigIntSerializerInterceptor = __decorate([
    (0, common_1.Injectable)()
], BigIntSerializerInterceptor);
//# sourceMappingURL=bigint-serializer.interceptor.js.map