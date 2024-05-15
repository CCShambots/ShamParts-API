import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Part} from "./Part";
import {User} from "./User";
import {JoinTable} from "typeorm";
import {Compound} from "./Compound";
import {Exclude} from "class-transformer";

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

    @Column("text", {array: true})
    admin_roles: string[]

    @Column("text", {array: true})
    write_roles: string[]

    @Column("text", {array: true})
    read_roles: string[]

    @OneToMany((type) => Part, part => part.project, {cascade: true})
    parts: Part[]

    @OneToMany((type) => Part, part => part.project, {cascade: true})
    individual_parts: Part[]

    @JoinTable()
    @ManyToMany(type => User)
    @Exclude()
    users: User[]

    @OneToMany((type) => Compound, compound => compound.project, {cascade: true})
    compounds: Compound[]
}