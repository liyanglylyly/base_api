import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  SerializeOptions,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AppInterceptor } from '@/modules/core/providers';
import { TagService } from '@/modules/content/services';
import {
  CreateTagDto,
  QueryCategoryDto,
  UpdateTagDto,
} from '@/modules/content/dtos';

@UseInterceptors(AppInterceptor)
@Controller('tag')
export class TagController {
  constructor(protected service: TagService) {}

  @Post('list')
  @SerializeOptions({})
  async list(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        validationError: { target: false },
      }),
    )
    options: QueryCategoryDto,
  ) {
    return this.service.paginate(options);
  }

  @Get(':id')
  @SerializeOptions({})
  async detail(
    @Param('id', new ParseUUIDPipe())
    id: string,
  ) {
    return this.service.detail(id);
  }

  @Post()
  @SerializeOptions({})
  async store(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        validationError: { target: false },
        groups: ['create'],
      }),
    )
    data: CreateTagDto,
  ) {
    return this.service.create(data);
  }

  @Patch()
  @SerializeOptions({})
  async update(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        validationError: { target: false },
        groups: ['update'],
      }),
    )
    data: UpdateTagDto,
  ) {
    return this.service.update(data);
  }

  @Delete(':id')
  @SerializeOptions({})
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.delete(id);
  }
}
