import { ProductRepository } from '../repos/productRepo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Product } from '../models/product';
import {  BadRequestError, 
    ResourceNotFoundError,
    InternalServerError
} from '../errors/errors';

/*
    We need to mock the connectionPool exported from the main module
    of our application. At this time, we only use one exposed method
    of the pg Pool API: connect. So we will provide a mock function 
    in its place so that we can mock it in our tests.
*/
jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    };
});

// The result-set-mapper module also needs to be mocked
jest.mock('../util/result-set-mapper', () => {
    return {
        mapUserResultSet3: jest.fn()
    };
});

describe('productRepo', () => {

    let sut = new ProductRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        /*
            We can provide a successful retrieval as the default mock implementation
            since it is very verbose. We can provide alternative implementations for
            the query and release methods in specific tests if needed.
        */
        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                prodId: 1,
                                name: 'Predator: Hunting Grounds - PlayStation 4',
                                description: 'Predator: Hunting Grounds is an immersive asymmetrical multiplayer* shooter set in the remote jungles of the world, where the Predator stalks the most challenging prey.',
                                cost: 39.99
                            }
                        ]
                    };
                }), 
                release: jest.fn()
            };
        });
        (mockMapper.mapUserResultSet3 as jest.Mock).mockClear();
    });

    test('should resolve to an array of Product when getAll retrieves records from data source', async () => {
        
        // Arrange
        //expect.hasAssertions();

        let mockProduct = new Product(1, 'Predator: Hunting Grounds - PlayStation 4', 'Predator: Hunting Grounds is an immersive asymmetrical multiplayer* shooter set in the remote jungles of the world, where the Predator stalks the most challenging prey.', 39.99);
        (mockMapper.mapUserResultSet3 as jest.Mock).mockReturnValue(mockProduct);

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAll retrieves no records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to a Product object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockProduct = new Product(1, 'Predator: Hunting Grounds - PlayStation 4', 'Predator: Hunting Grounds is an immersive asymmetrical multiplayer* shooter set in the remote jungles of the world, where the Predator stalks the most challenging prey.', 39.99);
        (mockMapper.mapUserResultSet3 as jest.Mock).mockReturnValue(mockProduct);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Product).toBe(true);

    });
    test('should throw InternalServerError for getByID is invalid', async () => {

        // Arrange
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { }), 
                release: jest.fn()
            }
        });

        // Act
        try{
        let result = await sut.getById(-1);
        }
        // Assert
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should throw InternalServerError when add is invalid', async () => {

        // Arrange
        let mockProduct = new Product(1, 'Predator: Hunting Grounds - PlayStation 4', 'Predator: Hunting Grounds is an immersive asymmetrical multiplayer* shooter set in the remote jungles of the world, where the Predator stalks the most challenging prey.', 39.99);
        (mockMapper.mapUserResultSet3 as jest.Mock).mockReturnValue(mockProduct);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { }), 
                release: jest.fn()
            }
        });

        // Act
        try{
        let result = await sut.add(mockProduct);
        }
        // Assert
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
    });

    test('should throw InternalServerError when delete is invalid', async () => {

        // Arrange
        let mockProduct = new Product(1, 'Predator: Hunting Grounds - PlayStation 4', 'Predator: Hunting Grounds is an immersive asymmetrical multiplayer* shooter set in the remote jungles of the world, where the Predator stalks the most challenging prey.', 39.99);
        (mockMapper.mapUserResultSet3 as jest.Mock).mockReturnValue(mockProduct);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { }), 
                release: jest.fn()
            }
        });

        // Act
        try{
        let result = await sut.deleteById(9);
        }
        // Assert
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
    });
    
    test('should throw InternalServerError when update is invalid', async () => {

        // Arrange
        let mockProduct = new Product(1, 'Predator: Hunting Grounds - PlayStation 4', 'Predator: Hunting Grounds is an immersive asymmetrical multiplayer* shooter set in the remote jungles of the world, where the Predator stalks the most challenging prey.', 39.99);
        (mockMapper.mapUserResultSet3 as jest.Mock).mockReturnValue(mockProduct);
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { }), 
                release: jest.fn()
            }
        });

        // Act
        try{
        let result = await sut.update(mockProduct);
        }
        // Assert
        catch(e){
            expect(e instanceof InternalServerError).toBe(true);
        }
    });
});