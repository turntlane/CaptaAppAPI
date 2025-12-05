export declare class CreateFocusAidAttentionScoreDto {
    sessionId: string;
    timestamp: bigint | number;
    attentionScore: number;
    isFocused?: boolean | null;
}
export declare class CreateFocusAidAttentionScoreBatchDto {
    sessionId: string;
    scores: Array<{
        timestamp: bigint | number;
        attentionScore: number;
        isFocused?: boolean | null;
    }>;
}
