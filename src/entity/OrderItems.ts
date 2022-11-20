import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Orders } from './Orders'
import { Product } from './Product'

@Entity()
export class OrderItems {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product)
    product: Product

    @ManyToOne(() => Orders)
    order: Orders;
}
