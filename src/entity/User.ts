import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Exclude} from "class-transformer";
import {AppDataSource} from "../data-source";
import {Project} from "./Project";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email: string

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

    @Exclude()
    @ManyToMany(type => Project, project => project.users)
    projects: Project[]

    static async getUserFromEmail(email:string) {
        return await AppDataSource.manager
            .createQueryBuilder(User, "user")
            .where("user.email = :email", {email: email})
            .getOne();
    }

    static async getUserFromRandomToken(token:string) {
        return await AppDataSource.manager
            .createQueryBuilder(User, "user")
            .where("user.randomToken = :token", {token: token})
            .getOne();
    }
}