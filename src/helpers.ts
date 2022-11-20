import { AppDataSource } from "./app-data-source";
import { OrderPayments } from "./entity/OrderPayments";
import { Orders } from "./entity/Orders";


export const addNewOrderPayment = async (orderId: string) => {
    const orderRepo = AppDataSource.getRepository(Orders)
    const order = await orderRepo.findOne({ where: { id: orderId } })
    const orderPayments = new OrderPayments()
    orderPayments.amount = order.amount
    orderPayments.statusDesc = 'Payed'
    orderPayments.status = 1
    orderPayments.order = order
    await AppDataSource.manager.save(orderPayments)
}