// src/modules/content/controllers/post.controller.ts
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
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  CreatePostDto,
  QueryPostDto,
  UpdatePostDto,
} from '@/modules/content/dtos';
import { AppInterceptor } from '@/modules/core/providers';

@Controller('post')
@UseInterceptors(AppInterceptor)
export class PostController {
  constructor(protected service: PostService) {}

  @Post('list')
  @SerializeOptions({ groups: ['post-list'] })
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
    options: QueryPostDto,
  ) {
    return this.service.paginate(options);
  }

  @Get(':id')
  @SerializeOptions({ groups: ['post-detail'] })
  async detail(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.detail(id);
  }

  @Post()
  @SerializeOptions({ groups: ['post-detail'] })
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
    data: CreatePostDto,
  ) {
    return this.service.create(data);
  }

  @Patch()
  @SerializeOptions({ groups: ['post-detail'] })
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
    data: UpdatePostDto,
  ) {
    return this.service.update(data);
  }

  @Delete(':id')
  @SerializeOptions({ groups: ['post-detail'] })
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.delete(id);
  }
}
