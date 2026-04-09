import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document & UserMethods;

export interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
  compareRefreshToken(candidate: string): Promise<boolean>;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, select: false })
  password!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Prop({ default: false })
  isDeleted!: boolean;

  @Prop()
  deletedAt?: Date;

  @Prop({ select: false })
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hooks
UserSchema.pre('save', async function (this: UserDocument) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('refreshToken') && this.refreshToken) {
    this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
  }
});

// Methods
UserSchema.methods['comparePassword'] = async function (
  this: UserDocument,
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods['compareRefreshToken'] = async function (
  this: UserDocument,
  candidate: string,
): Promise<boolean> {
  if (!this.refreshToken) return false;
  return bcrypt.compare(candidate, this.refreshToken);
};
