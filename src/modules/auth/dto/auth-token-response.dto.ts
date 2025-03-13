import { ApiResponseProperty } from '@nestjs/swagger';

export class AuthTokenResponseDto {
  @ApiResponseProperty({ type: String })
  accessToken: string;

  @ApiResponseProperty({ type: String })
  refreshToken: string;
}
