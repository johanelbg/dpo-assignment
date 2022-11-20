import * as express from "express"
import { Request, Response } from "express"
import { Brackets } from "typeorm"
import { AppDataSource } from "./app-data-source"
import { OrderPayments } from "./entity/OrderPayments"
import { Orders } from "./entity/Orders"
import { init } from "./initDatabase"

// establish database connection
AppDataSource
    .initialize()
    .then(async () => {
        await init()
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

// create and setup express app
const app = express()
app.use(express.json())

// register routes
app.get("/orders", async function (req: Request, res: Response) {
    const orders = await AppDataSource.getRepository(Orders).find()
    res.json(orders)
})

app.get("/paidOrders", async function (req: Request, res: Response) {
    const orders = await AppDataSource.getRepository(Orders)
        .createQueryBuilder("orders")
        .leftJoinAndSelect("orders.orderPayments", "orderPayments")
        .where("orderPayments.status = 1")
        .andWhere("orderPayments.status != 0")
        .getMany()

    res.json(orders)
})


app.get("/nonpaid", async function (req: Request, res: Response) {
    const orders = await AppDataSource.getRepository(Orders)
        .createQueryBuilder("orders")
        .leftJoinAndSelect("orders.orderPayments", "orderPayments")
        .where("orderPayments.id is NULL")
        .orWhere(new Brackets(query => {
            query.where("orderPayments.status = 0")
                .andWhere("orderPayments.status != 1")
        }))
        .getMany()

    res.json(orders)
})


// start express server
app.listen(3000)