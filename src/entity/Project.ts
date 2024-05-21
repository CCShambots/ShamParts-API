import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Part} from "./Part";
import {User} from "./User";
import {JoinTable} from "typeorm";
import {Compound} from "./Compound";
import {Exclude} from "class-transformer";
import {AppDataSource} from "../data-source";
import {LogEntry} from "./LogEntry";
import {PartCombine} from "./PartCombine";

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
            .leftJoinAndSelect("part.compounds", "compound")
            .getOne();

        let logEntries = await AppDataSource.manager
            .createQueryBuilder(LogEntry, "logEntry")
            .innerJoinAndSelect("logEntry.part", "part")
            .getMany();

        let partCombines = await AppDataSource.manager
            .createQueryBuilder(PartCombine, "partCombine")
            .getMany();

        //Load the log info
        if (project) {
            for (let part of project.parts) {
                part.logEntries = logEntries.filter(e => e.part.id === part.id);
                part.part_combines = partCombines.filter(e => e.parent_id === part.id);
            }

        }

        return project;
    }

}