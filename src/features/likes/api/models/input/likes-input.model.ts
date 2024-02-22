import { MyStatus } from '../../../domain/likes.entity';

export class LikesDbType {
  constructor(
    public userId: string,
    public parentId: string,
    public createdAt: string,
    public myStatus: MyStatus,
  ) {}
}

export class LastLikedType {
  constructor(
    public addedAt: string,
    public userId: string,
    public login: string,
    public postId: string,
  ) {}
}
