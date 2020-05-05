import { UserSchema } from "./schemas";
import { OrderSchema } from "./schemas";
import { ProductSchema } from "./schemas";
import { OrderLineSchema } from "./schemas";
import { User } from "../models/user";
import { Order } from "../models/order";
import { Product } from "../models/product";
import { OrderLine } from "../models/orderLine";

export function mapUserResultSet(resultSet: UserSchema): User {
    
    if (!resultSet) {
        return {} as User;
    }

    return new User(
        resultSet.id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.email,
        resultSet.role_name
    );
}

export function mapUserResultSet1(resultSet: OrderSchema): Order {
    
    if (!resultSet) {
        return {} as Order;
    }

    return new Order(
        resultSet.order_id,
        resultSet.order_date,
        resultSet.order_comments,
        resultSet.user_id,
    );
}

export function mapUserResultSet2(resultSet: OrderLineSchema): OrderLine {
    
    if (!resultSet) {
        return {} as OrderLine;
    }

    return new OrderLine(
        resultSet.order_line_id,
        resultSet.order_id,
        resultSet.product_id,
        resultSet.quantity
    );
}

export function mapUserResultSet3(resultSet: ProductSchema): Product {
    
    if (!resultSet) {
        return {} as Product;
    }

    return new Product(
        resultSet.product_id,
        resultSet.product_name,
        resultSet.description,
        resultSet.product_cost,
        resultSet.created_time,
    );
}