import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User_Entity } from './user.entity';
import { User } from 'proto/user.pb';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User_Entity)
    private readonly userRepository: Repository<User_Entity>,
  
  ) {}

  async saveUser(user: User_Entity): Promise<User_Entity> {
    return await this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User_Entity[]> {
    return await this.userRepository.find();
  }

  async existsByAuthId(authId: number): Promise<boolean> {
    const count = await this.userRepository.count({ where: { auth_id: authId } });
    return count > 0;
    }

  async findByAuthId(authId: number): Promise<User_Entity | null> {
    return await this.userRepository.findOne({ where: { auth_id: authId } });
  }
}