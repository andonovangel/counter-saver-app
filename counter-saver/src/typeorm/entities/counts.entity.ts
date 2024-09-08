import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'counts' })
export class Count {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    clicks: number;

    @Column()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.counts)
    user: User;
}