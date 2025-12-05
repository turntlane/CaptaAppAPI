import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface RequestMetadata {
  ip?: string;
  userAgent?: string;
}

export const Metadata = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestMetadata => {
    const request = ctx.switchToHttp().getRequest();
    return {
      ip: request.ip,
      userAgent: request.headers['user-agent'] ?? undefined,
    };
  },
);







