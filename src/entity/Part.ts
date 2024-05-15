import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {AppDataSource} from "../data-source";
import {Project} from "./Project";
import {Exclude} from "class-transformer";
import {LogEntry} from "./LogEntry";
import {User} from "./User";
import {assignUser} from "../controllers/part.controller";

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
    dimension1: String

    @Column()
    dimension2: String

    @Column()
    dimension3: String

    @Column()
    onshape_element_id: string

    @Column()
    onshape_part_id: string

    @Column()
    onshape_document_id: string

    @Column()
    onshape_wvm_id: string

    @Column()
    onshape_wvm_type: string

    @Column()
    quantityNeeded: number

    @Column()
    quantityInStock: number

    @Column()
    quantityRequested: number

    @OneToMany((type) => LogEntry, entry => entry.part, {cascade: true})
    logEntries: LogEntry[]


    @Column({default: ""})
    asigneeName: string

    @Column({type:"int", nullable: true})
    asigneeId: number

    setAsignee(asignee: User) {

        this.asigneeName = asignee.name
        this.asigneeId = asignee.id

        //Save user
        AppDataSource.manager.save(asignee)

        //Save part
        AppDataSource.manager.save(this)
    }

    static async getPartsInDB()  {
        return await AppDataSource.createQueryBuilder(Part, "part")
            .getMany();
    }

    static async getPartFromId(id: string) {
        return await AppDataSource.createQueryBuilder(Part, "part")
            .leftJoinAndSelect("part.project", "project")
            .leftJoinAndSelect("part.logEntries", "logEntries")
            .where("part.id = :id", {id: id})
            .getOne();

    }
}