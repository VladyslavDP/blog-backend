import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/common/domain/entities/user.entity';
import { AuthUserCreateDto } from '@app/modules/auth/dto/auth-user-create.dto';
import { adminUUID, UUID } from '@app/common/types';
import { CognitoService } from '@app/modules/cognito/cognito.service';
import { Transactional } from 'typeorm-transactional';
import { AuthUserSignInDto } from '@app/modules/auth/dto/auth-user-sign-in.dto';
import { AuthUserChangePasswordDto } from '@app/modules/auth/dto/auth-user-change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly cognitoService: CognitoService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException('User with such email not found');
    }

    return user;
  }

  @Transactional()
  async signUp(dto: AuthUserCreateDto) {
    const isUserRegistered = await this.userRepository.exists({
      where: [{ email: dto.email }, { nickName: dto.nickName }],
    });

    if (isUserRegistered) {
      throw new BadRequestException('User already registred');
    }

    const user = await this.cognitoService.registerUser(dto);

    const id = user.Attributes.find((attr) => attr.Name === 'sub')?.Value;

    await this.userRepository.save({
      id,
      email: dto.email,
      nickName: dto.nickName,
      audit: { createdBy: adminUUID, updatedBy: adminUUID },
    });
  }

  async changePassword(dto: AuthUserChangePasswordDto) {
    const user = await this.getUserByEmail(dto.email);
    return this.cognitoService.changePassword(dto, user.id);
  }

  async signIn(dto: AuthUserSignInDto) {
    const user = await this.getUserByEmail(dto.email);
    return this.cognitoService.signIn(dto, user.id);
  }

  async signOut(accessToken: string) {
    await this.cognitoService.signOut(accessToken);
  }
}
