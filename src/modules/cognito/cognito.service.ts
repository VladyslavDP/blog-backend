import { Inject, Injectable } from '@nestjs/common';
import { InjectCognitoIdentityProvider } from '@nestjs-cognito/core';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as AWS from 'aws-sdk';
import { Cache } from 'cache-manager';
import { HandleErrors } from '@app/common/decorators/handle-error.decorator';

const USER_ID = 'USER_ID';

AWS.config.update({
  region: process.env.COGNITO_REGION,
});

@Injectable()
export class CognitoService {
  private readonly clientId = process.env.COGNITO_CLIENT_ID;
  private readonly userPoolId = process.env.COGNITO_USER_POOL_ID;
  private cognito: AWS.CognitoIdentityServiceProvider;

  constructor(
    @InjectCognitoIdentityProvider()
    private readonly client: CognitoIdentityProvider,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache, //protected readonly jwtManagerService: JwtManagerService,
  ) {
    this.cognito = new AWS.CognitoIdentityServiceProvider();
  }

  @HandleErrors()
  async registerUser(
    email: string,
    nickname: string,
    temporaryPassword: string,
  ): Promise<any> {
    const params = {
      UserPoolId: this.userPoolId,
      Username: email,
      TemporaryPassword: temporaryPassword,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'nickname', Value: nickname },
      ],
      MessageAction: 'SUPPRESS',
    };

    const {
      User: { Username, Attributes },
    } = await this.cognito.adminCreateUser(params).promise();

    return { Username, Attributes };
  }
}
