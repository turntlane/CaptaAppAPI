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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusAidService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FocusAidService = class FocusAidService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSession(createDto) {
        const session = await this.prisma.session.findUnique({
            where: { id: createDto.sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${createDto.sessionId} not found`);
        }
        if (session.sessionType !== 'focus_aid') {
            throw new common_1.NotFoundException(`Session ${createDto.sessionId} is not a focus aid session`);
        }
        return this.prisma.focusAidSession.create({
            data: {
                sessionId: createDto.sessionId,
                difficultyLevel: createDto.difficultyLevel,
                preSessionInfo: createDto.preSessionInfo,
                postSessionFeedback: createDto.postSessionFeedback,
            },
        });
    }
    async findSession(sessionId) {
        const session = await this.prisma.focusAidSession.findUnique({
            where: { sessionId },
            include: {
                session: true,
                attentionScores: {
                    orderBy: { timestamp: 'asc' },
                },
                vibrations: {
                    orderBy: { timestamp: 'asc' },
                },
            },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Focus aid session with ID ${sessionId} not found`);
        }
        return session;
    }
    async updateSession(sessionId, updateData) {
        try {
            return await this.prisma.focusAidSession.update({
                where: { sessionId },
                data: {
                    difficultyLevel: updateData.difficultyLevel,
                    preSessionInfo: updateData.preSessionInfo,
                    postSessionFeedback: updateData.postSessionFeedback,
                },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException(`Focus aid session with ID ${sessionId} not found`);
            }
            throw error;
        }
    }
    async createAttentionScore(createDto) {
        const session = await this.prisma.focusAidSession.findUnique({
            where: { sessionId: createDto.sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Focus aid session with ID ${createDto.sessionId} not found`);
        }
        return this.prisma.focusAidAttentionScore.create({
            data: {
                sessionId: createDto.sessionId,
                timestamp: BigInt(createDto.timestamp),
                attentionScore: createDto.attentionScore,
                isFocused: createDto.isFocused,
            },
        });
    }
    async createAttentionScoreBatch(createBatchDto) {
        const session = await this.prisma.focusAidSession.findUnique({
            where: { sessionId: createBatchDto.sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Focus aid session with ID ${createBatchDto.sessionId} not found`);
        }
        const data = createBatchDto.scores.map((score) => ({
            sessionId: createBatchDto.sessionId,
            timestamp: BigInt(score.timestamp),
            attentionScore: score.attentionScore,
            isFocused: score.isFocused,
        }));
        return this.prisma.focusAidAttentionScore.createMany({
            data,
        });
    }
    async getAttentionScores(sessionId, startTime, endTime) {
        const where = { sessionId };
        if (startTime !== undefined || endTime !== undefined) {
            where.timestamp = {};
            if (startTime !== undefined) {
                where.timestamp.gte = BigInt(startTime);
            }
            if (endTime !== undefined) {
                where.timestamp.lte = BigInt(endTime);
            }
        }
        return this.prisma.focusAidAttentionScore.findMany({
            where,
            orderBy: { timestamp: 'asc' },
        });
    }
    async createVibration(createDto) {
        const session = await this.prisma.focusAidSession.findUnique({
            where: { sessionId: createDto.sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Focus aid session with ID ${createDto.sessionId} not found`);
        }
        return this.prisma.focusAidVibration.create({
            data: {
                sessionId: createDto.sessionId,
                timestamp: BigInt(createDto.timestamp),
            },
        });
    }
    async createVibrationBatch(createBatchDto) {
        const session = await this.prisma.focusAidSession.findUnique({
            where: { sessionId: createBatchDto.sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Focus aid session with ID ${createBatchDto.sessionId} not found`);
        }
        const data = createBatchDto.timestamps.map((timestamp) => ({
            sessionId: createBatchDto.sessionId,
            timestamp: BigInt(timestamp),
        }));
        return this.prisma.focusAidVibration.createMany({
            data,
        });
    }
    async getVibrations(sessionId) {
        return this.prisma.focusAidVibration.findMany({
            where: { sessionId },
            orderBy: { timestamp: 'asc' },
        });
    }
};
exports.FocusAidService = FocusAidService;
exports.FocusAidService = FocusAidService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FocusAidService);
//# sourceMappingURL=focus-aid.service.js.map