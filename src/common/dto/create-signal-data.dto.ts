import {
  IsUUID,
  IsInt,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';

export class CreateSignalDataDto {
  @IsUUID()
  sessionId: string;

  @IsInt()
  @Min(1)
  @Max(2)
  channel: number;

  @IsNumber()
  @IsNotEmpty()
  timestamp: bigint | number;

  @IsNumber()
  signalValue: number;
}

export class CreateSignalDataBatchDto {
  @IsUUID()
  sessionId: string;

  @IsInt()
  @Min(1)
  @Max(2)
  channel: number;

  data: Array<{
    timestamp: bigint | number;
    signalValue: number;
  }>;
}






