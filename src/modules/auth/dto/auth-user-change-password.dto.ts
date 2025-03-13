import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { PASSWORD_PATTERN } from '@app/common/utils';

export class AuthUserChangePasswordDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNotEmpty()
  @Matches(PASSWORD_PATTERN)
  newPassword: string;
}
