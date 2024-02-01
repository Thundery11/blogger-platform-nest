import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { SortingQueryParams } from '../../blogs/api/models/query/query-for-sorting';
import { PostOutputModel } from '../api/models/output/post-output.model';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}
  async findAllPosts(
    sortingQueryParams: SortingQueryParams,
    blogId: string,
  ): Promise<PostOutputModel[]> {
    const {
      searchNameTerm = '',
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = sortingQueryParams;
    const query = { name: new RegExp(searchNameTerm, 'i') };
    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments = await this.postsRepository.countDocuments(query);
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);
    const allPosts = await this.postsRepository.getAllPosts(
      query,
      sortBy,
      sortDirection,
      pageSize,
      skip,
    );
  }
}
