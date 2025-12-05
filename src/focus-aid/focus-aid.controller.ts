import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FocusAidService } from './focus-aid.service';
import { CreateFocusAidSessionDto } from '../common/dto/create-focus-aid-session.dto';
import {
  CreateFocusAidAttentionScoreDto,
  CreateFocusAidAttentionScoreBatchDto,
} from '../common/dto/create-focus-aid-attention-score.dto';
import {
  CreateFocusAidVibrationDto,
  CreateFocusAidVibrationBatchDto,
} from '../common/dto/create-focus-aid-vibration.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('focus-aid')
@UseGuards(JwtAuthGuard)
export class FocusAidController {
  constructor(private readonly focusAidService: FocusAidService) {}

  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  async createSession(@Body() createDto: CreateFocusAidSessionDto) {
    return this.focusAidService.createSession(createDto);
  }

  @Get('sessions/:sessionId')
  async findSession(@Param('sessionId') sessionId: string) {
    return this.focusAidService.findSession(sessionId);
  }

  @Patch('sessions/:sessionId')
  async updateSession(
    @Param('sessionId') sessionId: string,
    @Body() updateDto: Partial<CreateFocusAidSessionDto>,
  ) {
    return this.focusAidService.updateSession(sessionId, updateDto);
  }

  @Post('attention-scores')
  @HttpCode(HttpStatus.CREATED)
  async createAttentionScore(
    @Body() createDto: CreateFocusAidAttentionScoreDto,
  ) {
    return this.focusAidService.createAttentionScore(createDto);
  }

  @Post('attention-scores/batch')
  @HttpCode(HttpStatus.CREATED)
  async createAttentionScoreBatch(
    @Body() createBatchDto: CreateFocusAidAttentionScoreBatchDto,
  ) {
    return this.focusAidService.createAttentionScoreBatch(createBatchDto);
  }

  @Get('attention-scores/:sessionId')
  async getAttentionScores(
    @Param('sessionId') sessionId: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
  ) {
    return this.focusAidService.getAttentionScores(
      sessionId,
      startTime ? BigInt(startTime) : undefined,
      endTime ? BigInt(endTime) : undefined,
    );
  }

  @Post('vibrations')
  @HttpCode(HttpStatus.CREATED)
  async createVibration(@Body() createDto: CreateFocusAidVibrationDto) {
    return this.focusAidService.createVibration(createDto);
  }

  @Post('vibrations/batch')
  @HttpCode(HttpStatus.CREATED)
  async createVibrationBatch(
    @Body() createBatchDto: CreateFocusAidVibrationBatchDto,
  ) {
    return this.focusAidService.createVibrationBatch(createBatchDto);
  }

  @Get('vibrations/:sessionId')
  async getVibrations(@Param('sessionId') sessionId: string) {
    return this.focusAidService.getVibrations(sessionId);
  }
}






