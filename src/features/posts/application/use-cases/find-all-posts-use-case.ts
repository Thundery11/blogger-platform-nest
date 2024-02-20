import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SortingQueryParams } from '../../../blogs/api/models/query/query-for-sorting';
import { AllPostsOutputModel } from '../../api/models/output/post-output.model';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class FindAllPostsCommand {
  constructor(public sortingQueryParams: SortingQueryParams) {}
}

@CommandHandler(FindAllPostsCommand)
export class FindAllPostsUseCase
  implements ICommandHandler<FindAllPostsCommand>
{
  constructor(private postsRepository: PostsRepository) {}
  async execute(command: FindAllPostsCommand): Promise<AllPostsOutputModel> {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = command.sortingQueryParams;
    // const query = {};
    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments = await this.postsRepository.countAllDocuments();
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);

    const allPosts = await this.postsRepository.getAllPosts(
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
