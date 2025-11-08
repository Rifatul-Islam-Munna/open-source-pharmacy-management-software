// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserType {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

@Schema({ timestamps: true, autoIndex: true })
export class User {
  @Prop({  enum: UserType,default: UserType.USER })
  type: UserType;

  @Prop({ required: true })
  ownerName: string;

  @Prop({ required: true })
  shopName: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  ipAddress?: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

