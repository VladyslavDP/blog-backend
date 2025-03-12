import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class AuthUserCreateDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Length(3, 15)
  nickName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNotEmpty()
  @Matches('PASSWORD_PATTERN')
  password: string;
}
