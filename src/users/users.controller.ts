import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../common/dto/create-user.dto';
import { UpdateUserDto } from '../common/dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { SelfOrAdminGuard } from '../common/guards/self-or-admin.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User, UserPayload } from '../common/decorators/user.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto, @User() user: UserPayload) {
    const data = await this.usersService.prepareCreateData(
      createUserDto,
      user.role,
    );
    return this.usersService.create(data, user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserPayload,
  ) {
    const data = await this.usersService.prepareUpdateData(
      updateUserDto,
      user.role,
    );
    return this.usersService.update(id, data, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }
}







