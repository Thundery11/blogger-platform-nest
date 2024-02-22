import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comments, CommentsDocument } from '../domain/comments.entity';
import { Model, Types } from 'mongoose';
import { CreateCommentInputModel } from '../api/models/input/comments-input.model';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comments.name) private commentsModel: Model<Comments>,
  ) {}
  async createComment(comment: Comments): Promise<CommentsDocument> {
    const createdComment = new this.commentsModel(comment);
    return createdComment.save();
  }
  async updateComment(
    content: CreateCommentInputModel,
    commentId: string,
  ): Promise<CommentsDocument | null> {
    const result = await this.commentsModel.findById(
      new Types.ObjectId(commentId),
    );
    console.log('result:', result);
    if (!result) {
      return null;
    }
    console.log(content);
    Object.assign(result, content);
    return result.save();
    // const result = await this.commentsModel.updateOne(
    //   { _id: new Types.ObjectId(commentId) },
    //   content,
    // );
    // return result.matchedCount === 1 ? true : false;
  }

  async deleteComment(commentId: string): Promise<boolean> {
    const result = await this.commentsModel.deleteOne({
      _id: new Types.ObjectId(commentId),
    });
    return result.deletedCount ? true : false;
  }
}
