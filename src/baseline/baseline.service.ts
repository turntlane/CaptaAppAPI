import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBaselineSessionDto } from "../common/dto/create-baseline-session.dto";
import {
  CreateBaselineFrequencyBandDto,
  CreateBaselineFrequencyBandBatchDto,
} from "../common/dto/create-baseline-frequency-band.dto";

@Injectable()
export class BaselineService {
  constructor(private prisma: PrismaService) {}

  async createSession(createDto: CreateBaselineSessionDto) {
    // Verify session exists
    const session = await this.prisma.session.findUnique({
      where: { id: createDto.sessionId },
    });

    if (!session) {
      throw new NotFoundException(
        `Session with ID ${createDto.sessionId} not found`
      );
    }

    if (session.sessionType !== "baseline") {
      throw new NotFoundException(
        `Session ${createDto.sessionId} is not a baseline session`
      );
    }

    return this.prisma.baselineSession.create({
      data: {
        sessionId: createDto.sessionId,
        focusedStartTime: createDto.focusedStartTime
          ? BigInt(createDto.focusedStartTime)
          : undefined,
        focusedEndTime: createDto.focusedEndTime
          ? BigInt(createDto.focusedEndTime)
          : undefined,
        relaxedStartTime: createDto.relaxedStartTime
          ? BigInt(createDto.relaxedStartTime)
          : undefined,
        relaxedEndTime: createDto.relaxedEndTime
          ? BigInt(createDto.relaxedEndTime)
          : undefined,
      },
    });
  }

  async findSession(sessionId: string) {
    const session = await this.prisma.baselineSession.findUnique({
      where: { sessionId },
      include: {
        session: true,
        frequencyBands: {
          orderBy: { bandName: "asc" },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(
        `Baseline session with ID ${sessionId} not found`
      );
    }

    return session;
  }

  async updateSession(
    sessionId: string,
    updateData: Partial<CreateBaselineSessionDto>
  ) {
    try {
      const updatePayload: any = {};

      if (updateData.focusedStartTime !== undefined) {
        updatePayload.focusedStartTime = updateData.focusedStartTime
          ? BigInt(updateData.focusedStartTime)
          : null;
      }
      if (updateData.focusedEndTime !== undefined) {
        updatePayload.focusedEndTime = updateData.focusedEndTime
          ? BigInt(updateData.focusedEndTime)
          : null;
      }
      if (updateData.relaxedStartTime !== undefined) {
        updatePayload.relaxedStartTime = updateData.relaxedStartTime
          ? BigInt(updateData.relaxedStartTime)
          : null;
      }
      if (updateData.relaxedEndTime !== undefined) {
        updatePayload.relaxedEndTime = updateData.relaxedEndTime
          ? BigInt(updateData.relaxedEndTime)
          : null;
      }

      return await this.prisma.baselineSession.update({
        where: { sessionId },
        data: updatePayload,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundException(
          `Baseline session with ID ${sessionId} not found`
        );
      }
      throw error;
    }
  }

  async createFrequencyBand(createDto: CreateBaselineFrequencyBandDto) {
    // Verify session exists
    const session = await this.prisma.baselineSession.findUnique({
      where: { sessionId: createDto.sessionId },
    });

    if (!session) {
      throw new NotFoundException(
        `Baseline session with ID ${createDto.sessionId} not found`
      );
    }

    return this.prisma.baselineFrequencyBand.create({
      data: {
        sessionId: createDto.sessionId,
        bandName: createDto.bandName,
        freqStart: createDto.freqStart,
        freqEnd: createDto.freqEnd,
        powerAvg: createDto.powerAvg,
        powerSign: createDto.powerSign,
      },
    });
  }

  async createFrequencyBandBatch(
    createBatchDto: CreateBaselineFrequencyBandBatchDto
  ) {
    // Verify session exists
    const session = await this.prisma.baselineSession.findUnique({
      where: { sessionId: createBatchDto.sessionId },
    });

    if (!session) {
      throw new NotFoundException(
        `Baseline session with ID ${createBatchDto.sessionId} not found`
      );
    }

    const data = createBatchDto.bands.map((band) => ({
      sessionId: createBatchDto.sessionId,
      bandName: band.bandName,
      freqStart: band.freqStart,
      freqEnd: band.freqEnd,
      powerAvg: band.powerAvg,
      powerSign: band.powerSign,
    }));

    return this.prisma.baselineFrequencyBand.createMany({
      data,
    });
  }

  async getFrequencyBands(sessionId: string) {
    return this.prisma.baselineFrequencyBand.findMany({
      where: { sessionId },
      orderBy: { bandName: "asc" },
    });
  }
}





