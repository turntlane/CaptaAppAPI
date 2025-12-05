"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalDataController = void 0;
const common_1 = require("@nestjs/common");
const signal_data_service_1 = require("./signal-data.service");
const create_signal_data_dto_1 = require("../common/dto/create-signal-data.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const user_decorator_1 = require("../common/decorators/user.decorator");
let SignalDataController = class SignalDataController {
    constructor(signalDataService) {
        this.signalDataService = signalDataService;
    }
    async create(createSignalDataDto, user) {
        return this.signalDataService.create(createSignalDataDto, user.id);
    }
    async createBatch(createBatchDto, user) {
        return this.signalDataService.createBatch(createBatchDto, user.id);
    }
    async findBySession(sessionId, channel, startTime, endTime, limit, user) {
        return this.signalDataService.findBySession(sessionId, channel, startTime ? BigInt(startTime) : undefined, endTime ? BigInt(endTime) : undefined, limit, user?.id);
    }
    async removeBySession(sessionId, user) {
        await this.signalDataService.removeBySession(sessionId, user.id);
    }
};
exports.SignalDataController = SignalDataController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_signal_data_dto_1.CreateSignalDataDto, Object]),
    __metadata("design:returntype", Promise)
], SignalDataController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('batch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_signal_data_dto_1.CreateSignalDataBatchDto, Object]),
    __metadata("design:returntype", Promise)
], SignalDataController.prototype, "createBatch", null);
__decorate([
    (0, common_1.Get)('session/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Query)('channel')),
    __param(2, (0, common_1.Query)('startTime')),
    __param(3, (0, common_1.Query)('endTime')),
    __param(4, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(5, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, String, Number, Object]),
    __metadata("design:returntype", Promise)
], SignalDataController.prototype, "findBySession", null);
__decorate([
    (0, common_1.Delete)('session/:sessionId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SignalDataController.prototype, "removeBySession", null);
exports.SignalDataController = SignalDataController = __decorate([
    (0, common_1.Controller)('signal-data'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [signal_data_service_1.SignalDataService])
], SignalDataController);
//# sourceMappingURL=signal-data.controller.js.map