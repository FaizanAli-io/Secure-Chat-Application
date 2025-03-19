import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsString()
  userId: string;

  @IsString()
  roomId: string;
}
