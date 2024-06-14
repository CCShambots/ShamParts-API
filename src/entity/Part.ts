import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {AppDataSource} from "../data-source";
import {Project} from "./Project";
import {Exclude} from "class-transformer";
import {LogEntry} from "./LogEntry";
import {User} from "./User";
import {PartCombine} from "./PartCombine";
import {Compound} from "./Compound";

export type partType = "compound" | "plate" | "tube" | "shaft" | "spacer" | "other"

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

    @Column({default: 0})
    dimension1: String

    @Column({default: 0})
    dimension2: String

    @Column({default: 0})
    dimension3: String

    @Column({default: false})
    dimensionsOverride: boolean

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

    @OneToMany((type) => PartCombine, combine => combine.parent_part, {cascade: true})
    part_combines: PartCombine[]

    @ManyToMany((type) => Compound, compound => compound.parts)
    @Exclude()
    compounds: Compound[]

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

    @Column({default: "other"})
    partType: string

    @Column({default: false})
    camDone: boolean

    @Column("text", { array: true, default: [], nullable: true})
    camInstructions: string[]

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

    static async getPartFromId(id: string|number) {
        return await AppDataSource.createQueryBuilder(Part, "part")
            .leftJoinAndSelect("part.project", "project")
            .leftJoinAndSelect("part.logEntries", "logEntries")
            .leftJoinAndSelect("part.part_combines", "part_combines")
            .where("part.id = :id", {id: id})
            .getOne();

    }
}