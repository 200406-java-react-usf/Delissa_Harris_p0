import { Product } from '../models/product';
import { CrudRepository } from './crud-repo';
import { 
    BadRequestError, 
    ResourceNotFoundError,
    ResourcePersistenceError,
    NotImplementedError,
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapUserResultSet3 } from '../util/result-set-mapper';

export class ProductRepository implements CrudRepository<Product> {

    async getAll(): Promise<Product[]> {
        let client : PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = 'select * from products';
            let rs = await client.query(sql);
            return rs.rows.map(mapUserResultSet3);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getById(product_id: number): Promise<Product> {
        let client : PoolClient;
        try{
            client = await connectionPool.connect();
            let sql = 'select * from products where product_id = $1';
            let rs = await client.query(sql, [product_id]);
            return mapUserResultSet3(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }  
    }

    async add(newProd: Product): Promise<Product> {
        let client : PoolClient;
        try {

            client = await connectionPool.connect();
            let sql = 'insert into products (product_id, product_name, description, product_cost) values ($1, $2, $3, $4);';  
            let rs = await client.query(sql, [newProd.prodId, newProd.name, newProd.description, newProd.cost]);
            return mapUserResultSet3(rs.rows[0].prodId);

        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async update(updateProd: Product): Promise<boolean> {
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = 'update products set product_name = $2, description = $3, product_cost = $4 where product_id = $1;';  
            await client.query(sql, [updateProd.prodId, updateProd.name, updateProd.description, updateProd.cost]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
            
    }
        
    async deleteById(product_id: number): Promise<boolean> {
        let client : PoolClient;
        try {
        
            client = await connectionPool.connect();
            let sql = 'delete from products where product_id = $1';
            await client.query(sql, [product_id]);   
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }
}
