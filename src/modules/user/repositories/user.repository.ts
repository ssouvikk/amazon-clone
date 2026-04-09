import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(user: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, isDeleted: false }).select('+password').exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ _id: id, isDeleted: false }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find({ isDeleted: false }).exec();
  }

  async update(id: string, user: Partial<User>): Promise<UserDocument | null> {
    return this.userModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, user, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.userModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true, deletedAt: new Date() })
      .exec();
  }
}
