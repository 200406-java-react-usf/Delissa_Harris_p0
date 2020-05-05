export interface UserSchema {
    id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    email: string,
    role_name: string
}

export interface OrderSchema {
    order_id: number,
    order_date: Date,
    order_comments: string,
    user_id: number
}

export interface ProductSchema {
    product_id: number,
    product_name: string,
    description: string,
    product_cost: number,
    created_time: Date
}

export interface OrderLineSchema {
    order_line_id: number;
    product_id: number;
    order_id: number;
    quantity: number;
}