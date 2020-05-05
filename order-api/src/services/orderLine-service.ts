import { OrderLineRepository } from "../repos/orderLineRepo";
import { OrderLine } from "../models/orderLine";
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from "../util/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError,
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError  
} from "../errors/errors";

export class OrderLineService {
    constructor(private orderLineRepo: OrderLineRepository) {
        this.orderLineRepo = orderLineRepo;
    }

    async getAllOrders(): Promise<OrderLine[]> {

        let orders = await this.orderLineRepo.getAll();

        if (orders.length == 0) {
            throw new ResourceNotFoundError();
        }

        return orders; 
    }

    async getOrderById(orderLineId: number): Promise<OrderLine> {
        if (!isValidId(orderLineId)) {
            throw new BadRequestError();
        }
        let order = await this.orderLineRepo.getById();

        if (isEmptyObject(order)) {
            throw new ResourceNotFoundError();
        }
        return order;
    }

    async deleteById(OrderLineId: number): Promise<boolean> {

        if (!isValidId(OrderLineId)) {
            throw new BadRequestError();
        }
        let isDeleted = await this.orderLineRepo.deleteById(OrderLineId);
        return isDeleted;
    }
}