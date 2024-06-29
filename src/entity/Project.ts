import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Part} from "./Part";
import {User} from "./User";
import {JoinTable} from "typeorm";
import {Compound} from "./Compound";
import {Exclude} from "class-transformer";
import {AppDataSource} from "../data-source";
import {LogEntry} from "./LogEntry";
import {PartCombine} from "./PartCombine";
import {CompoundPart} from "./CompoundPart";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({default : new Date()})
    lastSyncDate: Date

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

    @JoinTable()
    @ManyToMany(type => User)
    @Exclude()
    users: User[]

    @OneToMany((type) => Compound, compound => compound.project, {cascade: true})
    compounds: Compound[]

    getAllRoles() {
        //Concatenate read, write, and admin roles together
        return this.admin_roles.concat(this.write_roles).concat(this.read_roles)
    }

    userHasAccess(user:User) {
        //Check if the user has any roles that are included on this project

        return this.getAllRoles().some(role => user.roles.includes(role)) || user.roles.includes('admin');
    }

    userCanWrite(user:User) {
        //Check if the user has any roles that are included on this project
        return this.write_roles.concat(this.admin_roles).some(role => user.roles.includes(role)) || user.roles.includes('admin');
    }

    userIsAdmin(user:User) {
        return this.admin_roles.some(role => user.roles.includes(role)) || user.roles.includes('admin');
    }

    static async loadProject(name:string) {
        let project = await AppDataSource.manager
            .createQueryBuilder(Project, "project")
            .where("project.name = :name", {name: name})
            .innerJoinAndSelect("project.parts", "part")
            .leftJoinAndSelect("project.compounds", "compound")
            .leftJoinAndSelect("compound.parts", "compoundPart")
            .getOne();

        let logEntries = await AppDataSource.manager
            .createQueryBuilder(LogEntry, "logEntry")
            .leftJoinAndSelect("logEntry.part", "part")
            .leftJoinAndSelect("logEntry.compound", "compound")
            .getMany();

        let partCombines = await AppDataSource.manager
            .createQueryBuilder(PartCombine, "partCombine")
            .getMany();

        //Load the log info
        if (project) {
            for (let part of project.parts) {
                part.logEntries = logEntries.filter(e => e.part !=null).filter(e => e.part.id === part.id);
                part.part_combines = partCombines.filter(e => e.parent_id === part.id);
            }

            for (let compound of project.compounds) {
                compound.logEntries = logEntries.filter(e => e.compound != null).filter(e => e.compound.id === compound.id)
            }

        }

        return project;
    }

}