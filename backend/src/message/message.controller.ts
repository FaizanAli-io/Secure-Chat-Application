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
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return await this.messageService.createMessage(createMessageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all messages' })
  @ApiResponse({ status: 200, description: 'Return all messages' })
  async getMessages() {
    return this.messageService.getMessages();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by ID' })
  @ApiResponse({ status: 200, description: 'Return message by ID' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async getMessageById(@Param('id') id: string) {
    const message = await this.messageService.getMessageById(id);
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update message by ID' })
  @ApiResponse({ status: 200, description: 'Message updated' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async updateMessage(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    const existingMessage = await this.messageService.getMessageById(id);
    if (!existingMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return await this.messageService.updateMessage(id, updateMessageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete message by ID' })
  @ApiResponse({ status: 204, description: 'Message deleted' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async deleteMessage(@Param('id') id: string) {
    const existingMessage = await this.messageService.getMessageById(id);
    if (!existingMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    await this.messageService.deleteMessage(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all messages sent by a user' })
  @ApiResponse({
    status: 200,
    description: 'Return all messages sent by the user',
  })
  async getMessagesByUser(@Param('userId') userId: string) {
    return this.messageService.getMessagesByUser(userId);
  }

  @Get('room/:roomId')
  @ApiOperation({ summary: 'Get all messages in a room' })
  @ApiResponse({ status: 200, description: 'Return all messages in the room' })
  async getMessagesByRoom(@Param('roomId') roomId: string) {
    return this.messageService.getMessagesByRoom(roomId);
  }
}
