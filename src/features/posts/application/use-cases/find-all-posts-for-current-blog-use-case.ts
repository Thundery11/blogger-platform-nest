import { Types } from 'mongoose';
import { SortingQueryParams } from '../../../blogs/api/models/query/query-for-sorting';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/blogs.query-repository';
import { AllPostsOutputModel } from '../../api/models/output/post-output.model';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
export class FindAllPostsForCurrentBlogCommand {
  constructor(
    public sortingQueryParams: SortingQueryParams,
    public blogId: string,
  ) {}
}
@CommandHandler(FindAllPostsForCurrentBlogCommand)
export class FindAllPostsForCurrentBlogUseCase
  implements ICommandHandler<FindAllPostsForCurrentBlogCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}
  async execute(
    command: FindAllPostsForCurrentBlogCommand,
  ): Promise<AllPostsOutputModel | null> {
    const { sortingQueryParams, blogId } = command;
    const {
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

    const isBlogExist = await this.blogsQueryRepository.getBlogById(
      new Types.ObjectId(blogId),
    );
    if (!isBlogExist) {
      return null;
    }

    const allPosts = await this.postsRepository.getAllPostsForCurrentBlog(
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
