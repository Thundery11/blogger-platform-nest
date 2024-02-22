import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCommentInputModel } from '../../comments/api/models/input/comments-input.model';
import { CreateCommentForSpecificPostCommand } from '../../comments/application/use-cases/create-comment-for-specific-post-use-case';
import { Request } from 'express';
import { CurrentUserId } from '../../auth/decorators/current-user-id-param.decorator';
import { UsersQueryRepository } from '../../users/infrastructure/users-query.repository';
import { UserData } from '../../users/api/models/input/create-user.input.model';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { CommentsOutputModel } from '../../comments/api/models/output/comments-model.output';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private usersQueryRepository: UsersQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
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

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  @HttpCode(HttpStatus.CREATED)
  async createCommentForSpecificPost(
    @Param('postId') postId: string,
    @Body() createCommentModel: CreateCommentInputModel,
    @CurrentUserId() currentUserId,
  ): Promise<CommentsOutputModel | null> {
    const userId = currentUserId;
    const user = await this.usersQueryRepository.getUserById(
      new Types.ObjectId(userId),
    );
    const userLogin = user.login;
    const userData: UserData = { userId, userLogin };
    const result = await this.commandBus.execute(
      new CreateCommentForSpecificPostCommand(
        createCommentModel,
        userData,
        postId,
      ),
    );
    console.log('New Comment: ', result);
    const comment = await this.commentsQueryRepository.getCommentById(
      result._id,
    );
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }
}
