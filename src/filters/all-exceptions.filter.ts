import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code = status;
        let data = null;

        if (exception instanceof HttpException) {
            code = exception.getStatus();
            message = exception.message;

            // 如果异常有自定义数据，提取出来
            if (exception.getResponse() && typeof exception.getResponse() === 'object') {
                const exceptionResponse = exception.getResponse() as Record<string, any>;
                data = exceptionResponse.data || null;
                message = exceptionResponse.message || message;
            }
        }

        response.status(status).json({
            code,
            data,
            message,
        });
    }
}
