import { DataSource } from "typeorm"
import { OrderItems } from "./entity/OrderItems"
import { OrderPayments } from "./entity/OrderPayments"
import {Orders} from './entity/Orders'
import { Product } from "./entity/Product"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "test",
    entities: [Orders, OrderPayments, Product, OrderItems],
    logging: true,
    synchronize: true,
})