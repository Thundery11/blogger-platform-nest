import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../infrastructure/posts.repository';
export class DeletePostCommand {
  constructor(public id: string) {}
}
@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: DeletePostCommand): Promise<boolean> {
    return await this.postsRepository.deletePost(command.id);
  }
}
