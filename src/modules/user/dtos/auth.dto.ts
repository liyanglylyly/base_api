import { PickType } from '@nestjs/swagger';
import { UserCommonDto } from '@/modules/user/dtos/common.dto';
import { DtoValidation } from '@/modules/core/decorators/dto-validation.decorator';
import { UserValidateGroups } from '@/modules/user/constants';

/**
 * 用户正常方式登录
 */
@DtoValidation()
export class CredentialDto extends PickType(UserCommonDto, [
  'credential',
  'password',
]) {}

/**
 * 普通方式注册用户
 */
@DtoValidation({ groups: [UserValidateGroups.USER_REGISTER] })
export class RegisterDto extends PickType(UserCommonDto, [
  'username',
  'nickname',
  'password',
  'plainPassword',
] as const) {}
