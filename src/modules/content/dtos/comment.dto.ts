import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { PaginateOptions } from '@/modules/database/types';
import { toNumber } from 'lodash';
import { PickType } from '@nestjs/swagger';
import { DtoValidation } from '@/modules/core/decorators/dto-validation.decorator';

/**
 * 评论分页查询验证
 */
@DtoValidation({ type: 'query' })
export class QueryCommentDto implements PaginateOptions {
  @IsUUID(undefined, { message: 'ID格式错误' })
  @IsOptional()
  post?: string;

  @Transform(({ value }) => toNumber(value))
  @Min(1, { message: '当前页必须大于1' })
  @IsNumber()
  @IsOptional()
  page = 1;

  @Transform(({ value }) => toNumber(value))
  @Min(1, { message: '每页显示数据必须大于1' })
  @IsNumber()
  @IsOptional()
  limit = 10;
}

/**
 * 评论树查询
 */
@DtoValidation({ type: 'query' })
export class QueryCommentTreeDto extends PickType(QueryCommentDto, ['post']) {}

/**
 * 评论添加验证
 */
@DtoValidation()
export class CreateCommentDto {
  @MaxLength(1000, { message: '评论内容不能超过$constraint1个字' })
  @IsNotEmpty({ message: '评论内容不能为空' })
  body: string;

  @IsUUID(undefined, { message: 'ID格式错误' })
  @IsDefined({ message: 'ID必须指定' })
  post: string;

  @IsUUID(undefined, { always: true, message: 'ID格式错误' })
  @ValidateIf((value) => value.parent !== null && value.parent)
  @IsOptional({ always: true })
  @Transform(({ value }) => (value === 'null' ? null : value))
  parent?: string;
}
