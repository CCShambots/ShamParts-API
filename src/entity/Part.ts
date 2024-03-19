import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {AppDataSource} from "../data-source";
import {Project} from "./Project";
import {Exclude} from "class-transformer";

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

    toJSON() {
        return {
            id: this.id,
            number: this.number,
            material: this.material,
            thumbnail: this.thumbnail,
            onshape_id: this.onshape_id,
            quantityNeeded: this.quantityNeeded,
            quantityInStock: this.quantityInStock,
            quantityRequested: this.quantityRequested
        }

    }

    static async getPartsInDB()  {
        return await AppDataSource.createQueryBuilder(Part, "part")
            .getMany();
    }
}