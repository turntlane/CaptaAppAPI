import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { SignalDataService } from './signal-data.service';
import {
  CreateSignalDataDto,
  CreateSignalDataBatchDto,
} from '../common/dto/create-signal-data.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User, UserPayload } from '../common/decorators/user.decorator';

@Controller('signal-data')
@UseGuards(JwtAuthGuard)
export class SignalDataController {
  constructor(private readonly signalDataService: SignalDataService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSignalDataDto: CreateSignalDataDto,
    @User() user: UserPayload,
  ) {
    return this.signalDataService.create(createSignalDataDto, user.id);
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  async createBatch(
    @Body() createBatchDto: CreateSignalDataBatchDto,
    @User() user: UserPayload,
  ) {
    return this.signalDataService.createBatch(createBatchDto, user.id);
  }

  @Get('session/:sessionId')
  async findBySession(
    @Param('sessionId') sessionId: string,
    @Query('channel') channel?: number,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @User() user?: UserPayload,
  ) {
    return this.signalDataService.findBySession(
      sessionId,
      channel,
      startTime ? BigInt(startTime) : undefined,
      endTime ? BigInt(endTime) : undefined,
      limit,
      user?.id,
    );
  }

  @Delete('session/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeBySession(
    @Param('sessionId') sessionId: string,
    @User() user: UserPayload,
  ) {
    await this.signalDataService.removeBySession(sessionId, user.id);
  }
}


