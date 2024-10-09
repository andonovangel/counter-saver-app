import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'counters' })
export class Counter {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    clicks: number;

    @Column()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.counters)
    user: User;
}