import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { UserService } from '@/modules/user/services';
import { CreateUserDto, UpdateUserDto } from '@/modules/user/dtos';
import { ReqUser } from '@/modules/user/decorators/user-request.decorator';
import { UserEntity } from '@/modules/user/entities';

@Controller('user')
export class UserController {
  constructor(protected userService: UserService) {}
  @Post()
  async create(@Body() d: CreateUserDto) {
    return await this.userService.create(d);
  }

  @Patch()
  async update(@Body() d: UpdateUserDto) {
    return await this.userService.update(d);
  }

  @Get('loginUserInfo')
  @SerializeOptions({ groups: ['user-detail'] })
  async loginUserInfo(@ReqUser() user: ClassToPlain<UserEntity>) {
    return await this.userService.detail(user.id);
  }

  @Get(':id')
  @SerializeOptions({ groups: ['user-detail'] })
  async detail(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.detail(id);
  }
}
