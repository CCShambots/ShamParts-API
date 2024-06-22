import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer";

@Entity()
export class Server {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    ip: string

    @Column()
    name: string

    @Column()
    key: string;

    @Column({default: false})
    verified: boolean

    @Column({default: ""})
    @Exclude()
    random_token: string
}