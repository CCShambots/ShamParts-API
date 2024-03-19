import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Part} from "./Part";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    onshape_id: string

    @Column()
    default_workspace: string

    @Column()
    assembly_name: string

    @Column()
    assembly_onshape_id:string

    @OneToMany((type) => Part, part => part.project, {cascade: true})
    parts: Part[]

    @OneToMany((type) => Part, part => part.project, {cascade: true})
    individual_parts: Part[]

}