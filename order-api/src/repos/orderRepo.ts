import { Order } from '../models/order';
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
import { mapUserResultSet1 } from '../util/result-set-mapper';

export class OrderRepository implements CrudRepository<Order> {

    async getAll(): Promise<Order[]> {

        let client : PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = 'select * from orders';
            let rs = await client.query(sql);
            return rs.rows.map(mapUserResultSet1);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getById(order_id: number): Promise<Order> {

        let client : PoolClient;
        try{
            client = await connectionPool.connect();
            let sql = 'select * from orders where order_id = $1';
            let rs = await client.query(sql, [order_id]);
            return mapUserResultSet1(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }  
    }

    async getOrderByUniqueKey(key: string, val: string): Promise<Order> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = 'select from orders where order_id = $1';
            let rs = await client.query(sql, [val]);
            return mapUserResultSet1(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async add(newOrd: Order): Promise<Order> {

        let client : PoolClient;
        try {

            client = await connectionPool.connect();
            let sql = 'insert into orders (order_id, order_date, order_comments, user_id) values ($1, $2, $3, $4);';  
            let rs = await client.query(sql, [newOrd.orderId, newOrd.orderDate, newOrd.comments, newOrd.id]);
            return mapUserResultSet1(rs.rows[0]);

        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async update(updateOrd: Order): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = 'update orders set order_date = $2, order_comments = $3, user_id = $4 where order_id = $1;';
            await client.query(sql, [updateOrd.orderId, updateOrd.orderDate, updateOrd.comments, updateOrd.id]);
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
            let sql = 'delete from orders where order_id = $1';
            await client.query(sql, [order_id]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }
}
