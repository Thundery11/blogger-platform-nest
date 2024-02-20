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
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import {
  AllPostsOutputModel,
  PostOutputModel,
} from './models/output/post-output.model';
import {
  PostCreateModel,
  PostCreateModelWithBlogId,
  PostUpdateModel,
} from './models/input/create-post.input.model';
import { SortingQueryParamsForPosts } from './models/query/query-for-sorting';
import { Types } from 'mongoose';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { FindAllPostsCommand } from '../application/use-cases/find-all-posts-use-case';
import { CreatePostCommand } from '../application/use-cases/create-post-use-case';
import { UpdatePostCommand } from '../application/use-cases/update-post-use-case';
import { DeletePostCommand } from '../application/delete-post-use-case';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get(':id')
  @HttpCode(200)
  async findPost(@Param('id') id: string): Promise<PostOutputModel | null> {
    const result = await this.postsQueryRepository.getPostById(
      new Types.ObjectId(id),
    );
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  @Get()
  @HttpCode(200)
  async findAllPosts(
    @Query() sortingQueryPosts: SortingQueryParamsForPosts,
  ): Promise<AllPostsOutputModel | null> {
    const result = await this.commandBus.execute(
      new FindAllPostsCommand(sortingQueryPosts),
    );
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createPost(
    @Body() postCreateModelWithBlogId: PostCreateModelWithBlogId,
  ): Promise<PostOutputModel> {
    const result = await this.commandBus.execute(
      new CreatePostCommand(postCreateModelWithBlogId),
    );
    if (!result) {
      throw new NotFoundException();
    }
    return await this.postsQueryRepository.getPostById(result._id);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updatePost(
    @Param('id') id: string,
    @Body() postUpdateModel: PostUpdateModel,
  ): Promise<boolean> {
    const result = await this.commandBus.execute(
      new UpdatePostCommand(postUpdateModel, id),
    );
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string): Promise<boolean> {
    const result = await this.postsQueryRepository.getCurrentPostByid(id);
    if (!result) {
      throw new NotFoundException();
    }
    return await this.commandBus.execute(new DeletePostCommand(id));
  }
}
