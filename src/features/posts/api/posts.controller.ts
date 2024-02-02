import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { PostOutputModel } from './models/output/post-output.model';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get(':id')
  @HttpCode(200)
  async findPost(@Param('id') id: string): Promise<PostOutputModel> {
    const result = await this.postsQueryRepository.getCurrentPostByid(id);
    // if (!result) {
    //   throw new NotFoundException();
    // }
    return result;
  }
}
