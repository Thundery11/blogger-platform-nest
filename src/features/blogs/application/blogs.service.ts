import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { Blogs, BlogsDocument } from '../domain/blogs.entity';
import { Types } from 'mongoose';
import { BlogsCreateModel } from '../api/models/input/create-blog.input.model';
import { BlogsQueryParams } from '../api/models/query/query.params';
import {
  AllBlogsOutputModel,
  BlogsOutputModel,
  allBlogsOutputMapper,
} from '../api/models/output/blog.output.model';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async createBlog(blogsCreateModel: BlogsCreateModel): Promise<BlogsDocument> {
    const createdAt = new Date();
    const id = new Types.ObjectId().toString();
    const newBlog = {
      id: id,
      name: blogsCreateModel.name,
      description: blogsCreateModel.description,
      websiteUrl: blogsCreateModel.websiteUrl,
      createdAt: createdAt.toISOString(),
      isMembership: false,
    };
    return await this.blogsRepository.createBlog(newBlog);
  }

  async findAllBlogs(
    blogsQueryParams: BlogsQueryParams,
  ): Promise<AllBlogsOutputModel> {
    const searchNameTerm = blogsQueryParams.searchNameTerm ?? '';
    const sortBy = blogsQueryParams.sortBy ?? 'createdAt';
    const sortDirection = blogsQueryParams.sortDirection ?? 'desc';
    const pageNumber = blogsQueryParams.pageNumber ?? 1;
    const pageSize = blogsQueryParams.pageSize ?? 10;

    const query = { name: new RegExp(searchNameTerm, 'i') };
    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments = await this.blogsRepository.countDocuments(query);
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);
    const allBlogs = await this.blogsRepository.getAllBlogs(
      query,
      sortBy,
      sortDirection,
      pageSize,
      skip,
    );
    const presentationAllblogs = {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: countedDocuments,
      items: allBlogs,
    };

    return presentationAllblogs;
  }
}
