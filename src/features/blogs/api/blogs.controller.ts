import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
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

  @Get()
  @HttpCode(200)
  async findAllBlogs(
    @Query() blogsQueryParams: BlogsQueryParams,
  ): Promise<AllBlogsOutputModel> {
    return await this.blogsService.findAllBlogs(blogsQueryParams);
  }
}
