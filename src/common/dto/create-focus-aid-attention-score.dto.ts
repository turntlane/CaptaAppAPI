import {
  IsUUID,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateFocusAidAttentionScoreDto {
  @IsUUID()
  sessionId: string;

  @IsNumber()
  @IsNotEmpty()
  timestamp: bigint | number;

  @IsNumber()
  @Min(0)
  @Max(1)
  attentionScore: number;

  @IsOptional()
  @IsBoolean()
  isFocused?: boolean | null;
}

export class CreateFocusAidAttentionScoreBatchDto {
  @IsUUID()
  sessionId: string;

  scores: Array<{
    timestamp: bigint | number;
    attentionScore: number;
    isFocused?: boolean | null;
  }>;
}






