import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts, PostsDocument } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { PostOutputModel } from '../api/models/output/post-output.model';
import { PostUpdateModel } from '../api/models/input/create-post.input.model';

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
  async countAllDocumentsForCurrentBlog(blogId: string): Promise<number> {
    return await this.postsModel.countDocuments({ blogId: blogId });
  }
  public async getAllPosts(
    blogId: string,
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
  ): Promise<PostOutputModel[]> {
    const posts = await this.postsModel
      .find({ blogId }, { __v: false, _id: false })
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(pageSize))
      .lean();
    return posts;
  }
  public async updatePost(
    id: string,
    postUpdateModel: PostUpdateModel,
  ): Promise<boolean> {
    const result = await this.postsModel.updateOne({ id }, postUpdateModel);
    return result.matchedCount ? true : false;
  }

  public async save(post: PostsDocument) {
    await post.save();
  }
  public async deletePost(id: string): Promise<boolean> {
    const result = await this.postsModel.deleteOne({ id });
    return result.deletedCount ? true : false;
  }
}
