import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSessionDto } from "../common/dto/create-session.dto";
import { Prisma, Role } from "@prisma/client";

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSessionDto, userId: string) {
    const sessionData: Prisma.SessionCreateInput = {
      sessionType: data.sessionType,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      endedAt: data.endedAt ? new Date(data.endedAt) : undefined,
      durationSeconds: data.durationSeconds,
      user: {
        connect: { id: userId },
      },
    };

    return this.prisma.session.create({
      data: sessionData,
      include: {
        focusAidSession: true,
        baselineSession: true,
        signalData: {
          take: 10, // Limit signal data in list view
          orderBy: { timestamp: "asc" },
        },
      },
    });
  }

  async findAll(sessionType?: string, userId?: string, userRole?: Role) {
    const where: Prisma.SessionWhereInput = {};

    // Users can only see their own sessions, admins can see all
    if (userRole !== Role.ADMIN && userId) {
      where.userId = userId;
    }

    if (sessionType) {
      where.sessionType = sessionType as any;
    }

    return this.prisma.session.findMany({
      where,
      include: {
        focusAidSession: true,
        baselineSession: true,
        _count: {
          select: {
            signalData: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string, userId?: string, userRole?: Role) {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: {
        focusAidSession: {
          include: {
            attentionScores: {
              take: 100,
              orderBy: { timestamp: "asc" },
            },
            vibrations: {
              take: 50,
              orderBy: { timestamp: "asc" },
            },
          },
        },
        baselineSession: {
          include: {
            frequencyBands: true,
          },
        },
        signalData: {
          take: 1000,
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    // Users can only access their own sessions, admins can access all
    if (userRole !== Role.ADMIN && session.userId !== userId) {
      throw new ForbiddenException(
        "You do not have permission to access this session"
      );
    }

    return session;
  }

  async update(
    id: string,
    data: Partial<CreateSessionDto>,
    userId?: string,
    userRole?: Role
  ) {
    // First check if session exists and user has permission
    const session = await this.findOne(id, userId, userRole);

    const updateData: Prisma.SessionUpdateInput = {};

    if (data.sessionType !== undefined) {
      updateData.sessionType = data.sessionType;
    }
    if (data.createdAt !== undefined) {
      updateData.createdAt = new Date(data.createdAt);
    }
    if (data.endedAt !== undefined) {
      updateData.endedAt = data.endedAt ? new Date(data.endedAt) : null;
    }
    if (data.durationSeconds !== undefined) {
      updateData.durationSeconds = data.durationSeconds;
    }

    try {
      return await this.prisma.session.update({
        where: { id },
        data: updateData,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Session with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string, userId?: string, userRole?: Role) {
    // First check if session exists and user has permission
    await this.findOne(id, userId, userRole);

    try {
      await this.prisma.session.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Session with ID ${id} not found`);
      }
      throw error;
    }
  }
}
