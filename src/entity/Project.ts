import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Assembly} from "./Assembly";
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
    @JoinTable()
    mainAssembly:Assembly

    @ManyToMany((type) => Part, {cascade: true})
    @JoinTable()
    individual_parts: Part[]

}