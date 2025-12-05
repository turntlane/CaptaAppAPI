"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfOrAdminGuard = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let SelfOrAdminGuard = class SelfOrAdminGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('Authentication required');
        }
        const { id } = request.params;
        if (!id) {
            throw new common_1.BadRequestException('User id parameter is required');
        }
        if (id !== user.id && user.role !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Forbidden');
        }
        return true;
    }
};
exports.SelfOrAdminGuard = SelfOrAdminGuard;
exports.SelfOrAdminGuard = SelfOrAdminGuard = __decorate([
    (0, common_1.Injectable)()
], SelfOrAdminGuard);
//# sourceMappingURL=self-or-admin.guard.js.map