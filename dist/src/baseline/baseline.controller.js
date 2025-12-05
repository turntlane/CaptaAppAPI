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
exports.BaselineController = void 0;
const common_1 = require("@nestjs/common");
const baseline_service_1 = require("./baseline.service");
const create_baseline_session_dto_1 = require("../common/dto/create-baseline-session.dto");
const create_baseline_frequency_band_dto_1 = require("../common/dto/create-baseline-frequency-band.dto");
let BaselineController = class BaselineController {
    constructor(baselineService) {
        this.baselineService = baselineService;
    }
    async createSession(createDto) {
        return this.baselineService.createSession(createDto);
    }
    async findSession(sessionId) {
        return this.baselineService.findSession(sessionId);
    }
    async updateSession(sessionId, updateDto) {
        return this.baselineService.updateSession(sessionId, updateDto);
    }
    async createFrequencyBand(createDto) {
        return this.baselineService.createFrequencyBand(createDto);
    }
    async createFrequencyBandBatch(createBatchDto) {
        return this.baselineService.createFrequencyBandBatch(createBatchDto);
    }
    async getFrequencyBands(sessionId) {
        return this.baselineService.getFrequencyBands(sessionId);
    }
};
exports.BaselineController = BaselineController;
__decorate([
    (0, common_1.Post)("sessions"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_baseline_session_dto_1.CreateBaselineSessionDto]),
    __metadata("design:returntype", Promise)
], BaselineController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)("sessions/:sessionId"),
    __param(0, (0, common_1.Param)("sessionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BaselineController.prototype, "findSession", null);
__decorate([
    (0, common_1.Patch)("sessions/:sessionId"),
    __param(0, (0, common_1.Param)("sessionId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BaselineController.prototype, "updateSession", null);
__decorate([
    (0, common_1.Post)("frequency-bands"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_baseline_frequency_band_dto_1.CreateBaselineFrequencyBandDto]),
    __metadata("design:returntype", Promise)
], BaselineController.prototype, "createFrequencyBand", null);
__decorate([
    (0, common_1.Post)("frequency-bands/batch"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_baseline_frequency_band_dto_1.CreateBaselineFrequencyBandBatchDto]),
    __metadata("design:returntype", Promise)
], BaselineController.prototype, "createFrequencyBandBatch", null);
__decorate([
    (0, common_1.Get)("frequency-bands/:sessionId"),
    __param(0, (0, common_1.Param)("sessionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BaselineController.prototype, "getFrequencyBands", null);
exports.BaselineController = BaselineController = __decorate([
    (0, common_1.Controller)("baseline"),
    __metadata("design:paramtypes", [baseline_service_1.BaselineService])
], BaselineController);
//# sourceMappingURL=baseline.controller.js.map