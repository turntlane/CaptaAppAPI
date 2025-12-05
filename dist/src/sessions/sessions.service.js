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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SessionsService = class SessionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, userId) {
        const sessionData = {
            sessionType: data.sessionType,
            createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
            endedAt: data.endedAt ? new Date(data.endedAt) : undefined,
            durationSeconds: data.durationSeconds,
            user: {
                connect: { id: userId },
            },
        };
        return this.prisma.session.create({
            data: sessionData,
            include: {
                focusAidSession: true,
                baselineSession: true,
                signalData: {
                    take: 10,
                    orderBy: { timestamp: "asc" },
                },
            },
        });
    }
    async findAll(sessionType, userId, userRole) {
        const where = {};
        if (userRole !== client_1.Role.ADMIN && userId) {
            where.userId = userId;
        }
        if (sessionType) {
            where.sessionType = sessionType;
        }
        return this.prisma.session.findMany({
            where,
            include: {
                focusAidSession: true,
                baselineSession: true,
                _count: {
                    select: {
                        signalData: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async findOne(id, userId, userRole) {
        const session = await this.prisma.session.findUnique({
            where: { id },
            include: {
                focusAidSession: {
                    include: {
                        attentionScores: {
                            take: 100,
                            orderBy: { timestamp: "asc" },
                        },
                        vibrations: {
                            take: 50,
                            orderBy: { timestamp: "asc" },
                        },
                    },
                },
                baselineSession: {
                    include: {
                        frequencyBands: true,
                    },
                },
                signalData: {
                    take: 1000,
                    orderBy: { timestamp: "asc" },
                },
            },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Session with ID ${id} not found`);
        }
        if (userRole !== client_1.Role.ADMIN && session.userId !== userId) {
            throw new common_1.ForbiddenException("You do not have permission to access this session");
        }
        return session;
    }
    async update(id, data, userId, userRole) {
        const session = await this.findOne(id, userId, userRole);
        const updateData = {};
        if (data.sessionType !== undefined) {
            updateData.sessionType = data.sessionType;
        }
        if (data.createdAt !== undefined) {
            updateData.createdAt = new Date(data.createdAt);
        }
        if (data.endedAt !== undefined) {
            updateData.endedAt = data.endedAt ? new Date(data.endedAt) : null;
        }
        if (data.durationSeconds !== undefined) {
            updateData.durationSeconds = data.durationSeconds;
        }
        try {
            return await this.prisma.session.update({
                where: { id },
                data: updateData,
            });
        }
        catch (error) {
            if (error.code === "P2025") {
                throw new common_1.NotFoundException(`Session with ID ${id} not found`);
            }
            throw error;
        }
    }
    async remove(id, userId, userRole) {
        await this.findOne(id, userId, userRole);
        try {
            await this.prisma.session.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error.code === "P2025") {
                throw new common_1.NotFoundException(`Session with ID ${id} not found`);
            }
            throw error;
        }
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map