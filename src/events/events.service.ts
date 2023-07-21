import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { Messages } from './messages.entity';
import { Chats } from './chats.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Messages) private messageRepository: Repository<Messages>,
    @InjectRepository(Chats) private chatRepository: Repository<Chats>,
  ) {}

  async getMessages(): Promise<Messages[]> {
    return await this.messageRepository.find();
  }

  async saveChatMessage(message: Messages[]): Promise<Messages[]> {
    try {
      const newChat = this.messageRepository.create(message);
      return await this.messageRepository.save(newChat);
    } catch (err) {
      console.log(err);
    }
  }

  async getChatMessages(): Promise<Chats[]> {
    return await this.chatRepository.find();
  }

  // async ChatMessage(id: number, chat: Partial<Chats>): Promise<Chats> {
  //   try {
  //     // console.log(newChat, '500000');
  //     if (chat.id) {
  //       await this.chatRepository.update(id, chat);
  //     } else {
  //       const newChat = this.chatRepository.create(chat);
  //       return await this.chatRepository.save(newChat);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  async ChatMessage(chat: Partial<Chats[]>): Promise<Chats[]> {
    try {
      const newChat = this.chatRepository.create(chat);
      return await this.chatRepository.save(newChat);
    } catch (err) {
      console.log(err);
    }
  }

  async chatUpdate(id: number, data: Partial<Chats>): Promise<Chats> {
    try {
      await this.chatRepository.update(id, data);
      return this.chatRepository.findOne({ where: { id } });
    } catch (err) {
      console.log(err);
    }
  }

  // async saveTeamMessage(teamMessage): Promise<TeamMessages> {
  //     return this.teamMessagesRepository.save({
  //         team_id: parseInt(teamMessage.team_id),
  //         player_id: teamMessage.player_id,
  //         message: teamMessage.message,
  //         type: '0',
  //         image_url: ''
  //     });
  // }

  // async saveMatchMessage(matchMessage): Promise<MatchMessages> {
  //     return this.matchMessagesRepository.save({
  //         match_id: parseInt(matchMessage.match_id),
  //         player_id: matchMessage.player_id,
  //         message: matchMessage.message,
  //         type: '0',
  //         image_url: ''
  //     });
  // }

  // async update(id: number, user: Partial<Chats[]>): Promise<Chats[]> {
  //   console.log(user);
  //   await this.chatRepository.update(id);
  //   return this.chatRepository.findOne({ where: { id } });
  // }

  // async findOne(id: number): Promise<Chats> {
  //   return this.chatRepository.findOne({ where: { id } });
  // }
  // async update(id: number, user: Partial<Chats>): Promise<Chats> {
  //   await this.chatRepository.update(id, user);
  //   return this.chatRepository.findOne({ where: { id } });
  // }
}
