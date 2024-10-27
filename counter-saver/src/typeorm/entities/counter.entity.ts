import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'counters' })
export class Counter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clicks: number;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.counters)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
