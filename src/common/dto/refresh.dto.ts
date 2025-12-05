import { IsString, MinLength, MaxLength } from 'class-validator';

export class RefreshDto {
  @IsString()
  @MinLength(1, { message: 'refreshToken is required' })
  @MaxLength(512, { message: 'refreshToken is too long' })
  refreshToken: string;
}







