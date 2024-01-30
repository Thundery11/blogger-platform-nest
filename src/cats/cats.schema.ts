import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Types } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class CatToy {
  @Prop({ required: true })
  toy: string;

  @Prop({ required: true })
  price: string;
}
export const CatToySchema = SchemaFactory.createForClass(CatToy);
@Schema()
export class Cat {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  breed: string;

  @Prop({ required: true })
  tags: string[];

  @Prop({ default: [], type: [CatToySchema] })
  toys: CatToy[];

  setAge(newAge: number) {
    if (newAge <= 0) throw new Error('Bad age value. Should be more, then 0');
    this.age = newAge;
  }
}

export const CatSchema = SchemaFactory.createForClass(Cat);
CatSchema.methods = {
  setAge: Cat.prototype.setAge,
};
