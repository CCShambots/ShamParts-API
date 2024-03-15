import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Part  {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    number: string

    @Column("text")
    material: string

    @Column()
    quantityNeeded: number

    @Column()
    quantityInStock: number

    @Column()
    quantityRequested: number
}