import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { SortingQueryParams } from '../../blogs/api/models/query/query-for-sorting';
import {
  AllPostsOutputModel,
  PostOutputModel,
} from '../api/models/output/post-output.model';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.query-repository';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}
  async findAllPosts(
    sortingQueryParams: SortingQueryParams,
    blogId: string,
  ): Promise<AllPostsOutputModel | null> {
    const {
      searchNameTerm = '',
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = sortingQueryParams;
    // const query = {};
    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments =
      await this.postsRepository.countAllDocumentsForCurrentBlog(blogId);
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);

    const isBlogExist =
      await this.blogsQueryRepository.getCurrentBlogById(blogId);
    if (!isBlogExist) {
      return null;
    }

    const allPosts = await this.postsRepository.getAllPosts(
      blogId,
      sortBy,
      sortDirection,
      pageSize,
      skip,
    );
    const presentationalAllPosts = {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: countedDocuments,
      items: allPosts,
    };

    return presentationalAllPosts;
  }
}
