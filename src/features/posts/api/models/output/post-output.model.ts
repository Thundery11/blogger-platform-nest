import { PostsDocument } from 'src/features/posts/domain/posts.entity';

class NewestLikes {
  addedAt: string;

  userId: string;

  login: string;
}
class ExtendedLikesInfo {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: string,
    public newestLikes: NewestLikes[],
  ) {}

  static getDefault() {
    return new this(0, 0, 'None', []);
  }
}

export class PostOutputModel {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
    // public extendedLikesInfo: ExtendedLikesInfo,
  ) {}
}

export const postsOutputMapper = (post: PostsDocument): PostOutputModel => {
  const outputModel = new PostOutputModel(
    post.id,
    post.title,
    post.shortDescription,
    post.content,
    post.blogId,
    post.blogName,
    post.createdAt,
    // post.extendedLikesInfo,
  );
  // outputModel.id = post.id;
  // outputModel.title = post.title;
  // outputModel.shortDescription = post.shortDescription;
  // outputModel.content = post.content;
  // outputModel.blogId = post.blogId;
  // outputModel.blogName = post.blogName;
  // outputModel.createdAt = post.createdAt;
  // outputModel.extendedLikesInfo.likesCount = post.extendedLikesInfo.likesCount;
  // outputModel.extendedLikesInfo.dislikesCount =
  //   post.extendedLikesInfo.dislikesCount;
  // outputModel.extendedLikesInfo.myStatus = post.extendedLikesInfo.myStatus;
  // outputModel.extendedLikesInfo.newestLikes =
  //   post.extendedLikesInfo.newestLikes;

  return outputModel;
};
