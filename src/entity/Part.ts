import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {AppDataSource} from "../data-source";
import {Project} from "./Project";
import {Assembly} from "./Assembly";
import {Exclude} from "class-transformer";

@Entity()
export class Part  {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne((type) => Project)
    @JoinColumn()
    @Exclude()
    project: Project

    @ManyToOne((type) => Assembly, )
    @JoinColumn()
    @Exclude()
    assembly: Assembly

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
}