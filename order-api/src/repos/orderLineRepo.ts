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
            let sql = `select * from order_line`;
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
            let sql = `select * from order_line where order_line_id = $1`;
            let rs = await client.query(sql);
            return mapUserResultSet2(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }  
    }

    async save(newOrd: OrderLine): Promise<OrderLine> {

        let client : PoolClient;
        try {

            client = await connectionPool.connect();
            let sql = `insert into order_line (order_line_id, product_id, order_id, quantity) values ($1, $2, $3, $4, $5, $6) returning id`;  
            let rs = await client.query(sql, [newOrd.orderLineId, newOrd.prodId,newOrd.orderId, newOrd.quantity]);
            newOrd.orderLineId = rs.rows[0].orderLineId;
            return newOrd;

        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async update(updatedOrder: OrderLine): Promise<boolean> {
        
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
    async deleteById(order_line_id: number): Promise<boolean> {
        let client : PoolClient;
        try {
            client = await connectionPool.connect();

            let sql = `delete from order_line where order_line_id = $1`;
            let rs = await client.query(sql [order_line_id]);
            
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }
}
