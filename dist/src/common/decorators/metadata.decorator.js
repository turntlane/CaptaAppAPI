"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = void 0;
const common_1 = require("@nestjs/common");
exports.Metadata = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return {
        ip: request.ip,
        userAgent: request.headers['user-agent'] ?? undefined,
    };
});
//# sourceMappingURL=metadata.decorator.js.map