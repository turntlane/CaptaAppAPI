import { IsUUID, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateFocusAidVibrationDto {
  @IsUUID()
  sessionId: string;

  @IsNumber()
  @IsNotEmpty()
  timestamp: bigint | number;
}

export class CreateFocusAidVibrationBatchDto {
  @IsUUID()
  sessionId: string;

  timestamps: Array<bigint | number>;
}






