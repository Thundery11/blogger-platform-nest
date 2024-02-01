import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts, PostsDocument } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { PostOutputModel } from '../api/models/output/post-output.model';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Posts.name) private postsModel: Model<Posts>) {}
  public async createPost(newPost: Posts): Promise<PostsDocument> {
    const createdPost = new this.postsModel(newPost);

    return createdPost.save();
  }
  public async countDocuments(query: object): Promise<number> {
    return await this.postsModel.countDocuments(query);
  }
  public async getAllPosts(
    query: object,
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
  ): Promise<PostOutputModel[]> {
    const posts = await this.postsModel
      .find(query, { _id: 0, __v: 0 })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(pageSize))
      .lean();
    return posts;
  }
}
