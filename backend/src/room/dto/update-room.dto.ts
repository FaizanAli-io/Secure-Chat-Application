import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRoomDto {
  @ApiPropertyOptional({
    example: 'Updated Room Name',
    description: 'New room name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
