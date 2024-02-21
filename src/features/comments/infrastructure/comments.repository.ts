import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comments, CommentsDocument } from '../domain/comments.entity';
import { Model } from 'mongoose';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comments.name) private commentsModel: Model<Comments>,
  ) {}
  async createComment(comment: Comments): Promise<CommentsDocument> {
    const createdComment = new this.commentsModel(comment);
    return createdComment.save();
  }
}
