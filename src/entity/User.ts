import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer";
import {AppDataSource} from "../data-source";
import {Project} from "./Project";
import {Part} from "./Part";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

    @Column("text", {array: true, default: [], nullable: true})
    @Exclude()
    firebase_tokens: string[]

    @Exclude()
    @Column()
    passwordHash: string

    @Exclude()
    @Column()
    randomToken: string

    @Column("text", {array: true})
    roles: string[]

    @Column()
    verified: boolean

    isAdmin() {
        return this.roles.includes("admin");
    }

    static async getUserFromEmail(email:string) {
        return await AppDataSource.manager
            .createQueryBuilder(User, "user")
            .where("user.email = :email", {email: email})
            .getOne();
    }

    static async getUserFromID(id:string) {
        return await AppDataSource.manager
            .createQueryBuilder(User, "user")
            .where("user.id = :id", {id: id})
            .getOne();
    }

    static async getUserFromRandomToken(token:string) {
        return await AppDataSource.manager
            .createQueryBuilder(User, "user")
            .where("user.randomToken = :token", {token: token})
            .getOne();
    }
}