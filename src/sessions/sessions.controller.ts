import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { CreateSessionDto } from "../common/dto/create-session.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { User, UserPayload } from "../common/decorators/user.decorator";

@Controller("sessions")
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSessionDto: CreateSessionDto,
    @User() user: UserPayload
  ) {
    return this.sessionsService.create(createSessionDto, user.id);
  }

  @Get()
  async findAll(
    @User() user: UserPayload,
    @Query("type") sessionType?: string
  ) {
    return this.sessionsService.findAll(sessionType, user.id, user.role);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @User() user: UserPayload) {
    return this.sessionsService.findOne(id, user.id, user.role);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateSessionDto: Partial<CreateSessionDto>,
    @User() user: UserPayload
  ) {
    return this.sessionsService.update(
      id,
      updateSessionDto,
      user.id,
      user.role
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string, @User() user: UserPayload) {
    await this.sessionsService.remove(id, user.id, user.role);
  }
}
