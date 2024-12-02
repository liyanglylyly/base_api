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
} from '@nestjs/common';
import { TagService } from '@/modules/content/services';
import {
  CreateTagDto,
  QueryCategoryDto,
  UpdateTagDto,
} from '@/modules/content/dtos';

@Controller('tag')
export class TagController {
  constructor(protected service: TagService) {}

  @Post('list')
  @SerializeOptions({})
  async list(@Body() options: QueryCategoryDto) {
    return this.service.paginate(options);
  }

  @Get(':id')
  @SerializeOptions({})
  async detail(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.detail(id);
  }

  @Post()
  @SerializeOptions({})
  async store(@Body() data: CreateTagDto) {
    return this.service.create(data);
  }

  @Patch()
  @SerializeOptions({})
  async update(@Body() data: UpdateTagDto) {
    return this.service.update(data);
  }

  @Delete(':id')
  @SerializeOptions({})
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.delete(id);
  }
}
