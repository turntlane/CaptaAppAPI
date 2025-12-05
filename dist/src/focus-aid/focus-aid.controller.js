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
exports.FocusAidController = void 0;
const common_1 = require("@nestjs/common");
const focus_aid_service_1 = require("./focus-aid.service");
const create_focus_aid_session_dto_1 = require("../common/dto/create-focus-aid-session.dto");
const create_focus_aid_attention_score_dto_1 = require("../common/dto/create-focus-aid-attention-score.dto");
const create_focus_aid_vibration_dto_1 = require("../common/dto/create-focus-aid-vibration.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let FocusAidController = class FocusAidController {
    constructor(focusAidService) {
        this.focusAidService = focusAidService;
    }
    async createSession(createDto) {
        return this.focusAidService.createSession(createDto);
    }
    async findSession(sessionId) {
        return this.focusAidService.findSession(sessionId);
    }
    async updateSession(sessionId, updateDto) {
        return this.focusAidService.updateSession(sessionId, updateDto);
    }
    async createAttentionScore(createDto) {
        return this.focusAidService.createAttentionScore(createDto);
    }
    async createAttentionScoreBatch(createBatchDto) {
        return this.focusAidService.createAttentionScoreBatch(createBatchDto);
    }
    async getAttentionScores(sessionId, startTime, endTime) {
        return this.focusAidService.getAttentionScores(sessionId, startTime ? BigInt(startTime) : undefined, endTime ? BigInt(endTime) : undefined);
    }
    async createVibration(createDto) {
        return this.focusAidService.createVibration(createDto);
    }
    async createVibrationBatch(createBatchDto) {
        return this.focusAidService.createVibrationBatch(createBatchDto);
    }
    async getVibrations(sessionId) {
        return this.focusAidService.getVibrations(sessionId);
    }
};
exports.FocusAidController = FocusAidController;
__decorate([
    (0, common_1.Post)('sessions'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_focus_aid_session_dto_1.CreateFocusAidSessionDto]),
    __metadata("design:returntype", Promise)
], FocusAidController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)('sessions/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FocusAidController.prototype, "findSession", null);
__decorate([
    (0, common_1.Patch)('sessions/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FocusAidController.prototype, "updateSession", null);
__decorate([
    (0, common_1.Post)('attention-scores'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_focus_aid_attention_score_dto_1.CreateFocusAidAttentionScoreDto]),
    __metadata("design:returntype", Promise)
], FocusAidController.prototype, "createAttentionScore", null);
__decorate([
    (0, common_1.Post)('attention-scores/batch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_focus_aid_attention_score_dto_1.CreateFocusAidAttentionScoreBatchDto]),
    __metadata("design:returntype", Promise)
], FocusAidController.prototype, "createAttentionScoreBatch", null);
__decorate([
    (0, common_1.Get)('attention-scores/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Query)('startTime')),
    __param(2, (0, common_1.Query)('endTime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FocusAidController.prototype, "getAttentionScores", null);
__decorate([
    (0, common_1.Post)('vibrations'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_focus_aid_vibration_dto_1.CreateFocusAidVibrationDto]),
    __metadata("design:returntype", Promise)
], FocusAidController.prototype, "createVibration", null);
__decorate([
    (0, common_1.Post)('vibrations/batch'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_focus_aid_vibration_dto_1.CreateFocusAidVibrationBatchDto]),
    __metadata("design:returntype", Promise)
], FocusAidController.prototype, "createVibrationBatch", null);
__decorate([
    (0, common_1.Get)('vibrations/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FocusAidController.prototype, "getVibrations", null);
exports.FocusAidController = FocusAidController = __decorate([
    (0, common_1.Controller)('focus-aid'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [focus_aid_service_1.FocusAidService])
], FocusAidController);
//# sourceMappingURL=focus-aid.controller.js.map