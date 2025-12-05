import { SessionsService } from "./sessions.service";
import { CreateSessionDto } from "../common/dto/create-session.dto";
import { UserPayload } from "../common/decorators/user.decorator";
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    create(createSessionDto: CreateSessionDto, user: UserPayload): Promise<{
        signalData: {
            id: bigint;
            sessionId: string;
            channel: number;
            timestamp: bigint;
            signalValue: import("@prisma/client/runtime/library").Decimal;
        }[];
        focusAidSession: {
            sessionId: string;
            difficultyLevel: number | null;
            preSessionInfo: import("@prisma/client/runtime/library").JsonValue | null;
            postSessionFeedback: import("@prisma/client/runtime/library").JsonValue | null;
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
        durationSeconds: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    findAll(user: UserPayload, sessionType?: string): Promise<({
        _count: {
            signalData: number;
        };
        focusAidSession: {
            sessionId: string;
            difficultyLevel: number | null;
            preSessionInfo: import("@prisma/client/runtime/library").JsonValue | null;
            postSessionFeedback: import("@prisma/client/runtime/library").JsonValue | null;
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
        durationSeconds: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    findOne(id: string, user: UserPayload): Promise<{
        signalData: {
            id: bigint;
            sessionId: string;
            channel: number;
            timestamp: bigint;
            signalValue: import("@prisma/client/runtime/library").Decimal;
        }[];
        focusAidSession: {
            attentionScores: {
                id: bigint;
                sessionId: string;
                timestamp: bigint;
                attentionScore: import("@prisma/client/runtime/library").Decimal;
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
            preSessionInfo: import("@prisma/client/runtime/library").JsonValue | null;
            postSessionFeedback: import("@prisma/client/runtime/library").JsonValue | null;
        };
        baselineSession: {
            frequencyBands: {
                id: bigint;
                sessionId: string;
                bandName: import(".prisma/client").$Enums.BandName;
                freqStart: import("@prisma/client/runtime/library").Decimal | null;
                freqEnd: import("@prisma/client/runtime/library").Decimal | null;
                powerAvg: import("@prisma/client/runtime/library").Decimal | null;
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
        durationSeconds: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    update(id: string, updateSessionDto: Partial<CreateSessionDto>, user: UserPayload): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        sessionType: import(".prisma/client").$Enums.SessionType;
        endedAt: Date | null;
        durationSeconds: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    remove(id: string, user: UserPayload): Promise<void>;
}
