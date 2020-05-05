
export class OrderLine {
    
    orderLineId: number;
    prodId: number; 
    orderId: number;
    quantity: number;

    constructor (orderLineId: number, prodId: number, orderId: number, qty: number) {
        this.orderLineId = orderLineId;
        this.prodId = prodId;
        this.orderId = orderId;
        this.quantity= qty;
    }
    
}