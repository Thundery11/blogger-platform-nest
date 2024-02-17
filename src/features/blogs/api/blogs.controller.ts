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
import { ApiTags } from '@nestjs/swagger';
import { BlogsService } from '../application/blogs.service';
import { BlogsCreateModel } from './models/input/create-blog.input.model';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import {
  AllBlogsOutputModel,
  BlogsOutputModel,
} from './models/output/blog.output.model';
import { SortingQueryParams } from './models/query/query-for-sorting';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query-repository';
import { PostCreateModel } from '../../posts/api/models/input/create-post.input.model';
import {
  AllPostsOutputModel,
  PostOutputModel,
} from '../../posts/api/models/output/post-output.model';
import { Types } from 'mongoose';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/use-cases/create-blog-use-case';
import { FindAllBlogsCommand } from '../application/use-cases/find-all-blogs-use-case';

@ApiTags('Blogs')
// @UseGuards(AuthGuard)
@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(201)
  async createBlog(
    @Body() blogsCreateModel: BlogsCreateModel,
  ): Promise<BlogsOutputModel> {
    const result = await this.commandBus.execute(
      new CreateBlogCommand(blogsCreateModel),
    );
    return await this.blogsQueryRepository.getBlogById(result._id);
  }

  @Get(':id')
  @HttpCode(200)
  async findBlog(@Param('id') id: string): Promise<BlogsOutputModel> {
    const blog = await this.blogsQueryRepository.getBlogById(
      new Types.ObjectId(id),
    );

    return blog;
  }

  @Get()
  @HttpCode(200)
  async findAllBlogs(
    @Query() blogsQueryParams: SortingQueryParams,
  ): Promise<AllBlogsOutputModel> {
    return await this.commandBus.execute(
      new FindAllBlogsCommand(blogsQueryParams),
    );
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') id: string,
    @Body() blogsUpdateModel: BlogsCreateModel,
  ): Promise<boolean> {
    const result = await this.blogsService.updateBlog(id, blogsUpdateModel);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string): Promise<boolean> {
    const result = await this.blogsService.deleteBLog(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostForSpecificBlog(
    @Param('blogId') blogId: string,
    @Body() postCreateModel: PostCreateModel,
  ): Promise<PostOutputModel | null> {
    const result = await this.blogsService.createPostForSpecificBlog(
      postCreateModel,
      blogId,
    );
    if (!result) {
      throw new NotFoundException();
    }
    return await this.postsQueryRepository.getPostById(result._id);
  }

  @Get(':blogId/posts')
  @HttpCode(200)
  async findAllPostsforScpecificBlog(
    @Param('blogId') blogid: string,
    @Query() sortingQueryParams: SortingQueryParams,
  ): Promise<AllPostsOutputModel | null> {
    const result = await this.postsService.findAllPostsForCurrentBlog(
      sortingQueryParams,
      blogid,
    );
    if (result === null) {
      throw new NotFoundException();
    }
    return result;
  }
}
