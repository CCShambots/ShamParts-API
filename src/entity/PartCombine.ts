import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Part} from "./Part";
import {Exclude} from "class-transformer";


@Entity()
export class PartCombine {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne((type) => Part)
    @Exclude()
    parent_part: Part

    @Column()
    parent_id: number

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


}