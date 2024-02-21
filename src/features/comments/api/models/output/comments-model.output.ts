import { MyStatus } from '../../../../likes/domain/likes.entity';
import { CommentsDocument } from '../../../domain/comments.entity';

class LikesInfo {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: string,
  ) {}

  static getDefault() {
    return new this(0, 0, MyStatus.None);
  }
}
class CommentatorInfo {
  constructor(
    public userId: string,
    public userLogin: string,
  ) {}
}

export class CommentsOutputModel {
  constructor(
    public id: string,
    public content: string,
    public commentatorInfo: CommentatorInfo,
    public createdAt: string,
    public likesInfo: LikesInfo,
  ) {}
}

export const commentsOutputMapper = (
  comment: CommentsDocument,
): CommentsOutputModel => {
  const commentatorInfo = new CommentatorInfo(
    comment.commentatorInfo.userId,
    comment.commentatorInfo.userLogin,
  );
  const outputModel = new CommentsOutputModel(
    (comment.id = comment._id.toString()),
    comment.content,
    commentatorInfo,
    comment.createdAt,
    LikesInfo.getDefault(),
  );
  return outputModel;
};