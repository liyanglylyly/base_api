import { DtoValidation } from '@/modules/core/decorators/dto-validation.decorator';
import { UserOrderType, UserValidateGroups } from '@/modules/user/constants';
import { PartialType, PickType } from '@nestjs/swagger';
import { UserCommonDto } from '@/modules/user/dtos/common.dto';
import { IsDefined, IsEnum, IsUUID } from 'class-validator';
import { PaginateWithTrashedDto } from '@/modules/core/dtos';

/**
 * 创建用的请求数据验证
 */
@DtoValidation({ groups: [UserValidateGroups.USER_CREATE] })
export class CreateUserDto extends PickType(UserCommonDto, [
  'username',
  'nickname',
  'password',
  'phone',
  'email',
]) {}

/**
 * 更新用户
 */
@DtoValidation({ groups: [UserValidateGroups.USER_UPDATE] })
export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * 待更新的用户ID
   */
  @IsUUID(undefined, {
    groups: [UserValidateGroups.USER_UPDATE],
    message: '用户ID格式不正确',
  })
  @IsDefined({ groups: ['update'], message: '用户ID必须指定' })
  id: string;
}

/**
 * 查询用户列表的Query数据验证
 */
@DtoValidation({ type: 'query' })
export class QueryUserDto extends PaginateWithTrashedDto {
  /**
   * 排序规则:可指定用户列表的排序规则,默认为按创建时间降序排序
   */
  @IsEnum(UserOrderType)
  orderBy?: UserOrderType;
}
