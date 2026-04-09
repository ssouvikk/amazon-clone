import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(userData: Partial<User>): Promise<UserDocument> {
    const existingUser = await this.userRepository.findByEmail(userData.email!);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    return await this.userRepository.create(userData);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findAllUsers(): Promise<UserDocument[]> {
    return await this.userRepository.findAll();
  }

  async updateProfile(
    id: string,
    updateData: Partial<User>,
  ): Promise<UserDocument> {
    // Prevent role escalation via normal update
    delete updateData.role;
    const user = await this.userRepository.update(id, updateData);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
