import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class LoginRateLimitInterceptor implements NestInterceptor {
    private attempts;
    private makeKey;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
