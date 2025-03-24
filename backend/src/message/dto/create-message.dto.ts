import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 'Hello, world!', description: 'Message content' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: 'user-uuid',
    description: 'User ID sending the message',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'room-uuid',
    description: 'Room ID where the message is sent',
  })
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
