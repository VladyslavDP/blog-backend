import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectCognitoIdentityProvider } from '@nestjs-cognito/core';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as AWS from 'aws-sdk';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Cache } from 'cache-manager';
import { HandleErrors } from '@app/common/decorators/handle-error.decorator';
import * as crypto from 'crypto';
import { AuthUserCreateDto } from '@app/modules/auth/dto/auth-user-create.dto';
import { UsernameType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { AuthUserSignInDto } from '@app/modules/auth/dto/auth-user-sign-in.dto';
import { CognitoRegisterResponseDto } from '@app/modules/cognito/dto/cognito-register-response.dto';
import { TTL_24H } from '@app/common/utils';
import { ERoles, UUID } from '@app/common/types';
import {
  CognitoSignInResponseDto,
  CognitoSignInTokenResponseDto,
} from '@app/modules/cognito/dto/cognito-sign-in-response.dto';
import { AuthUserChangePasswordDto } from '@app/modules/auth/dto/auth-user-change-password.dto';

const SESSION_KEY = 'SESSION';

AWS.config.update({
  region: process.env.COGNITO_REGION,
});

@Injectable()
export class CognitoService {
  private readonly clientId = process.env.COGNITO_CLIENT_ID;
  private readonly userPoolId = process.env.COGNITO_USER_POOL_ID;
  private readonly clientSecret = process.env.COGNITO_CLIENT_SECRET;
  private cognito: AWS.CognitoIdentityServiceProvider;

  constructor(
    @InjectCognitoIdentityProvider()
    private readonly client: CognitoIdentityProvider,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {
    this.cognito = new AWS.CognitoIdentityServiceProvider();
  }

  private createSecretHash(username: string): string {
    return crypto
      .createHmac('SHA256', this.clientSecret)
      .update(username + this.clientId)
      .digest('base64');
  }

  @HandleErrors()
  async registerUser(
    dto: AuthUserCreateDto,
  ): Promise<CognitoRegisterResponseDto> {
    const { email, password, nickName } = dto;
    const params = {
      UserPoolId: this.userPoolId,
      Username: email,
      TemporaryPassword: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'nickname', Value: nickName },
      ],
      MessageAction: 'SUPPRESS',
    };

    const {
      User: { Username, Attributes },
    } = await this.cognito.adminCreateUser(params).promise();

    await this.cognito
      .adminAddUserToGroup({
        UserPoolId: this.userPoolId,
        Username: email,
        GroupName: ERoles.USER,
      })
      .promise();

    return { Username, Attributes };
  }

  @HandleErrors()
  async deleteUser(Username: UsernameType): Promise<void> {
    await this.cognito
      .adminDeleteUser({ UserPoolId: this.userPoolId, Username })
      .promise();
  }

  @HandleErrors()
  async signIn(
    dto: AuthUserSignInDto,
    userId: UUID,
  ): Promise<CognitoSignInResponseDto | CognitoSignInTokenResponseDto> {
    const { email, password } = dto;

    const params: CognitoIdentityServiceProvider.InitiateAuthRequest = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.createSecretHash(email),
      },
    };

    const { ChallengeName, Session, AuthenticationResult } = await this.cognito
      .initiateAuth(params)
      .promise();

    if (ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      await this.cacheService.set(`${SESSION_KEY}:${userId}`, Session, TTL_24H);
      return { ChallengeName };
    }

    const { AccessToken, RefreshToken, ExpiresIn } = AuthenticationResult;

    return { AccessToken, RefreshToken, ExpiresIn };
  }

  @HandleErrors()
  async changePassword(
    dto: AuthUserChangePasswordDto,
    userId: UUID,
  ): Promise<CognitoSignInTokenResponseDto> {
    const { email, newPassword } = dto;

    const session = (await this.cacheService.get(
      `${SESSION_KEY}:${userId}`,
    )) as string;

    if (!session) {
      throw new BadRequestException('Error happened. Try login again.');
    }

    const params: AWS.CognitoIdentityServiceProvider.RespondToAuthChallengeRequest =
      {
        ClientId: this.clientId,
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        Session: session,
        ChallengeResponses: {
          USERNAME: email,
          NEW_PASSWORD: newPassword,
          SECRET_HASH: this.createSecretHash(email),
        },
      };

    const response = await this.cognito
      .respondToAuthChallenge(params)
      .promise();

    const {
      AuthenticationResult: { AccessToken, RefreshToken, ExpiresIn },
    } = response;

    return { AccessToken, RefreshToken, ExpiresIn };
  }

  @HandleErrors()
  async signOut(accessToken: string): Promise<void> {
    await this.cognito
      .globalSignOut({
        AccessToken: accessToken,
      })
      .promise();
  }
}
