export declare class CreateSignalDataDto {
    sessionId: string;
    channel: number;
    timestamp: bigint | number;
    signalValue: number;
}
export declare class CreateSignalDataBatchDto {
    sessionId: string;
    channel: number;
    data: Array<{
        timestamp: bigint | number;
        signalValue: number;
    }>;
}
