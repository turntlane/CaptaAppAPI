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
exports.SignalDataService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SignalDataService = class SignalDataService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSignalDataDto, userId) {
        const session = await this.prisma.session.findUnique({
            where: { id: createSignalDataDto.sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${createSignalDataDto.sessionId} not found`);
        }
        if (userId && session.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this session');
        }
        return this.prisma.signalData.create({
            data: {
                sessionId: createSignalDataDto.sessionId,
                channel: createSignalDataDto.channel,
                timestamp: BigInt(createSignalDataDto.timestamp),
                signalValue: createSignalDataDto.signalValue,
            },
        });
    }
    async createBatch(createBatchDto, userId) {
        const session = await this.prisma.session.findUnique({
            where: { id: createBatchDto.sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${createBatchDto.sessionId} not found`);
        }
        if (userId && session.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this session');
        }
        const data = createBatchDto.data.map((item) => ({
            sessionId: createBatchDto.sessionId,
            channel: createBatchDto.channel,
            timestamp: BigInt(item.timestamp),
            signalValue: item.signalValue,
        }));
        return this.prisma.signalData.createMany({
            data,
        });
    }
    async findBySession(sessionId, channel, startTime, endTime, limit = 1000, userId) {
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${sessionId} not found`);
        }
        if (userId && session.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this session');
        }
        const where = {
            sessionId,
        };
        if (channel !== undefined) {
            where.channel = channel;
        }
        if (startTime !== undefined || endTime !== undefined) {
            where.timestamp = {};
            if (startTime !== undefined) {
                where.timestamp.gte = BigInt(startTime);
            }
            if (endTime !== undefined) {
                where.timestamp.lte = BigInt(endTime);
            }
        }
        return this.prisma.signalData.findMany({
            where,
            orderBy: { timestamp: 'asc' },
            take: limit,
        });
    }
    async removeBySession(sessionId, userId) {
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${sessionId} not found`);
        }
        if (userId && session.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this session');
        }
        return this.prisma.signalData.deleteMany({
            where: { sessionId },
        });
    }
};
exports.SignalDataService = SignalDataService;
exports.SignalDataService = SignalDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SignalDataService);
//# sourceMappingURL=signal-data.service.js.map