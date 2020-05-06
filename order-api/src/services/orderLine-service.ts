import { OrderLineRepository } from '../repos/orderLineRepo';
import { OrderLine } from '../models/orderLine';
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from '../util/validator';
import { 
    BadRequestError, 
    ResourceNotFoundError,
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError  
} from '../errors/errors';

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

    async getOrderById(orderId: number): Promise<OrderLine> {
        if (!isValidId(orderId)) {
            throw new BadRequestError();
        }
        let order = await this.orderLineRepo.getById();

        if (isEmptyObject(order)) {
            throw new ResourceNotFoundError();
        }
        return order;
    }

   
    async addNewOrder(newOrder: OrderLine): Promise<OrderLine> {
        try {
        if (!isValidObject(newOrder, 'orderId') && !isValidObject(newOrder, 'prodId') ) {
            throw new BadRequestError('Invalid property values found in provided orderLine.');
        }
    
        let orderline = await this.orderLineRepo.add(newOrder);
        return orderline;
    }
    catch (e) {
        throw e;
    }
}

    async updateOrder(updatedOrder: OrderLine): Promise<boolean> {
        try {

            if (!isValidObject(updatedOrder)) {
                throw new BadRequestError('Invalid order provided (invalid values found).');
            }
            // let repo handle some of the other checking since we are still mocking db
            return await this.orderLineRepo.update(updatedOrder);
        } catch (e) {
            throw e;
        }
    }

    async deleteById(orderId: number): Promise<boolean> {

        if (!isValidId(orderId)) {
            throw new BadRequestError();
        }
        let isDeleted = await this.orderLineRepo.deleteById(orderId);
        return isDeleted;
    }
}

