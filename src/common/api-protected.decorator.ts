import { ApiOperation } from '@nestjs/swagger';
import { ApiOperationOptions } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ERoles } from '@app/common/types';

export function ApiOperationProtected(
  options: ApiOperationOptions,
  roles: ERoles[] = [ERoles.USER],
) {
  const { summary, ...opts } = options;
  return ApiOperation({
    ...opts,
    summary: `🔐 ${summary}`,
    description: `Protected endpoint. Requires Bearer token for authentication. Available roles – ${roles.join(
      ',',
    )}`,
  });
}
