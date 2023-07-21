import { Chats } from './chats.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  chat_id: number;

  @Column('int')
  sender_id: number;

  @Column('int')
  receiver_id: number;

  @Column('text')
  message: string;

  @Column('text')
  image_url: string;

  @Column('text')
  type: string;

  @Column('text')
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.created_at = new Date();
  }

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'timestamp', default: () => '' })
  deleted_at: Date;

  @BeforeInsert()
  setUpdatedAt() {
    this.updated_at = new Date();
  }
}
