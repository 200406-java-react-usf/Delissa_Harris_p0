
export class OrderLine {
    
    prodId: number; 
    orderId: number;
    quantity: number;

    constructor (prodId: number, orderId: number, qty: number) {
        this.prodId = prodId;
        this.orderId = orderId;
        this.quantity= qty;
    }
    
}