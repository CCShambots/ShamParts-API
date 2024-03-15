import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Part} from "./Part";

@Entity()
export class Assembly {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    onshape_id:string

    @ManyToMany((type) => Part, {cascade: true})
    @JoinTable()
    parts: Part[]

}