import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {AppDataSource} from "../data-source";
import {Project} from "./Project";
import {Exclude} from "class-transformer";
import {LogEntry} from "./LogEntry";

@Entity()
export class Part  {
    @PrimaryGeneratedColumn()
    id: number

    @Exclude()
    @ManyToOne((type) => Project)
    @JoinColumn()
    project: Project

    @Column()
    number: string

    @Column("text")
    material: string

    @Column()
    thumbnail: string

    @Column()
    onshape_id: string

    @Column()
    quantityNeeded: number

    @Column()
    quantityInStock: number

    @Column()
    quantityRequested: number
    static async getPartsInDB()  {
        return await AppDataSource.createQueryBuilder(Part, "part")
            .getMany();
    }

    @OneToMany((type) => LogEntry, entry => entry.part, {cascade: true})
    logEntries: LogEntry[]
}