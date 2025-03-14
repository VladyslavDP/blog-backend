import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '@app/modules/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/common/domain/entities/user.entity';
import { CognitoModule } from '@app/modules/cognito/cognito.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CognitoModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
