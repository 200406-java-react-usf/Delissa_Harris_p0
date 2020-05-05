export class Order {

    orderId: number;
    orderDate: Date;
    comments: string;
    id: number;

    constructor (orderId: number, orderDate: Date, comments: string, id: number,) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.comments = comments;
        this.id = id;
    }
    
}