import {Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Part} from "./Part";
import {Project} from "./Project";

@Entity()
export class Assembly {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    onshape_id:string

    @OneToMany((type) => Part, part => part.assembly, {cascade: true})
    @JoinTable()
    parts: Part[]

}