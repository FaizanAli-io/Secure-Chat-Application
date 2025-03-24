import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: 'General Chat', description: 'Unique room name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: ['user1Id', 'user2Id'],
    description: 'List of user IDs',
  })
  @IsArray()
  @ArrayMinSize(2)
  userIds: string[];
}
