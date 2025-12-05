import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import HttpError from '../../utils/httpError';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpError) {
      return response.status(exception.status).json({
        error: exception.message,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      return response.status(status).json(exceptionResponse);
    }

    // Prisma errors
    const error = exception as any;
    if (error?.code === 'P2002') {
      return response.status(400).json({
        error: 'A record with this information already exists',
      });
    }

    if (error?.code === 'P2025') {
      return response.status(404).json({
        error: 'Record not found',
      });
    }

    console.error('Unhandled exception:', exception);
    console.error('Error stack:', error?.stack);

    // Default error
    response.status(500).json({
      error: 'Something went wrong!',
      ...(process.env.NODE_ENV === 'development' && {
        details: error?.message,
        stack: error?.stack,
      }),
    });
  }
}






