import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Server {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    ip: string

    @Column()
    name: string
}