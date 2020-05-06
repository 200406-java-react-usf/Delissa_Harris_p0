import { ProductRepository } from '../repos/productRepo';
import { Product } from '../models/product';
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from '../util/validator';
import { 
    BadRequestError, 
    ResourceNotFoundError,
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError  
} from '../errors/errors';

export class ProductService {
    constructor(private productRepo: ProductRepository) {
        this.productRepo = productRepo;
    }

    async getAllProducts(): Promise<Product[]> {

        let products = await this.productRepo.getAll();

        if (products.length == 0) {
            throw new ResourceNotFoundError();
        }
        return products; 
    }

    async getProductById(prodId: number): Promise<Product> {
        if (!isValidId(prodId)) {
            throw new BadRequestError();
        }
        let product = await this.productRepo.getById(prodId);
        if (isEmptyObject(product)) {
            throw new ResourceNotFoundError();
        }
        return product;
    }

    async add(newProd: Product): Promise<Product> {
        try {
            if (!isValidObject(newProd, 'prodId')) {
                throw new BadRequestError('Invalid property values found in provided order.');
            }
            let product = await this.productRepo.add(newProd);
            return product;
        }
        catch (e) {
            throw e;
        }
    }

    async updateProduct(updatedProd: Product): Promise<boolean> {
        try {
            if (!isValidObject(updatedProd)) {
                throw new BadRequestError('Invalid order provided (invalid values found).');
            }
            return await this.productRepo.update(updatedProd);
        }
        catch (e) {
            throw e;
        }
    }

    async deleteById(prodId: number): Promise<boolean> {
        if (!isValidId(prodId)) {
            throw new BadRequestError();
        }
        let isDeleted = await this.productRepo.deleteById(prodId);
        return isDeleted;
    }
}