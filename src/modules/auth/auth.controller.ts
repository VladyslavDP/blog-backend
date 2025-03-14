import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthService } from '@app/modules/auth/auth.service';
import { AuthUserCreateDto } from '@app/modules/auth/dto/auth-user-create.dto';
import { AuthUserChangePasswordDto } from '@app/modules/auth/dto/auth-user-change-password.dto';
import { AuthUserSignInDto } from '@app/modules/auth/dto/auth-user-sign-in.dto';
import {
  CognitoSignInResponseDto,
  CognitoSignInTokenResponseDto,
} from '@app/modules/cognito/dto/cognito-sign-in-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign-up' })
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() dto: AuthUserCreateDto) {
    await this.authService.signUp(dto);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password' })
  @HttpCode(HttpStatus.OK)
  async changePassword(@Body() dto: AuthUserChangePasswordDto) {
    await this.authService.changePassword(dto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in' })
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(CognitoSignInResponseDto, CognitoSignInTokenResponseDto)
  @ApiResponse({
    status: HttpStatus.OK,
    content: {
      'application/json': {
        schema: {
          oneOf: [
            { $ref: getSchemaPath(CognitoSignInTokenResponseDto) },
            { $ref: getSchemaPath(CognitoSignInResponseDto) },
          ],
        },
      },
    },
  })
  async signIn(@Body() dto: AuthUserSignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('sign-out')
  @ApiOperation({ summary: 'sign out' })
  @HttpCode(HttpStatus.OK)
  async signOut(@Headers('Authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header is missing or malformed');
    }

    const [, token] = authHeader.split(' ');
    await this.authService.signOut(token);
  }
}
