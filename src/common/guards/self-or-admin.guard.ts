import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const { id } = request.params;

    if (!id) {
      throw new BadRequestException('User id parameter is required');
    }

    if (id !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}







