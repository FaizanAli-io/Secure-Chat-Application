import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Room } from '@prisma/client';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  async createRoom(@Body() data: Room) {
    return this.roomService.createRoom(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  async getRooms() {
    return this.roomService.getRooms();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  async getRoomById(@Param('id') id: string) {
    return this.roomService.getRoomById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update room by ID' })
  async updateRoom(@Param('id') id: string, @Body() data: Partial<Room>) {
    return this.roomService.updateRoom(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete room by ID' })
  async deleteRoom(@Param('id') id: string) {
    return this.roomService.deleteRoom(id);
  }
}
