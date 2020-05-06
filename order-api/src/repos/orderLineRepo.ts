import { OrderLine } from '../models/orderLine';
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
import { mapUserResultSet2 } from '../util/result-set-mapper';

export class OrderLineRepository implements CrudRepository<OrderLine> {

    async getAll(): Promise<OrderLine[]> {

        let client : PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = 'select * from order_line';
            let rs = await client.query(sql);
            return rs.rows.map(mapUserResultSet2);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getById(): Promise<OrderLine> {

        let client : PoolClient;
        try{
            client = await connectionPool.connect();
            let sql = 'select * from order_line where product_id = $1';
            let rs = await client.query(sql);
            return mapUserResultSet2(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }  
    }

    async getOrderLineByUniqueKey(key: string, val: string): Promise<OrderLine> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `select * from order_line where order_id = $2 and product_id = $1`;
            let rs = await client.query(sql, [val]);
            return mapUserResultSet2(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async add(newOrd: OrderLine): Promise<OrderLine> {

        let client : PoolClient;
        try {

            client = await connectionPool.connect();
            let sql = 'insert into order_line (product_id, order_id, quantity) values ($1, $2, $3)';  
            let rs = await client.query(sql, [newOrd.prodId, newOrd.orderId, newOrd.quantity]);
            return mapUserResultSet2(rs.rows[0].orderId);

        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async update(updateOrd: OrderLine): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = 'update order_line set quantity = $3 where product_id = $1 and order_id = $2';
            await client.query(sql, [updateOrd.prodId, updateOrd.orderId, updateOrd.quantity]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }
    async deleteById(order_id: number): Promise<boolean> {
        let client : PoolClient;
        try {
            client = await connectionPool.connect();

            let sql = 'delete from order_line where order_id = $2 and product_id = $1';
            await client.query(sql [order_id]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }
}
