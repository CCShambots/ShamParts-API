import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Part} from "./Part";
import {Exclude} from "class-transformer";
import {Compound} from "./Compound";


@Entity()
export class CompoundPart {
    @PrimaryGeneratedColumn()
    id: number

    @Exclude()
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