import { OrderRepository } from "../repos/orderRepo";
import { Order } from "../models/order";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError,
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError  
} from "../errors/errors";

export class OrderService {
    constructor(private orderRepo: OrderRepository) {
        this.orderRepo = orderRepo;
    }

    async getAllOrders(): Promise<Order[]> {

        let orders = await this.orderRepo.getAll();

        if (orders.length == 0) {
            throw new ResourceNotFoundError();
        }

        return orders; 
    }

    async getOrderById(orderId: number): Promise<Order> {
        if (!isValidId(orderId)) {
            throw new BadRequestError();
        }

        let order = await this.orderRepo.getById(orderId);

        if (isEmptyObject(order)) {
            throw new ResourceNotFoundError();
        }

        return order

    }

    async deleteById(OrderId: number): Promise<boolean> {

        if (!isValidId(OrderId)) {
            throw new BadRequestError();
        }
        let isDeleted = await this.orderRepo.deleteById(OrderId);
        return isDeleted;
    }
}