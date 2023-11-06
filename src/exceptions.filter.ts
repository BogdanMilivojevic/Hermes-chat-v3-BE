import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    console.log(exception);

    response.status(status || 400).json({
      message: exception.message,
      path: request.url,
    });
  }
}
