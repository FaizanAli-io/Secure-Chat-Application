import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [PrismaModule, UserModule, RoomModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
