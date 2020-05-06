import { ProductService } from '../services/product-service';
import { ProductRepository } from '../repos/productRepo';
import { Product } from '../models/product';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError } from '../errors/errors';

jest.mock('../repos/productRepo', () => {
    
    return new class ProductRepository {
            getAll = jest.fn();
            getById = jest.fn();
            save = jest.fn();
            update = jest.fn();
            deleteById = jest.fn();
    };

});
describe('ProductService', () => {

    let sut: ProductService;
    let mockRepo;

    let mockProducts = [
        new Product(1, 'Predator: Hunting Grounds - PlayStation 4', 'Predator: Hunting Grounds is an immersive asymmetrical multiplayer* shooter set in the remote jungles of the world, where the Predator stalks the most challenging prey.', 39.99),
        new Product(2, 'Predator: Hunting Grounds - PlayStation 4', 'Predator: Hunting Grounds is an immersive asymmetrical multiplayer* shooter set in the remote jungles of the world, where the Predator stalks the most challenging prey.', 39.99),
        new Product(3, 'Predator: Hunting Grounds - PlayStation 4', 'Predator: Hunting Grounds is an immersive asymmetrical multiplayer* shooter set in the remote jungles of the world, where the Predator stalks the most challenging prey.', 39.99),
        new Product(4, 'Predator: Hunting Grounds - PlayStation 4', 'Predator: Hunting Grounds is an immersive asymmetrical multiplayer* shooter set in the remote jungles of the world, where the Predator stalks the most challenging prey.', 39.99),
        new Product(5, 'Predator: Hunting Grounds - PlayStation 4', 'Predator: Hunting Grounds is an immersive asymmetrical multiplayer* shooter set in the remote jungles of the world, where the Predator stalks the most challenging prey.', 39.99)
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
        sut = new ProductService(mockRepo);
    
    });

    test('should resolve to Product[] when getAll() successfully retrieves products from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockProducts);

        // Act
        let result = await sut.getAllProducts();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
        //result.forEach(val => expect(val.password).toBeUndefined());

    });

    test('should reject with ResourceNotFoundError when getAllProducts fails to get any users from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllProducts();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });


    test('should resolve to Product when getProductById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(2);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((prodId: number) => {
            return new Promise<Product>((resolve) => resolve(mockProducts[prodId - 1]));
        });


        // Act
        let result = await sut.getProductById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.prodId).toBe(1);

    });

    test('should reject with BadRequestError when getProductById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getProductById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getProductById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getProductById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getProductById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getProductById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getProductById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getProductById(-2);
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
            await sut.getProductById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('Should add a New Product', async () => {
        // Arrange
         expect.hasAssertions();
 
         // Arrange
         let mockProduct =  new Product(5, 'nnoboby', 'whatever', 15.00);
         mockRepo.add = jest.fn().mockReturnValue(true);
 
         // Act
         let result = await sut.add(mockProduct);
         expect(result).toBeTruthy();
     });

     test('Should update Product', async () => {
        // Arrange
         expect.hasAssertions();
 
         // Arrange
         let mockProduct =  new Product(5, 'Sir', 'whatever', 15.00);
         mockRepo.update = jest.fn().mockReturnValue(true);
 
         // Act
         let result = await sut.updateProduct(mockProduct);
         expect(result).toBeTruthy();
     });


     test('Should delete Product', async () => {
        // Arrange
         expect.hasAssertions();
 
         // Arrange
         let mockProduct =  new Product(5, 'Sir', 'whatever', 15.00);
         mockRepo.deleteById = jest.fn().mockReturnValue(true);
 
         // Act
         let result = await sut.deleteById(5);
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