import { BadRequestException, HttpStatus } from '@nestjs/common';

export function HandleErrors() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        handleError(error);
      }
    };

    return descriptor;
  };
}

function handleError(error: any): void {
  const httpStatus = HttpStatus.BAD_REQUEST;
  const message = error.message;

  throw new BadRequestException({ statusCode: httpStatus, message });
}
