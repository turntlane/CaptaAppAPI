import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFocusAidSessionDto } from '../common/dto/create-focus-aid-session.dto';
import {
  CreateFocusAidAttentionScoreDto,
  CreateFocusAidAttentionScoreBatchDto,
} from '../common/dto/create-focus-aid-attention-score.dto';
import {
  CreateFocusAidVibrationDto,
  CreateFocusAidVibrationBatchDto,
} from '../common/dto/create-focus-aid-vibration.dto';

@Injectable()
export class FocusAidService {
  constructor(private prisma: PrismaService) {}

  async createSession(createDto: CreateFocusAidSessionDto) {
    // Verify session exists
    const session = await this.prisma.session.findUnique({
      where: { id: createDto.sessionId },
    });

    if (!session) {
      throw new NotFoundException(
        `Session with ID ${createDto.sessionId} not found`,
      );
    }

    if (session.sessionType !== 'focus_aid') {
      throw new NotFoundException(
        `Session ${createDto.sessionId} is not a focus aid session`,
      );
    }

    return this.prisma.focusAidSession.create({
      data: {
        sessionId: createDto.sessionId,
        difficultyLevel: createDto.difficultyLevel,
        preSessionInfo: createDto.preSessionInfo as any,
        postSessionFeedback: createDto.postSessionFeedback as any,
      },
    });
  }

  async findSession(sessionId: string) {
    const session = await this.prisma.focusAidSession.findUnique({
      where: { sessionId },
      include: {
        session: true,
        attentionScores: {
          orderBy: { timestamp: 'asc' },
        },
        vibrations: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(
        `Focus aid session with ID ${sessionId} not found`,
      );
    }

    return session;
  }

  async updateSession(
    sessionId: string,
    updateData: Partial<CreateFocusAidSessionDto>,
  ) {
    try {
      return await this.prisma.focusAidSession.update({
        where: { sessionId },
        data: {
          difficultyLevel: updateData.difficultyLevel,
          preSessionInfo: updateData.preSessionInfo as any,
          postSessionFeedback: updateData.postSessionFeedback as any,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Focus aid session with ID ${sessionId} not found`,
        );
      }
      throw error;
    }
  }

  async createAttentionScore(createDto: CreateFocusAidAttentionScoreDto) {
    // Verify session exists
    const session = await this.prisma.focusAidSession.findUnique({
      where: { sessionId: createDto.sessionId },
    });

    if (!session) {
      throw new NotFoundException(
        `Focus aid session with ID ${createDto.sessionId} not found`,
      );
    }

    return this.prisma.focusAidAttentionScore.create({
      data: {
        sessionId: createDto.sessionId,
        timestamp: BigInt(createDto.timestamp),
        attentionScore: createDto.attentionScore,
        isFocused: createDto.isFocused,
      },
    });
  }

  async createAttentionScoreBatch(createBatchDto: CreateFocusAidAttentionScoreBatchDto) {
    // Verify session exists
    const session = await this.prisma.focusAidSession.findUnique({
      where: { sessionId: createBatchDto.sessionId },
    });

    if (!session) {
      throw new NotFoundException(
        `Focus aid session with ID ${createBatchDto.sessionId} not found`,
      );
    }

    const data = createBatchDto.scores.map((score) => ({
      sessionId: createBatchDto.sessionId,
      timestamp: BigInt(score.timestamp),
      attentionScore: score.attentionScore,
      isFocused: score.isFocused,
    }));

    return this.prisma.focusAidAttentionScore.createMany({
      data,
    });
  }

  async getAttentionScores(
    sessionId: string,
    startTime?: bigint | number,
    endTime?: bigint | number,
  ) {
    const where: any = { sessionId };

    if (startTime !== undefined || endTime !== undefined) {
      where.timestamp = {};
      if (startTime !== undefined) {
        where.timestamp.gte = BigInt(startTime);
      }
      if (endTime !== undefined) {
        where.timestamp.lte = BigInt(endTime);
      }
    }

    return this.prisma.focusAidAttentionScore.findMany({
      where,
      orderBy: { timestamp: 'asc' },
    });
  }

  async createVibration(createDto: CreateFocusAidVibrationDto) {
    // Verify session exists
    const session = await this.prisma.focusAidSession.findUnique({
      where: { sessionId: createDto.sessionId },
    });

    if (!session) {
      throw new NotFoundException(
        `Focus aid session with ID ${createDto.sessionId} not found`,
      );
    }

    return this.prisma.focusAidVibration.create({
      data: {
        sessionId: createDto.sessionId,
        timestamp: BigInt(createDto.timestamp),
      },
    });
  }

  async createVibrationBatch(createBatchDto: CreateFocusAidVibrationBatchDto) {
    // Verify session exists
    const session = await this.prisma.focusAidSession.findUnique({
      where: { sessionId: createBatchDto.sessionId },
    });

    if (!session) {
      throw new NotFoundException(
        `Focus aid session with ID ${createBatchDto.sessionId} not found`,
      );
    }

    const data = createBatchDto.timestamps.map((timestamp) => ({
      sessionId: createBatchDto.sessionId,
      timestamp: BigInt(timestamp),
    }));

    return this.prisma.focusAidVibration.createMany({
      data,
    });
  }

  async getVibrations(sessionId: string) {
    return this.prisma.focusAidVibration.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
    });
  }
}






