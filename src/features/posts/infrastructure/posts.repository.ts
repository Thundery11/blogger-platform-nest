import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts, PostsDocument } from '../domain/posts.entity';
import { Model } from 'mongoose';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Posts.name) private postsModel: Model<Posts>) {}

  public async createPost(newPost: Posts): Promise<PostsDocument> {
    console.log(newPost);
    const createdPost = new this.postsModel(newPost);
    console.log('document', createdPost);
    return createdPost.save();
  }
}
