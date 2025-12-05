import { BaselineService } from "./baseline.service";
import { CreateBaselineSessionDto } from "../common/dto/create-baseline-session.dto";
import { CreateBaselineFrequencyBandDto, CreateBaselineFrequencyBandBatchDto } from "../common/dto/create-baseline-frequency-band.dto";
export declare class BaselineController {
    private readonly baselineService;
    constructor(baselineService: BaselineService);
    createSession(createDto: CreateBaselineSessionDto): Promise<{
        sessionId: string;
        focusedStartTime: bigint | null;
        focusedEndTime: bigint | null;
        relaxedStartTime: bigint | null;
        relaxedEndTime: bigint | null;
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
    }>;
    updateSession(sessionId: string, updateDto: Partial<CreateBaselineSessionDto>): Promise<{
        sessionId: string;
        focusedStartTime: bigint | null;
        focusedEndTime: bigint | null;
        relaxedStartTime: bigint | null;
        relaxedEndTime: bigint | null;
    }>;
    createFrequencyBand(createDto: CreateBaselineFrequencyBandDto): Promise<{
        id: bigint;
        sessionId: string;
        bandName: import(".prisma/client").$Enums.BandName;
        freqStart: import("@prisma/client/runtime/library").Decimal | null;
        freqEnd: import("@prisma/client/runtime/library").Decimal | null;
        powerAvg: import("@prisma/client/runtime/library").Decimal | null;
        powerSign: number | null;
    }>;
    createFrequencyBandBatch(createBatchDto: CreateBaselineFrequencyBandBatchDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getFrequencyBands(sessionId: string): Promise<{
        id: bigint;
        sessionId: string;
        bandName: import(".prisma/client").$Enums.BandName;
        freqStart: import("@prisma/client/runtime/library").Decimal | null;
        freqEnd: import("@prisma/client/runtime/library").Decimal | null;
        powerAvg: import("@prisma/client/runtime/library").Decimal | null;
        powerSign: number | null;
    }[]>;
}
