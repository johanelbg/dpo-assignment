import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, TableForeignKey } from "typeorm";
import { Orders } from './Orders'

@Entity()
export class OrderPayments {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Orders, order => order.orderPayments)
    order: Orders;

    @Column()
    status: number;

    @Column()
    statusDesc: string;

    @Column()
    amount: number;
}
