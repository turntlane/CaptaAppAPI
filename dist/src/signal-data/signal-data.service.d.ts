import { PrismaService } from '../prisma/prisma.service';
import { CreateSignalDataDto, CreateSignalDataBatchDto } from '../common/dto/create-signal-data.dto';
export declare class SignalDataService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createSignalDataDto: CreateSignalDataDto, userId?: string): Promise<{
        id: bigint;
        sessionId: string;
        channel: number;
        timestamp: bigint;
        signalValue: import("@prisma/client/runtime/library").Decimal;
    }>;
    createBatch(createBatchDto: CreateSignalDataBatchDto, userId?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    findBySession(sessionId: string, channel?: number, startTime?: bigint | number, endTime?: bigint | number, limit?: number, userId?: string): Promise<{
        id: bigint;
        sessionId: string;
        channel: number;
        timestamp: bigint;
        signalValue: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    removeBySession(sessionId: string, userId?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
