import { IsEnum, IsOptional } from 'class-validator';

import { SelectTrashMode } from '@/modules/database/constants';

import { DtoValidation } from '@/modules/core/decorators/dto-validation.decorator';
import { PaginateDto } from '@/modules/core/dtos';

@DtoValidation({ type: 'query' })
export class PaginateWithTrashedDto extends PaginateDto {
  /**
   * 根据软删除状态查询
   */
  @IsEnum(SelectTrashMode)
  @IsOptional()
  trashed?: SelectTrashMode;
}
