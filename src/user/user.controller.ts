import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';
import type {User,GetUserRequest, UserResponse,  RegisterResponse, RegisterRequest } from 'proto/user.pb';
import { USER_SERVICE_NAME } from 'proto/user.pb';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { User_Entity } from './user.entity';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  // ========== REGISTER ==========
  @GrpcMethod(USER_SERVICE_NAME, 'Register')
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const exists = await this.userService.existsByAuthId(data.id);
    if (exists) return { success: false };
    const userMoi = new User_Entity();

    userMoi.auth_id = data.id;
    userMoi.vang = 0;
    userMoi.sucManh = 2000;

    const user = await this.userService.saveUser(userMoi);
    return { success: true };
  }

  // ========== PROFILE ==========
  @GrpcMethod(USER_SERVICE_NAME, 'GetProfile')
  async getProfile(data: GetUserRequest) : Promise<UserResponse> {
    const user = await this.userService.findByAuthId(data.id);
    if (!user) throw new RpcException({code: status.UNAUTHENTICATED ,message: 'User không tồn tại'});
    return  { user: user };
  }

  // ========== SAVE GAME ==========
  @GrpcMethod(USER_SERVICE_NAME, 'SaveGame')
  async saveGame(data: { user: User }) {
    const { user } = data;
    const found = await this.userService.findByAuthId(user.auth_id);
    if (!found) throw new RpcException({code: status.UNAUTHENTICATED ,message: 'User không tồn tại'});

    user.vang = data.user.vang;
    user.sucManh = data.user.sucManh;

    await this.userService.saveUser(found);
    return { message: 'Lưu dữ liệu game thành công!' };
  }
}