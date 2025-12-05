import {
  IsUUID,
  IsEnum,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { BandName } from '@prisma/client';

export class CreateBaselineFrequencyBandDto {
  @IsUUID()
  sessionId: string;

  @IsEnum(BandName)
  bandName: BandName;

  @IsOptional()
  @IsNumber()
  freqStart?: number;

  @IsOptional()
  @IsNumber()
  freqEnd?: number;

  @IsOptional()
  @IsNumber()
  powerAvg?: number;

  @IsOptional()
  @IsInt()
  @Min(-1)
  @Max(1)
  powerSign?: number;
}

export class CreateBaselineFrequencyBandBatchDto {
  @IsUUID()
  sessionId: string;

  bands: Array<{
    bandName: BandName;
    freqStart?: number;
    freqEnd?: number;
    powerAvg?: number;
    powerSign?: number;
  }>;
}

