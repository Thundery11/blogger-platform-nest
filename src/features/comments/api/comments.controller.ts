import {
  Controller,
  ExecutionContext,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Req,
  Request,
  Headers,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LikesService } from '../../likes/application/likes.service';
import { FindCommentCommand } from '../application/use-cases/find-comment-use-case';
import { CommentsOutputModel } from './models/output/comments-model.output';
@Controller('comments')
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private likesService: LikesService,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findComment(
    @Param('id') commentId: string,
    // @Request() req,
    @Headers() headers,
  ) {
    console.log('headers:', headers);
    if (!headers.authorization) {
      const userId = null;
      const comment: CommentsOutputModel | null = await this.commandBus.execute(
        new FindCommentCommand(userId, commentId),
      );
      console.log('comment: ', comment);
      if (!comment) {
        throw new NotFoundException();
      }
      return comment;
    }
  }
}
