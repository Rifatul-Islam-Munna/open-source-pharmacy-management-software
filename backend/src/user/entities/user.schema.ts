// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserType {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
  WORKER= 'worker'
}

@Schema({ timestamps: true, autoIndex: true })
export class User {
  @Prop({  enum: UserType,default: UserType.USER })
  type: UserType;

  @Prop({required:false})
  ownerName: string;

  @Prop()
  shopName: string;
  @Prop()
  mobileNumber: string;

  @Prop()
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

  @Prop()
  workerSlug?: string // this should be original slug of wwoner for db check ok

  @Prop()
  shopId?: string
  @Prop()
  workerName?: string


}

export const UserSchema = SchemaFactory.createForClass(User);

