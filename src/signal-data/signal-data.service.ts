import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSignalDataDto,
  CreateSignalDataBatchDto,
} from '../common/dto/create-signal-data.dto';

@Injectable()
export class SignalDataService {
  constructor(private prisma: PrismaService) {}

  async create(createSignalDataDto: CreateSignalDataDto, userId?: string) {
    // Verify session exists and user owns it
    const session = await this.prisma.session.findUnique({
      where: { id: createSignalDataDto.sessionId },
    });

    if (!session) {
      throw new NotFoundException(
        `Session with ID ${createSignalDataDto.sessionId} not found`,
      );
    }

    if (userId && session.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this session');
    }

    return this.prisma.signalData.create({
      data: {
        sessionId: createSignalDataDto.sessionId,
        channel: createSignalDataDto.channel,
        timestamp: BigInt(createSignalDataDto.timestamp),
        signalValue: createSignalDataDto.signalValue,
      },
    });
  }

  async createBatch(createBatchDto: CreateSignalDataBatchDto, userId?: string) {
    // Verify session exists and user owns it
    const session = await this.prisma.session.findUnique({
      where: { id: createBatchDto.sessionId },
    });

    if (!session) {
      throw new NotFoundException(
        `Session with ID ${createBatchDto.sessionId} not found`,
      );
    }

    if (userId && session.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this session');
    }

    const data = createBatchDto.data.map((item) => ({
      sessionId: createBatchDto.sessionId,
      channel: createBatchDto.channel,
      timestamp: BigInt(item.timestamp),
      signalValue: item.signalValue,
    }));

    return this.prisma.signalData.createMany({
      data,
    });
  }

  async findBySession(
    sessionId: string,
    channel?: number,
    startTime?: bigint | number,
    endTime?: bigint | number,
    limit: number = 1000,
    userId?: string,
  ) {
    // Verify session exists and user owns it
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (userId && session.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this session');
    }

    const where: any = {
      sessionId,
    };

    if (channel !== undefined) {
      where.channel = channel;
    }

    if (startTime !== undefined || endTime !== undefined) {
      where.timestamp = {};
      if (startTime !== undefined) {
        where.timestamp.gte = BigInt(startTime);
      }
      if (endTime !== undefined) {
        where.timestamp.lte = BigInt(endTime);
      }
    }

    return this.prisma.signalData.findMany({
      where,
      orderBy: { timestamp: 'asc' },
      take: limit,
    });
  }

  async removeBySession(sessionId: string, userId?: string) {
    // Verify session exists and user owns it
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (userId && session.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this session');
    }

    return this.prisma.signalData.deleteMany({
      where: { sessionId },
    });
  }
}


