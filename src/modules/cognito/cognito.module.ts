import { Module } from '@nestjs/common';
import { CognitoService } from '@app/modules/cognito/cognito.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CognitoService],
  exports: [CognitoService],
})
export class CognitoModule {}
