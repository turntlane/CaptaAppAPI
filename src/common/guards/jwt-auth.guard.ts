import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyAccessToken, AccessTokenPayload } from '../../utils/token';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication required');
    }

    const token = authHeader.slice(7).trim();

    try {
      const payload: AccessTokenPayload = verifyAccessToken(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
        role: payload.role,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}







