import { User, UserDocument } from '../schemas/user.schema';

export interface IUserService {
  createUser(userData: Partial<User>): Promise<UserDocument>;
  getUserByEmail(email: string): Promise<UserDocument | null>;
  getUserById(id: string): Promise<UserDocument>;
  getAllUsers(): Promise<UserDocument[]>;
  updateUser(id: string, updateData: Partial<User>): Promise<UserDocument>;
  deleteUser(id: string): Promise<void>;
}
