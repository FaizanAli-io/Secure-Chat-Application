import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMessageDto {
  @ApiPropertyOptional({
    example: 'Updated message content',
    description: 'New message content',
  })
  @IsOptional()
  @IsString()
  content?: string;
}
