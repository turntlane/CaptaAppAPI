import {
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { SessionType } from '@prisma/client';

export class CreateSessionDto {
  @IsEnum(SessionType)
  sessionType: SessionType;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  @IsDateString()
  endedAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  durationSeconds?: number;
  
  // userId is set from the authenticated user, not from DTO
}


