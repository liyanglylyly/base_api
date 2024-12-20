import { PostService } from '@/modules/content/services';
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
import {
  CreatePostDto,
  QueryPostDto,
  UpdatePostDto,
} from '@/modules/content/dtos';

@Controller('post')
export class PostController {
  constructor(protected service: PostService) {}

  @Post('list')
  @SerializeOptions({ groups: ['post-list'] })
  async list(@Body() options: QueryPostDto) {
    return this.service.paginate(options);
  }

  @Get(':id')
  @SerializeOptions({ groups: ['post-detail'] })
  async detail(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.detail(id);
  }

  @Post()
  @SerializeOptions({ groups: ['post-detail'] })
  async store(@Body() data: CreatePostDto) {
    return this.service.create(data);
  }

  @Patch()
  @SerializeOptions({ groups: ['post-detail'] })
  async update(@Body() data: UpdatePostDto) {
    return this.service.update(data);
  }

  @Delete(':id')
  @SerializeOptions({ groups: ['post-detail'] })
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.delete(id);
  }
}
