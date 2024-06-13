import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Part} from "./Part";
import {Exclude} from "class-transformer";
import {Compound} from "./Compound";


@Entity()
export class CompoundPart {
    @PrimaryGeneratedColumn()
    id: number

    @Exclude()
    @ManyToOne( type => Compound, compound => compound.parts)
    compound: Compound

    @Column()
    part_id: number

    @Column()
    quantity: number

    part: Part;

    async loadPart() {
        this.part = await Part.getPartFromId(this.part_id);
    }

}