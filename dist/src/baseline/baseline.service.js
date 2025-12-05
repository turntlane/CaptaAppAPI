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
exports.BaselineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BaselineService = class BaselineService {
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
        if (session.sessionType !== "baseline") {
            throw new common_1.NotFoundException(`Session ${createDto.sessionId} is not a baseline session`);
        }
        return this.prisma.baselineSession.create({
            data: {
                sessionId: createDto.sessionId,
                focusedStartTime: createDto.focusedStartTime
                    ? BigInt(createDto.focusedStartTime)
                    : undefined,
                focusedEndTime: createDto.focusedEndTime
                    ? BigInt(createDto.focusedEndTime)
                    : undefined,
                relaxedStartTime: createDto.relaxedStartTime
                    ? BigInt(createDto.relaxedStartTime)
                    : undefined,
                relaxedEndTime: createDto.relaxedEndTime
                    ? BigInt(createDto.relaxedEndTime)
                    : undefined,
            },
        });
    }
    async findSession(sessionId) {
        const session = await this.prisma.baselineSession.findUnique({
            where: { sessionId },
            include: {
                session: true,
                frequencyBands: {
                    orderBy: { bandName: "asc" },
                },
            },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Baseline session with ID ${sessionId} not found`);
        }
        return session;
    }
    async updateSession(sessionId, updateData) {
        try {
            const updatePayload = {};
            if (updateData.focusedStartTime !== undefined) {
                updatePayload.focusedStartTime = updateData.focusedStartTime
                    ? BigInt(updateData.focusedStartTime)
                    : null;
            }
            if (updateData.focusedEndTime !== undefined) {
                updatePayload.focusedEndTime = updateData.focusedEndTime
                    ? BigInt(updateData.focusedEndTime)
                    : null;
            }
            if (updateData.relaxedStartTime !== undefined) {
                updatePayload.relaxedStartTime = updateData.relaxedStartTime
                    ? BigInt(updateData.relaxedStartTime)
                    : null;
            }
            if (updateData.relaxedEndTime !== undefined) {
                updatePayload.relaxedEndTime = updateData.relaxedEndTime
                    ? BigInt(updateData.relaxedEndTime)
                    : null;
            }
            return await this.prisma.baselineSession.update({
                where: { sessionId },
                data: updatePayload,
            });
        }
        catch (error) {
            if (error.code === "P2025") {
                throw new common_1.NotFoundException(`Baseline session with ID ${sessionId} not found`);
            }
            throw error;
        }
    }
    async createFrequencyBand(createDto) {
        const session = await this.prisma.baselineSession.findUnique({
            where: { sessionId: createDto.sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Baseline session with ID ${createDto.sessionId} not found`);
        }
        return this.prisma.baselineFrequencyBand.create({
            data: {
                sessionId: createDto.sessionId,
                bandName: createDto.bandName,
                freqStart: createDto.freqStart,
                freqEnd: createDto.freqEnd,
                powerAvg: createDto.powerAvg,
                powerSign: createDto.powerSign,
            },
        });
    }
    async createFrequencyBandBatch(createBatchDto) {
        const session = await this.prisma.baselineSession.findUnique({
            where: { sessionId: createBatchDto.sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Baseline session with ID ${createBatchDto.sessionId} not found`);
        }
        const data = createBatchDto.bands.map((band) => ({
            sessionId: createBatchDto.sessionId,
            bandName: band.bandName,
            freqStart: band.freqStart,
            freqEnd: band.freqEnd,
            powerAvg: band.powerAvg,
            powerSign: band.powerSign,
        }));
        return this.prisma.baselineFrequencyBand.createMany({
            data,
        });
    }
    async getFrequencyBands(sessionId) {
        return this.prisma.baselineFrequencyBand.findMany({
            where: { sessionId },
            orderBy: { bandName: "asc" },
        });
    }
};
exports.BaselineService = BaselineService;
exports.BaselineService = BaselineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BaselineService);
//# sourceMappingURL=baseline.service.js.map