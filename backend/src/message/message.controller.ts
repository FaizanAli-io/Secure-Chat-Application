import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Send a new message' })
  async createMessage(@Body() data: CreateMessageDto) {
    return this.messageService.createMessage(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all messages' })
  async getMessages() {
    return this.messageService.getMessages();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by ID' })
  async getMessageById(@Param('id') id: string) {
    return this.messageService.getMessageById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete message by ID' })
  async deleteMessage(@Param('id') id: string) {
    return this.messageService.deleteMessage(id);
  }
}
