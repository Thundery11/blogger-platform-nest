import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
export type BlogsDocument = HydratedDocument<Blogs>;
@Schema()
export class Blogs {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  id: ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  websiteUrl: string;
  @Prop({ required: true })
  createdAt: string;
  @Prop({ required: true })
  isMembership: boolean;
}
export const BlogsSchema = SchemaFactory.createForClass(Blogs);
