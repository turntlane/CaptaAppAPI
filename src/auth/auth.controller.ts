import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../common/dto/register.dto';
import { LoginDto } from '../common/dto/login.dto';
import { RefreshDto } from '../common/dto/refresh.dto';
import { Metadata, RequestMetadata } from '../common/decorators/metadata.decorator';
import { LoginRateLimitInterceptor } from '../common/interceptors/login-rate-limit.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Metadata() metadata: RequestMetadata,
  ) {
    return this.authService.registerUser(registerDto, metadata);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(LoginRateLimitInterceptor)
  async login(@Body() loginDto: LoginDto, @Metadata() metadata: RequestMetadata) {
    return this.authService.loginUser(loginDto, metadata);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshDto: RefreshDto,
    @Metadata() metadata: RequestMetadata,
  ) {
    return this.authService.refreshSession(refreshDto.refreshToken, metadata);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() refreshDto: RefreshDto) {
    await this.authService.revokeSession(refreshDto.refreshToken);
  }
}







