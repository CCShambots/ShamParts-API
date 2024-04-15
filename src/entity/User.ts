import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    passwordHash: string

    @Column()
    @Exclude()
    randomToken: string

    @Column("text", {array: true})
    roles: string[]

    @Column()
    verified: boolean
}