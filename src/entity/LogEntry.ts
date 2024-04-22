import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Compound} from "./Compound";
import {Part} from "./Part";

@Entity()
export class LogEntry {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: "thumbnailUpload" | "thumbnailChange" | "camUpload" | "camChange" | "manufacture" | "prep" | "break"

    @CreateDateColumn()
    date: Date

    @Column()
    quantity: number

    @Column()
    message: string

    @ManyToOne(type => Compound, compound => compound.logEntries)
    compound: Compound

    @ManyToOne(type => Part, part => part.logEntries)
    part: Part

}