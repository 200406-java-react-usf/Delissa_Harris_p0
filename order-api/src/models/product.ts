export class Product {

    prodId: number;
    name: string;
    description: string;
    cost: number;
    createDate: Date;

    constructor (prodId: number, name: string, description: string,  cost: number, create: Date) {
        this.prodId = prodId;
        this.name= name;
        this.description = description;
        this.cost = cost;
        this.createDate = create;
    }
    
}