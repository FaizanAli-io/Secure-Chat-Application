import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  async createUser(@Body() data: User) {
    return this.userService.createUser(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  async updateUser(@Param('id') id: string, @Body() data: Partial<User>) {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
