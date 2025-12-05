import { SignalDataService } from './signal-data.service';
import { CreateSignalDataDto, CreateSignalDataBatchDto } from '../common/dto/create-signal-data.dto';
import { UserPayload } from '../common/decorators/user.decorator';
export declare class SignalDataController {
    private readonly signalDataService;
    constructor(signalDataService: SignalDataService);
    create(createSignalDataDto: CreateSignalDataDto, user: UserPayload): Promise<{
        id: bigint;
        sessionId: string;
        channel: number;
        timestamp: bigint;
        signalValue: import("@prisma/client/runtime/library").Decimal;
    }>;
    createBatch(createBatchDto: CreateSignalDataBatchDto, user: UserPayload): Promise<import(".prisma/client").Prisma.BatchPayload>;
    findBySession(sessionId: string, channel?: number, startTime?: string, endTime?: string, limit?: number, user?: UserPayload): Promise<{
        id: bigint;
        sessionId: string;
        channel: number;
        timestamp: bigint;
        signalValue: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    removeBySession(sessionId: string, user: UserPayload): Promise<void>;
}
