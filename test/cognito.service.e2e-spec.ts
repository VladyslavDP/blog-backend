import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { UUID } from '@app/common/types/common';
import { CognitoService } from '../src/modules/cognito/cognito.service';

jest.setTimeout(300000);

describe.skip('Cognito (e2e)', () => {
  let app: INestApplication;
  let cognitoService: CognitoService;

  const email = 'email@mail.com';
  const nickName = 'example_nickname';
  const tempPassword = 'Temp1234!';
  const newPassword = 'MyNewP@ssw0rd';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();
    app = moduleFixture.createNestApplication();

    cognitoService = app.select(AppModule).get(CognitoService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should perform cognito operations', async () => {
    const userId: UUID = '00000000-0000-0000-0000-000000000000' as UUID;

    const user = await cognitoService.registerUser({
      email,
      nickName,
      password: tempPassword,
    });

    const sub = user.Attributes.find((attr) => attr.Name === 'sub');

    const signIn = await cognitoService.signIn(
      { email, password: tempPassword },
      sub.Value,
    );

    if ('ChallengeName' in signIn) {
      const token = await cognitoService.changePassword(
        { email, newPassword },
        sub.Value,
      );
    }

    const token = await cognitoService.signIn(
      { email, password: newPassword },
      sub.Value,
    );

    await cognitoService.deleteUser(email);
  });
});
