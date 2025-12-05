import {
  IsUUID,
  IsOptional,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateBaselineSessionDto {
  @IsUUID()
  sessionId: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  focusedStartTime?: bigint | number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  focusedEndTime?: bigint | number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  relaxedStartTime?: bigint | number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  relaxedEndTime?: bigint | number;
}






