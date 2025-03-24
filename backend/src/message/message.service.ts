import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(data: CreateMessageDto): Promise<Message> {
    return this.prisma.message.create({ data });
  }

  async getMessages(): Promise<Message[]> {
    return this.prisma.message.findMany();
  }

  async getMessageById(id: string): Promise<Message | null> {
    return this.prisma.message.findUnique({ where: { id } });
  }

  async updateMessage(id: string, data: UpdateMessageDto): Promise<Message> {
    return this.prisma.message.update({ where: { id }, data });
  }

  async deleteMessage(id: string): Promise<void> {
    await this.prisma.message.delete({ where: { id } });
  }

  async getMessagesByUser(userId: string): Promise<Message[]> {
    return this.prisma.message.findMany({ where: { userId } });
  }

  async getMessagesByRoom(roomId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { roomId },
      include: { user: true },
    });
  }
}
