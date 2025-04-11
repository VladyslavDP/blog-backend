import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  addTransactionalDataSource,
  getDataSourceByName,
} from 'typeorm-transactional';
import { TagModule } from './modules/tag/tag.module';
import { PostModule } from './modules/post/post.module';
import { AuthModule } from './modules/auth/auth.module';
import { CognitoModule } from './modules/cognito/cognito.module';
import { CognitoAuthModule } from '@nestjs-cognito/auth';
import { JwtManagerModule } from '@app/modules/jwt-manager/jwt-manager.module';
import { JwtManagerService } from './modules/jwt-manager/jwt-manager.service';
import { Cache, CacheModule } from '@nestjs/cache-manager';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          ...ormConfig,
          port: +process.env.PG_DATABASE_PORT,
        };
      },
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid data source options!');
        }
        return (
          getDataSourceByName('default') ||
          addTransactionalDataSource(new DataSource(options))
        );
      },
    }),
    TagModule,
    PostModule,
    AuthModule,
    JwtManagerModule,
    CognitoModule,
    CacheModule.register({
      isGlobal: true,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      ...(process.env.REDIS_TLS === 'true' && { tls: {} }),
    }),
    CognitoAuthModule.registerAsync({
      imports: [JwtManagerModule],
      useFactory: async (jwtService: JwtManagerService) => ({
        jwtVerifier: [
          {
            userPoolId: process.env.COGNITO_USER_POOL_ID,
            clientId: process.env.COGNITO_CLIENT_ID,
            tokenUse: 'access',
            customJwtCheck: (props): Promise<void> =>
              jwtService.jwtUserChecker(props),
          },
        ],
        identityProvider: {
          region: process.env.COGNITO_REGION,
        },
      }),
      inject: [JwtManagerService, Cache],
    }),
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
