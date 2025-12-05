import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

interface AttemptRecord {
  count: number;
  expiresAt: number;
}

@Injectable()
export class LoginRateLimitInterceptor implements NestInterceptor {
  private attempts = new Map<string, AttemptRecord>();

  private makeKey(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const email =
      typeof request.body?.email === 'string'
        ? request.body.email.toLowerCase()
        : '';
    return `${request.ip}:${email}`;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const key = this.makeKey(context);
    const now = Date.now();
    const record = this.attempts.get(key);

    if (record && record.expiresAt > now) {
      if (record.count >= MAX_ATTEMPTS) {
        throw new HttpException(
          'Too many login attempts. Please try again later.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      record.count += 1;
      this.attempts.set(key, record);
    } else {
      this.attempts.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    }

    return next.handle().pipe(
      tap({
        next: () => {
          // Clear on success
          this.attempts.delete(key);
        },
        error: () => {
          // Clean up expired records
          const latest = this.attempts.get(key);
          if (latest && Date.now() > latest.expiresAt) {
            this.attempts.delete(key);
          }
        },
      }),
    );
  }
}







