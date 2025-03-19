import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async createRoom(data: Prisma.RoomCreateInput) {
    return this.prisma.room.create({ data });
  }

  async getRooms() {
    return this.prisma.room.findMany();
  }

  async getRoomById(id: string) {
    return this.prisma.room.findUnique({ where: { id } });
  }

  async updateRoom(id: string, data: Prisma.RoomUpdateInput) {
    return this.prisma.room.update({ where: { id }, data });
  }

  async deleteRoom(id: string) {
    return this.prisma.room.delete({ where: { id } });
  }
}
