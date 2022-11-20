import * as express from "express"
import { Request, Response } from "express"
import { Brackets } from "typeorm"
import { AppDataSource } from "./app-data-source"
import { Orders } from "./entity/Orders"
import { init } from "./initDatabase"
import createMQProducer from './producer'
import createMQConsumer from './consumer'

const PORT = 3000
const AMQP_URL = 'amqp://localhost:5672'
const QUEUE_NAME = 'payments'

const consumer = createMQConsumer(AMQP_URL, QUEUE_NAME)
// Init consumer 
consumer()

const producer = createMQProducer(AMQP_URL, QUEUE_NAME)

// establish database connection
AppDataSource
    .initialize()
    .then(async () => {
        // fill db with data.json
        await init()
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

// create and setup express app
const app = express()
app.use(express.json())

// get all orders
app.get("/orders", async function (req: Request, res: Response) {
    const orders = await AppDataSource.getRepository(Orders).find()
    res.json(orders)
})

// get paid orders
app.get("/paid", async function (req: Request, res: Response) {
    const orders = await AppDataSource.getRepository(Orders)
        .createQueryBuilder("orders")
        .leftJoinAndSelect("orders.orderPayments", "orderPayments")
        .where("orderPayments.status = 1")
        .andWhere("orderPayments.status != 0")
        .getMany()

    res.json(orders)
})

// get non paid orders
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

// simulate a payment to the first order
app.post("/pay", async function (req: Request, res: Response) {
    const orderId = "39b03c83-6e13-40f1-a185-3561b6a8e6c3"

    const msg = {
        action: 'PAYMENT',
        data: { orderId },
    }
    producer(JSON.stringify(msg))

    return res.send('OK')
})


// start express server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})