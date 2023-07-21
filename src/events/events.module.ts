import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Users } from './users.entity';
import { Messages } from './messages.entity';
import { Chats } from './chats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Messages, Chats])],
  providers: [EventsGateway, EventsService],
  exports: [EventsService], // Make sure to export the EventsService
})
export class EventsModule {}
