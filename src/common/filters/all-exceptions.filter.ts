import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter<HttpException> {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost) {
    this.logger.debug('AllExceptionsFilter');

    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    let httpStatus: HttpStatus;
    let message = exception.message;

    if (
      exception instanceof EntityNotFoundError ||
      exception instanceof QueryFailedError
    ) {
      message = exception.message.split('matching')[0];
      httpStatus = HttpStatus.BAD_REQUEST;
    } else if (
      exception instanceof ConflictException ||
      exception instanceof BadRequestException
    ) {
      message = exception.getResponse()['message'];
      httpStatus = exception.getStatus();
    } else if (exception instanceof ForbiddenException) {
      message = exception.getResponse()['message'];
      httpStatus = HttpStatus.FORBIDDEN;
    } else if (exception instanceof NotFoundException) {
      httpStatus = HttpStatus.NOT_FOUND;
    } else if (exception instanceof NotAcceptableException) {
      httpStatus = HttpStatus.NOT_ACCEPTABLE;
    } else if (exception instanceof Error) {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    httpAdapter.reply(
      ctx.getResponse(),
      { name: exception.name, message },
      httpStatus,
    );
  }
}
