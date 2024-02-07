import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PostUpdateModel } from '../api/models/input/create-post.input.model';

@Schema()
class NewestLikes1 {
  @Prop()
  addedAt: string;
  @Prop()
  userId: string;
  @Prop()
  login: string;
}
class NewestLikes {
  addedAt: string;
  userId: string;
  login: string;
}
@Schema()
export class ExtendedLikesInfo1 {
  @Prop({ required: true })
  likesCount: number;
  @Prop({ required: true })
  dislikesCount: number;
  @Prop({ required: true })
  myStatus: string;
  @Prop()
  newestLikes: NewestLikes[];
}

export class ExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLikes[];
}
//perepisat posmotret video dimycha mongo with nest
@Schema()
export class Posts {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  shortDescription: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  blogId: string;
  @Prop({ required: true })
  blogName: string;
  @Prop({ required: true })
  createdAt: string;
  @Prop()
  extendedLikesInfo: ExtendedLikesInfo;
  // extendedLikesInfo: ExtendedLikesInfo;

  updatePost(postUpdateModel: PostUpdateModel) {
    if (postUpdateModel.content.length > 1000) {
      throw new Error('Your content is too long');
    }
    this.content = postUpdateModel.content;
    if (postUpdateModel.shortDescription.length > 100) {
      throw new Error('Your content is too long');
    }
    this.shortDescription = postUpdateModel.title;
    if (postUpdateModel.title.length > 30) {
      throw new Error('Your content is too long');
    }
    this.title = postUpdateModel.title;
    this.blogId = postUpdateModel.blogId;
  }
}
// extendedLikesInfo :{
//   @Prop({ required: true })
//   likesCount: number;
//   @Prop({ required: true })
//   dislikesCount: number;
//   @Prop({ required: true })
//   myStatus: string;

//   newestLikes : {
//     @Prop()
//     addedAt: string;
//     @Prop()
//     userId: string;
//     @Prop()
//     login: string;
// }
// }

// extendedLikesInfo: {
//   likesCount: { type: Number, required: true },
//   dislikesCount: { type: Number, required: true },
//   myStatus: { type: String },
//   newestLikes: [
//     {
//       addedAt: { type: String },
//       userId: { type: String },
//       login: { type: String },
//     },
//   ],
// },

export type PostsDocument = HydratedDocument<Posts>;
export const PostsSchema = SchemaFactory.createForClass(Posts);
PostsSchema.methods = {
  updatePost: Posts.prototype.updatePost,
};
