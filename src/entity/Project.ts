import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
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
    default_workspace: string

    @OneToOne((type) => Assembly, {cascade: true, nullable: true})
    @JoinColumn()
    main_assembly:Assembly

    @OneToMany((type) => Part, part => part.project, {cascade: true})
    individual_parts: Part[]

}