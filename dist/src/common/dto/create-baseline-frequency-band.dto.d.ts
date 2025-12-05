import { BandName } from '@prisma/client';
export declare class CreateBaselineFrequencyBandDto {
    sessionId: string;
    bandName: BandName;
    freqStart?: number;
    freqEnd?: number;
    powerAvg?: number;
    powerSign?: number;
}
export declare class CreateBaselineFrequencyBandBatchDto {
    sessionId: string;
    bands: Array<{
        bandName: BandName;
        freqStart?: number;
        freqEnd?: number;
        powerAvg?: number;
        powerSign?: number;
    }>;
}
