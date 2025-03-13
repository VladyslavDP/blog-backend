export class CognitoSignInResponseDto {
  ChallengeName: string;
}

export class CognitoSignInTokenResponseDto {
  AccessToken: string;
  RefreshToken: string;
  ExpiresIn: number;
}
