import { PrismaService } from "../prisma/prisma.service";
import { CreateSessionDto } from "../common/dto/create-session.dto";
import { Prisma, Role } from "@prisma/client";
export declare class SessionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateSessionDto, userId: string): Promise<{
        signalData: {
            id: bigint;
            sessionId: string;
            channel: number;
            timestamp: bigint;
            signalValue: Prisma.Decimal;
        }[];
        focusAidSession: {
            sessionId: string;
            difficultyLevel: number | null;
            preSessionInfo: Prisma.JsonValue | null;
            postSessionFeedback: Prisma.JsonValue | null;
        };
        baselineSession: {
            sessionId: string;
            focusedStartTime: bigint | null;
            focusedEndTime: bigint | null;
            relaxedStartTime: bigint | null;
            relaxedEndTime: bigint | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        sessionType: import(".prisma/client").$Enums.SessionType;
        endedAt: Date | null;
        durationSeconds: Prisma.Decimal | null;
    }>;
    findAll(sessionType?: string, userId?: string, userRole?: Role): Promise<({
        _count: {
            signalData: number;
        };
        focusAidSession: {
            sessionId: string;
            difficultyLevel: number | null;
            preSessionInfo: Prisma.JsonValue | null;
            postSessionFeedback: Prisma.JsonValue | null;
        };
        baselineSession: {
            sessionId: string;
            focusedStartTime: bigint | null;
            focusedEndTime: bigint | null;
            relaxedStartTime: bigint | null;
            relaxedEndTime: bigint | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        sessionType: import(".prisma/client").$Enums.SessionType;
        endedAt: Date | null;
        durationSeconds: Prisma.Decimal | null;
    })[]>;
    findOne(id: string, userId?: string, userRole?: Role): Promise<{
        signalData: {
            id: bigint;
            sessionId: string;
            channel: number;
            timestamp: bigint;
            signalValue: Prisma.Decimal;
        }[];
        focusAidSession: {
            attentionScores: {
                id: bigint;
                sessionId: string;
                timestamp: bigint;
                attentionScore: Prisma.Decimal;
                isFocused: boolean | null;
            }[];
            vibrations: {
                id: bigint;
                sessionId: string;
                timestamp: bigint;
            }[];
        } & {
            sessionId: string;
            difficultyLevel: number | null;
            preSessionInfo: Prisma.JsonValue | null;
            postSessionFeedback: Prisma.JsonValue | null;
        };
        baselineSession: {
            frequencyBands: {
                id: bigint;
                sessionId: string;
                bandName: import(".prisma/client").$Enums.BandName;
                freqStart: Prisma.Decimal | null;
                freqEnd: Prisma.Decimal | null;
                powerAvg: Prisma.Decimal | null;
                powerSign: number | null;
            }[];
        } & {
            sessionId: string;
            focusedStartTime: bigint | null;
            focusedEndTime: bigint | null;
            relaxedStartTime: bigint | null;
            relaxedEndTime: bigint | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        sessionType: import(".prisma/client").$Enums.SessionType;
        endedAt: Date | null;
        durationSeconds: Prisma.Decimal | null;
    }>;
    update(id: string, data: Partial<CreateSessionDto>, userId?: string, userRole?: Role): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        sessionType: import(".prisma/client").$Enums.SessionType;
        endedAt: Date | null;
        durationSeconds: Prisma.Decimal | null;
    }>;
    remove(id: string, userId?: string, userRole?: Role): Promise<void>;
}
