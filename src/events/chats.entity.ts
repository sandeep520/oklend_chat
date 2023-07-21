import { Messages } from './messages.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Chats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  sender_id: number;

  @Column('int')
  receiver_id: number;

  @Column('text')
  last_message: string;

  @Column('varchar')
  last_message_time: string;

  @Column('text')
  type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.created_at = new Date();
  }

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeInsert()
  setUpdatedAt() {
    this.updated_at = new Date();
  }
}
