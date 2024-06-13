import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Project} from "./Project";
import {Exclude} from "class-transformer";
import {LogEntry} from "./LogEntry";
import {Part} from "./Part";
import {CompoundPart} from "./CompoundPart";
import {AppDataSource} from "../data-source";
import {User} from "./User";


@Entity()
export class Compound {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    material: string

    @Column()
    thickness: string

    @Column()
    thumbnail: string

    @Exclude()
    @ManyToOne( type => Project, project => project.compounds)
    project: Project

    @OneToMany((type) => CompoundPart, entry => entry.compound, {cascade: true})
    parts: CompoundPart[]

    @Column()
    camDone: boolean

    @Column("text", { array: true })
    camInstructions: string[]

    @Column({default: ""})
    asigneeName: string

    @Column({type:"int", nullable: true, default: -1})
    asigneeId: number

    @OneToMany((type) => LogEntry, entry => entry.compound, {cascade: true})
    logEntries: LogEntry[]

    setAsignee(asignee: User) {

        this.asigneeName = asignee.name
        this.asigneeId = asignee.id

        //Save user
        AppDataSource.manager.save(asignee)

        //Save compound
        AppDataSource.manager.save(this)
    }

    //Get compound from id
    static async getCompoundFromId(id: string|number) {
        return await AppDataSource.createQueryBuilder(Compound, "compound")
            .leftJoinAndSelect("compound.project", "project")
            .leftJoinAndSelect("compound.parts", "compoundPart")
            .leftJoinAndSelect("compound.logEntries", "logEntry")
            .where("compound.id = :id", {id})
            .getOne();
    }
}