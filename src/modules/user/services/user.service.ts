import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TOKENS } from '../../../shared/constants/tokens';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { User, UserDocument } from '../schemas/user.schema';
import { IUserService } from '../interfaces/user.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async createUser(userData: Partial<User>): Promise<UserDocument> {
    const existingUser = await this.userRepository.findByEmail(userData.email!);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    return await this.userRepository.create(userData);
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return await this.userRepository.findByEmail(email);
  }

  async getUserById(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return await this.userRepository.findAll();
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<UserDocument> {
    // Prevent role escalation via normal update
    delete updateData.role;
    const user = await this.userRepository.update(id, updateData);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
