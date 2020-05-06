export class Product {

    prodId: number;
    name: string;
    description: string;
    cost: number

    constructor (prodId: number, name: string, description: string,  cost: number) {
        this.prodId = prodId;
        this.name= name;
        this.description = description;
        this.cost = cost;
    }
}