import {
  BadRequestException,
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
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogsService } from '../application/blogs.service';
import { BlogsCreateModel } from './models/input/create-blog.input.model';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import {
  AllBlogsOutputModel,
  BlogsOutputModel,
} from './models/output/blog.output.model';
import { BlogsQueryParams } from './models/query/query.params';
@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Post()
  @HttpCode(201)
  async createBlog(
    @Body() blogsCreateModel: BlogsCreateModel,
  ): Promise<BlogsOutputModel> {
    const result = await this.blogsService.createBlog(blogsCreateModel);
    return await this.blogsQueryRepository.getBlogById(result._id);
  }

  @Get(':id')
  @HttpCode(200)
  async findBlog(@Param('id') id: string): Promise<BlogsOutputModel> {
    const blog = await this.blogsQueryRepository.getCurrentBlogById(id);

    return blog;
  }

  @Get()
  @HttpCode(200)
  async findAllBlogs(
    @Query() blogsQueryParams: BlogsQueryParams,
  ): Promise<AllBlogsOutputModel> {
    return await this.blogsService.findAllBlogs(blogsQueryParams);
  }

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

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string): Promise<boolean> {
    const result = await this.blogsService.deleteBLog(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
