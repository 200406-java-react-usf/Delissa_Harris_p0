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
            let sql = `select * from orders`;
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
            let sql = `select * from orders where order_id = $1`;
            let rs = await client.query(sql, [order_id]);
            return mapUserResultSet1(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }  
    }

    async save(newOrd: Order): Promise<Order> {

        let client : PoolClient;
        try {

            client = await connectionPool.connect();
            let sql = `insert into orders (order_id, order_date, order_comments, user_id) values ($1, $2, $3, $4, $5, $6) returning id`;  
            let rs = await client.query(sql, [newOrd.orderId, newOrd.orderDate, newOrd.orderDate, newOrd.comments]);
            newOrd.orderId = rs.rows[0].orderId;
            return newOrd;

        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async update(updatedOrder: Order): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = ``;
            let rs = await client.query(sql, []);
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

            let sql = `delete from orders where order_id = $1`;
            let rs = await client.query(sql, [order_id]);
            
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }
}
