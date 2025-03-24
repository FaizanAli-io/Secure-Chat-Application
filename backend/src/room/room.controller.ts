import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room with at least two users' })
  @ApiResponse({ status: 201, description: 'Room created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(createRoomDto);
  }

  @Post(':roomId/users/:userId')
  @ApiOperation({ summary: 'Add a user to a room' })
  @ApiResponse({ status: 201, description: 'User added to room' })
  async addUserToRoom(
    @Param('roomId') roomId: string,
    @Param('userId') userId: string,
  ) {
    return this.roomService.addUserToRoom(roomId, userId);
  }

  @Delete(':roomId/users/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a user from a room' })
  @ApiResponse({ status: 204, description: 'User removed from room' })
  async removeUserFromRoom(
    @Param('roomId') roomId: string,
    @Param('userId') userId: string,
  ) {
    return this.roomService.removeUserFromRoom(roomId, userId);
  }

  @Get(':roomId/users')
  @ApiOperation({ summary: 'Get all users in a room' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getRoomUsers(@Param('roomId') roomId: string) {
    return this.roomService.getRoomUsers(roomId);
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get all rooms a user is in' })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserRooms(@Param('userId') userId: string) {
    return this.roomService.getUserRooms(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, description: 'Return all rooms' })
  async getRooms() {
    return this.roomService.getRooms();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiResponse({ status: 200, description: 'Return room by ID' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async getRoomById(@Param('id') id: string) {
    const room = await this.roomService.getRoomById(id);
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update room by ID' })
  @ApiResponse({ status: 200, description: 'Room updated' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 409, description: 'Room name already exists' })
  async updateRoom(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    try {
      const existingRoom = await this.roomService.getRoomById(id);
      if (!existingRoom) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }

      return await this.roomService.updateRoom(id, updateRoomDto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Room name already exists');
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete room by ID' })
  @ApiResponse({ status: 204, description: 'Room deleted' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async deleteRoom(@Param('id') id: string) {
    const existingRoom = await this.roomService.getRoomById(id);
    if (!existingRoom) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    await this.roomService.deleteRoom(id);
  }
}
