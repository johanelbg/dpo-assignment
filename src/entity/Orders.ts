import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { OrderPayments } from "./OrderPayments";

@Entity()
export class Orders {
    @PrimaryColumn()
    id: string;

    @Column()
    orderNo: string

    @Column()
    amount: number;

    @Column()
    descText: string;

    @Column()
    dateCreated: string;

    @OneToMany(() => OrderPayments, (p) => p.order)
    orderPayments: OrderPayments[]
}
