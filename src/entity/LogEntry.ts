import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Compound} from "./Compound";
import {Part} from "./Part";
import {Exclude} from "class-transformer";


type logEntryType = "thumbnailUpload"
    | "thumbnailChange"
    | "camUpload"
    | "camChange"
    | "manufacture"
    | "prep"
    | "break"
    | "request"
    | "fulfill"
    | "assign"
    | "unAssign"
    | "dimensionChange"
    | "typeChange"

@Entity()
export class LogEntry {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: logEntryType

    @CreateDateColumn()
    date: Date

    @Column()
    quantity: number

    @Column()
    message: string

    @Column()
    author: string

    @ManyToOne(type => Compound, compound => compound.logEntries)
    @Exclude()
    compound: Compound

    @ManyToOne(type => Part, part => part.logEntries)
    @Exclude()
    part: Part

    static createLogEntry(type: logEntryType, quantity: number, message: string, author: string) {
        const logEntry = new LogEntry()
        logEntry.type = type
        logEntry.quantity = quantity
        logEntry.message = message
        logEntry.author = author
        logEntry.date = new Date(Date.now())
        return logEntry
    }

    addToPart(part: Part) {
        this.part = part

        if(part.logEntries == undefined) {
            part.logEntries = []
        }
        part.logEntries.push(this)
    }

}