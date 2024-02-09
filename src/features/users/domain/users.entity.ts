import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UserCreateModel } from '../api/models/input/create-user.input.model';

export type UsersDocument = HydratedDocument<Users>;
export type UsersModelType = Model<UsersDocument> & typeof statics;
@Schema()
export class Users {
  @Prop({ required: true })
  login: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  passwordHash: string;
  @Prop({ required: true })
  passwordSalt: string;
  @Prop({ required: true })
  createdAt: string;
  static createUser(
    usersCreateModel: UserCreateModel,
    createdAt: string,
    passwordHash: string,
    passwordSalt: string,
  ) {
    const user = new this();

    user.login = usersCreateModel.login;
    user.email = usersCreateModel.email;
    user.passwordHash = passwordHash;
    user.passwordSalt = passwordSalt;
    user.createdAt = createdAt;
    return user;
  }
}

export const UsersSchema = SchemaFactory.createForClass(Users);
const statics = {
  createUser: Users.createUser,
};
UsersSchema.statics = statics;
