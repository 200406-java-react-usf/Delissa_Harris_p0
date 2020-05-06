import { OrderService } from '../services/order-service';
import { OrderRepository } from '../repos/orderRepo';
import { Order } from '../models/order';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError } from '../errors/errors';

jest.mock('../repos/orderRepo', () => {
    
    return new class OrderRepository {
            getAll = jest.fn();
            getById = jest.fn();
            save = jest.fn();
            update = jest.fn();
            deleteById = jest.fn();
    };

});
describe('OrderService', () => {

    let sut: OrderService;
    let mockRepo;

    let mockOrders = [
        new Order(1, new Date('2020-05-04 13:07:20'), 'Thank you', 4),
        new Order(2, new Date('2020-03-04 13:07:20'), 'Thanks', 3),
        new Order(3, new Date('2020-04-04 13:07:20'), 'Yes Thank you', 4),
        new Order(4, new Date('2020-02-04 13:07:20'), 'Thank you', 5),
        new Order(5, new Date('2020-01-04 13:07:20'), 'Thank you', 3),
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn()
            };
        });

        // @ts-ignore
        sut = new OrderService(mockRepo);
    
    });

    test('should resolve to Order[] when getAll() successfully retrieves orders from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockOrders);

        // Act
        let result = await sut.getAllOrders();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
        //result.forEach(val => expect(val.password).toBeUndefined());

    });

    test('should reject with ResourceNotFoundError when getAllOrders fails to get any users from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllOrders();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Order when getOrderById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(2);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Order>((resolve) => resolve(mockOrders[id - 1]));
        });


        // Act
        let result = await sut.getOrderById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.orderId).toBe(1);

    });

    test('should reject with BadRequestError when getOrderById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getOrderById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getOrderById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getOrderById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getOrderById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getOrderById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getOrderById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getOrderById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getByid is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getOrderById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });
    test('Should add a New Order', async () => {
        // Arrange
         expect.hasAssertions();
 
         // Arrange 
         let mockOrder=  new Order(6, new Date(2000-12-12), 'nnoboby', 2);
         mockRepo.add = jest.fn().mockReturnValue(true);
 
         // Act
         let result = await sut.addNewOrder(mockOrder);
         expect(result).toBeTruthy();
     });
     test('Should Update Order', async () => {
        // Arrange
         expect.hasAssertions();
 
         // Arrange 
         let mockOrder=  new Order(6, new Date(null), 'nnoboby', 2);
         mockRepo.update = jest.fn().mockReturnValue(true);
 
         // Act
         let result = await sut.updateOrder(mockOrder);
         expect(result).toBeTruthy();
     });

     test('Should Delete Order', async () => {
        // Arrange
         expect.hasAssertions();
 
         // Arrange 
         let mockOrder=  new Order(6, new Date(null), 'nnoboby', 2);
         mockRepo.deleteById= jest.fn().mockReturnValue(true);
 
         // Act
         let result = await sut.deleteById(6);
         expect(result).toBeTruthy();
     });

     test('should reject with BadRequestError when deletebyid is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.deleteById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.deleteById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });
});