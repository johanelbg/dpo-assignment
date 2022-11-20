import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Product {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string

    @Column()
    price: number;

    @Column()
    descText: string;
}