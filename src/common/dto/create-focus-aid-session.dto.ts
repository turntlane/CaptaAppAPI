import {
  IsUUID,
  IsInt,
  IsOptional,
  Min,
  Max,
  IsObject,
} from 'class-validator';

export class CreateFocusAidSessionDto {
  @IsUUID()
  sessionId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  difficultyLevel?: number;

  @IsOptional()
  @IsObject()
  preSessionInfo?: Record<string, any>;

  @IsOptional()
  @IsObject()
  postSessionFeedback?: Record<string, any>;
}






