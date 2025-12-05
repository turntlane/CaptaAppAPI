import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { BaselineService } from "./baseline.service";
import { CreateBaselineSessionDto } from "../common/dto/create-baseline-session.dto";
import {
  CreateBaselineFrequencyBandDto,
  CreateBaselineFrequencyBandBatchDto,
} from "../common/dto/create-baseline-frequency-band.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

@Controller("baseline")
// @UseGuards(JwtAuthGuard)
export class BaselineController {
  constructor(private readonly baselineService: BaselineService) {}

  @Post("sessions")
  @HttpCode(HttpStatus.CREATED)
  async createSession(@Body() createDto: CreateBaselineSessionDto) {
    return this.baselineService.createSession(createDto);
  }

  @Get("sessions/:sessionId")
  async findSession(@Param("sessionId") sessionId: string) {
    return this.baselineService.findSession(sessionId);
  }

  @Patch("sessions/:sessionId")
  async updateSession(
    @Param("sessionId") sessionId: string,
    @Body() updateDto: Partial<CreateBaselineSessionDto>
  ) {
    return this.baselineService.updateSession(sessionId, updateDto);
  }

  @Post("frequency-bands")
  @HttpCode(HttpStatus.CREATED)
  async createFrequencyBand(@Body() createDto: CreateBaselineFrequencyBandDto) {
    return this.baselineService.createFrequencyBand(createDto);
  }

  @Post("frequency-bands/batch")
  @HttpCode(HttpStatus.CREATED)
  async createFrequencyBandBatch(
    @Body() createBatchDto: CreateBaselineFrequencyBandBatchDto
  ) {
    return this.baselineService.createFrequencyBandBatch(createBatchDto);
  }

  @Get("frequency-bands/:sessionId")
  async getFrequencyBands(@Param("sessionId") sessionId: string) {
    return this.baselineService.getFrequencyBands(sessionId);
  }
}





