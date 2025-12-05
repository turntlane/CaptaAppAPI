import {
  IsEmail,
  IsString,
  MinLength,
  IsNumber,
  IsInt,
  Min,
  IsOptional,
  IsUrl,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  password: string;

  @IsString()
  @MinLength(1, { message: 'First name is required' })
  firstName: string;

  @IsString()
  @MinLength(1, { message: 'Last name is required' })
  lastName: string;

  @IsNumber()
  @IsInt()
  @Min(1, { message: 'Age must be a positive integer' })
  age: number;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid avatar URL' })
  avatarUrl?: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  friendsCount?: number;
}
