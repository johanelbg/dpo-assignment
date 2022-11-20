import { Orders } from './entity/Orders'
import { AppDataSource } from "./app-data-source"
import { OrderPayments } from './entity/OrderPayments'
import { Product } from './entity/Product'
import { OrderItems } from './entity/OrderItems'
const data: Array<any> = require('./data.json')


export const init = async () => {
    await insertOrders()
    await insertOrderPayments()
    await insertProduct()
    await insertOrderItems()
}

const insertOrders = async () => {
    data.forEach(async (e, i) => {
        const order = new Orders()
        order.id = e.orderId
        order.orderNo = String(i + 1)
        order.amount = e.amount
        order.descText = e.desc
        order.dateCreated = String(e.created)
        await AppDataSource.manager.save(order)


        // if (e.payments) {
        //     e.payments.forEach(async p => {
        //         const orderRepo = AppDataSource.getRepository(Orders)
        //         const order = await orderRepo.findOne({ where: { id: e.orderId } })
        //         const orderPayments = new OrderPayments()
        //         orderPayments.amount = p.amount
        //         orderPayments.statusDesc = p.statusDesc
        //         orderPayments.status = p.status
        //         orderPayments.order = order
        //         await AppDataSource.manager.save(orderPayments)
        //     })
        // }
    });
}

const insertOrderPayments = async () => {
    data.forEach((e) => {
        if (e.payments) {
            e.payments.forEach(async p => {
                const orderRepo = AppDataSource.getRepository(Orders)
                const order = await orderRepo.findOne({ where: { id: e.orderId } })
                const orderPayments = new OrderPayments()
                orderPayments.amount = p.amount
                orderPayments.statusDesc = p.statusDesc
                orderPayments.status = p.status
                orderPayments.order = order
                await AppDataSource.manager.save(orderPayments)
            })
        }
    });
}


const insertProduct = async () => {
    let items = data.flatMap((e) => {
        return e.items
    }).map(e => e.product)
        .filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)


    await items.forEach(async p => {
        const product = new Product()
        product.id = p.id
        product.name = p.name
        product.price = p.price
        product.descText = p.desc
        await AppDataSource.manager.save(product)
    })
}

const insertOrderItems = async () => {
    data.forEach((e) => {
        e.items.forEach(async i => {
            const productRepo = AppDataSource.getRepository(Product)
            const product = await productRepo.findOne({ where: { id: i.product.id } })

            const orderRepo = AppDataSource.getRepository(Orders)
            const order = await orderRepo.findOne({ where: { id: e.orderId } })
            
            const orderItems = new OrderItems()
            orderItems.order = order
            orderItems.product = product
            await AppDataSource.manager.save(orderItems)
        })
    })
}