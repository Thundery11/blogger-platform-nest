import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { PostOutputModel } from './models/output/post-output.model';
import {
  PostCreateModel,
  PostCreateModelWithBlogId,
  PostUpdateModel,
} from './models/input/create-post.input.model';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get(':id')
  @HttpCode(200)
  async findPost(@Param('id') id: string): Promise<PostOutputModel | null> {
    const result = await this.postsQueryRepository.getCurrentPostByid(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
  @Post()
  @HttpCode(201)
  async createPost(
    @Body() postCreateModelWithBlogId: PostCreateModelWithBlogId,
  ): Promise<PostOutputModel> {
    const result = await this.postsService.createPost(
      postCreateModelWithBlogId,
    );
    if (!result) {
      throw new NotFoundException();
    }
    return await this.postsQueryRepository.getPostById(result._id);
  }
  @Put(':id')
  @HttpCode(204)
  async updatePost(
    @Param('id') id: string,
    @Body() postUpdateModel: PostUpdateModel,
  ): Promise<boolean> {
    const result = await this.postsService.updatePost(id, postUpdateModel);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
  // const post = await this.postsQueryRepository.getCurrentPostByid(id)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string): Promise<boolean> {
    const result = await this.postsQueryRepository.getCurrentPostByid(id);
    if (!result) {
      throw new NotFoundException();
    }
    return await this.postsService.deletePost(id);
  }
}
