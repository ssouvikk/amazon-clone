import { User, UserDocument } from '../schemas/user.schema';

export interface IUserRepository {
  create(user: Partial<User>): Promise<UserDocument>;
  findByEmail(email: string): Promise<UserDocument | null>;
  findById(id: string): Promise<UserDocument | null>;
  findAll(): Promise<UserDocument[]>;
  update(id: string, user: Partial<User>): Promise<UserDocument | null>;
  delete(id: string): Promise<void>;
}
