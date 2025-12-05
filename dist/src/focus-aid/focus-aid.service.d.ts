import { PrismaService } from '../prisma/prisma.service';
import { CreateFocusAidSessionDto } from '../common/dto/create-focus-aid-session.dto';
import { CreateFocusAidAttentionScoreDto, CreateFocusAidAttentionScoreBatchDto } from '../common/dto/create-focus-aid-attention-score.dto';
import { CreateFocusAidVibrationDto, CreateFocusAidVibrationBatchDto } from '../common/dto/create-focus-aid-vibration.dto';
export declare class FocusAidService {
    private prisma;
    constructor(prisma: PrismaService);
    createSession(createDto: CreateFocusAidSessionDto): Promise<{
        sessionId: string;
        difficultyLevel: number | null;
        preSessionInfo: import("@prisma/client/runtime/library").JsonValue | null;
        postSessionFeedback: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findSession(sessionId: string): Promise<{
        session: {
            id: string;
            createdAt: Date;
            userId: string;
            sessionType: import(".prisma/client").$Enums.SessionType;
            endedAt: Date | null;
            durationSeconds: import("@prisma/client/runtime/library").Decimal | null;
        };
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
    }>;
    updateSession(sessionId: string, updateData: Partial<CreateFocusAidSessionDto>): Promise<{
        sessionId: string;
        difficultyLevel: number | null;
        preSessionInfo: import("@prisma/client/runtime/library").JsonValue | null;
        postSessionFeedback: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    createAttentionScore(createDto: CreateFocusAidAttentionScoreDto): Promise<{
        id: bigint;
        sessionId: string;
        timestamp: bigint;
        attentionScore: import("@prisma/client/runtime/library").Decimal;
        isFocused: boolean | null;
    }>;
    createAttentionScoreBatch(createBatchDto: CreateFocusAidAttentionScoreBatchDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getAttentionScores(sessionId: string, startTime?: bigint | number, endTime?: bigint | number): Promise<{
        id: bigint;
        sessionId: string;
        timestamp: bigint;
        attentionScore: import("@prisma/client/runtime/library").Decimal;
        isFocused: boolean | null;
    }[]>;
    createVibration(createDto: CreateFocusAidVibrationDto): Promise<{
        id: bigint;
        sessionId: string;
        timestamp: bigint;
    }>;
    createVibrationBatch(createBatchDto: CreateFocusAidVibrationBatchDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getVibrations(sessionId: string): Promise<{
        id: bigint;
        sessionId: string;
        timestamp: bigint;
    }[]>;
}
