import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
class NewestLikes {
  @Prop()
  addedAt: string;
  @Prop()
  userId: string;
  @Prop()
  login: string;
}

@Schema()
export class ExtendedLikesInfo {
  @Prop({ required: true })
  likesCount: number;
  @Prop({ required: true })
  dislikesCount: number;
  @Prop({ required: true })
  myStatus: string;
  @Prop()
  newestLikes: NewestLikes[];
}

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
