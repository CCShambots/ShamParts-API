import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Project} from "./Project";
import {Exclude} from "class-transformer";
import {LogEntry} from "./LogEntry";
import {Part} from "./Part";
import {CompoundPart} from "./CompoundPart";


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
    thumbnailPath: string

    @Exclude()
    @ManyToOne( type => Project, project => project.compounds)
    project: Project

    @Exclude()
    @OneToMany((type) => CompoundPart, entry => entry.compound, {cascade: true})
    parts: CompoundPart[]

    @Column()
    camDone: boolean

    @Column("text", { array: true })
    camInstructions: string[]

    @OneToMany((type) => LogEntry, entry => entry.compound, {cascade: true})
    logEntries: LogEntry[]
}