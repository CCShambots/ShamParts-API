import {Column, Double, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Part  {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    number: string

    @Column("text")
    material: string

    @Column('decimal')
    weight: number

    @Column()
    quantityNeeded: number

    @Column()
    quantityInStock: number

    @Column()
    quantityRequested: number
}