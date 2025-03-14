import { ApiProperty } from '@nestjs/swagger';

export class CognitoSignInResponseDto {
  @ApiProperty({
    description:
      'The challenge required for further actions (e.g., NEW_PASSWORD_REQUIRED)',
    example: 'NEW_PASSWORD_REQUIRED',
  })
  ChallengeName: string;
}

export class CognitoSignInTokenResponseDto {
  @ApiProperty({
    description: 'Access token for authenticated requests',
    example: 'eyJz93a...k4laUWw',
  })
  AccessToken: string;

  @ApiProperty({
    description: 'Refresh token for renewing the session',
    example: 'eyJt93b...k9laZRx',
  })
  RefreshToken: string;

  @ApiProperty({
    description: 'Expiration time of the access token in seconds',
    example: 3600,
  })
  ExpiresIn: number;
}
