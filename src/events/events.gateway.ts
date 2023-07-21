import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventsService } from './events.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(private service: EventsService) {}
  @WebSocketServer()
  server: Server;
  // @SubscribeMessage('joinGroup')
  // handleJoinGroup(client: Socket, chat_id: any): void {
  //   client.join(chat_id);
  // }
  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: any): Promise<void> {
    payload = JSON.parse(payload);
    console.log(payload);
    const { chat_id } = payload;
    const currentDate: Date = new Date();
    const formattedTime: string = this.formatDate(currentDate, 'Europe/Madrid');
    payload.date_time = formattedTime;
    if (payload.type === 'text' || payload.last_message) {
      // insert into db
      await this.sendResponseForText(
        payload,
        chat_id,
        this.service.saveChatMessage.bind(this.service),
      );
      if (chat_id) {
        console.log(chat_id);
        await this.sendResponseForText(
          payload,
          chat_id,
          this.service.ChatMessage.bind(this.service),
        );
      }

      // else {
      //   console.log(payload, '22222222');
      //   await this.sendResponseForText(
      //     payload,
      //     chat_id,
      //     this.service.chatUpdate.bind(this.service),
      //   );
      // }
      this.server.emit(`receiveMessage${chat_id}`, JSON.stringify(payload));
    } else if (payload.type === 'image') {
      await this.sendResponseForImage(payload, chat_id);
      this.server.emit(`receiveMessage${chat_id}`, JSON.stringify(payload));
      // this.sendResponseForImage(payload, chat_id);
    }
  }

  private sendResponseForImage(payload: any, chat_id: any) {
    const response = {
      message: payload.message,
      image_url: payload.image_url,
      receiver_id: payload.receiver_id,
      sender_id: payload.sender_id,
      type: 'image',
      chat_id: payload.chat_id,
    };
    this.server.emit(`receiveMessage${chat_id}`, JSON.stringify(response));
  }

  private async sendResponseForText(
    payload: any,
    chat_id: any,
    saveMessageFn: any,
  ) {
    const messages = await saveMessageFn(payload);
    console.log(messages, '55555555');
  }

  // private async sendResponseForChat(
  //   payload: any,
  //   chat_id: any,
  //   saveMessage: any,
  // ) {
  //   const messages = await saveMessage(payload);
  // }
  //   const hktDate: Date = this.convertToHKT(
  //     messages.created_at,
  //     'Europe/Madrid',
  //   );

  //   // const user_profile_image = await this.service.getPlayerProfileImage(messages.player_id);

  //   let response: any = {
  //     chat_id: 1,
  //     receiver_id: 102,
  //     message: 'Hello',
  //      : 'text',
  //   };
  // }

  //   const hktDate: Date = this.convertToHKT(messages.created_at, 'Europe/Madrid');

  //   const user_profile_image = await this.service.getPlayerProfileImage(messages.player_id);

  //   let response: any = {
  //     message: messages.message,
  //     player_id: messages.player_id,
  //     chat_type: payload.chat_type,
  //     user_profile_image: `https://pro.how2.beer/profile/${user_profile_image.profile_picture}`,
  //     type: 'text',
  //     chat_id,
  //     backColor: true,
  //     date_time: this.formatDate(hktDate, 'Europe/Madrid'),
  //   };

  //   if (isTeamMessage) {
  //     response.team_id = messages.team_id;
  //   }else{
  //     response.team_id = messages.match_id;
  //   }

  //   this.server.emit(`receiveMessage${chat_id}`, JSON.stringify(response));
  // }

  private convertToHKT(dateString: any, timeZone: string): Date {
    const created = new Date(dateString);
    const utcTimestamp = created.getTime();
    const timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const hktTimestamp = utcTimestamp + timeZoneOffset + timeZoneOffset;
    return new Date(hktTimestamp);
  }

  private formatDate(date: Date, timeZone: string): string {
    const options: Intl.DateTimeFormatOptions = {
      timeZone,
      day: '2-digit',
      month: 'short' as const,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);

    const day = parts.find((part) => part.type === 'day')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const hour = parts.find((part) => part.type === 'hour')?.value;
    const minute = parts.find((part) => part.type === 'minute')?.value;
    const period = parts.find((part) => part.type === 'dayPeriod')?.value;

    return `${day} ${month}, ${hour}:${minute} ${period}`;
  }
}
