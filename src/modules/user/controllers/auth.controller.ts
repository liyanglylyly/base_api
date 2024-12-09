import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '@/modules/user/guards';
import { CredentialDto } from '@/modules/user/dtos';
import { Guest } from '@/modules/user/decorators/guest.decorator';
import { ReqUser } from '@/modules/user/decorators/user-request.decorator';
import { UserEntity } from '@/modules/user/entities';
import { AuthService } from '@/modules/user/services';

@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}
  @Post('login')
  @Guest()
  @UseGuards(LocalAuthGuard)
  async login(
    @ReqUser() user: ClassToPlain<UserEntity>,
    @Body() _data: CredentialDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.createToken(
      user.id,
    );
    return {
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
    };
  }

  @Post('refresh')
  @Guest()
  async refresh(@Body() data: { token: string }) {
    return await this.authService.refresh(data.token);
  }
}
