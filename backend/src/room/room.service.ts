import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async createRoom(data: CreateRoomDto): Promise<Room> {
    if (data.userIds.length < 2) {
      throw new BadRequestException('A room must have at least two users.');
    }

    const existingRoom = await this.prisma.room.findUnique({
      where: { name: data.name },
    });

    if (existingRoom) {
      throw new BadRequestException('Room name is already in use.');
    }

    return this.prisma.room.create({
      data: {
        name: data.name,
        users: { create: data.userIds.map((userId) => ({ userId })) },
      },
    });
  }

  async addUserToRoom(roomId: string, userId: string): Promise<void> {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException(`Room with ID ${roomId} not found`);

    await this.prisma.roomUser.create({ data: { roomId, userId } });
  }

  async removeUserFromRoom(roomId: string, userId: string): Promise<void> {
    const roomUser = await this.prisma.roomUser.findFirst({
      where: { roomId, userId },
    });

    if (!roomUser) {
      throw new NotFoundException(
        `User with ID ${userId} is not in Room ${roomId}`,
      );
    }

    await this.prisma.roomUser.delete({
      where: { userId_roomId: { roomId, userId } },
    });
  }

  async getRoomUsers(roomId: string) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException(`Room with ID ${roomId} not found`);

    return this.prisma.user.findMany({
      where: { rooms: { some: { roomId } } },
    });
  }

  async getUserRooms(userId: string): Promise<Room[]> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    return this.prisma.room.findMany({
      where: { users: { some: { userId } } },
    });
  }

  async getRooms(): Promise<Room[]> {
    return this.prisma.room.findMany();
  }

  async getRoomById(id: string): Promise<Room | null> {
    return this.prisma.room.findUnique({ where: { id } });
  }

  async updateRoom(id: string, data: UpdateRoomDto): Promise<Room> {
    return this.prisma.room.update({ where: { id }, data });
  }

  async deleteRoom(id: string): Promise<void> {
    await this.prisma.room.delete({ where: { id } });
  }
}
