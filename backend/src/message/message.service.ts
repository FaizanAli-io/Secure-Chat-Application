import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(data: {
    content: string;
    userId: string;
    roomId: string;
  }) {
    return this.prisma.message.create({
      data: {
        content: data.content,
        user: { connect: { id: data.userId } }, // Connect to existing user
        room: { connect: { id: data.roomId } }, // Connect to existing room
      },
    });
  }

  async getMessages() {
    return this.prisma.message.findMany();
  }

  async getMessageById(id: string) {
    return this.prisma.message.findUnique({ where: { id } });
  }

  async deleteMessage(id: string) {
    return this.prisma.message.delete({ where: { id } });
  }
}
