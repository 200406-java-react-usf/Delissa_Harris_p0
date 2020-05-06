import { UserRepository } from '../repos/user-repo';
import { UserService } from '../services/user-service';
import { OrderRepository } from '../repos/orderRepo';
import { OrderService } from '../services/order-service';
import { OrderLineRepository } from '../repos/orderLineRepo';
import { OrderLineService } from '../services/orderLine-service';
import { ProductRepository } from '../repos/productRepo';
import { ProductService } from '../services/product-service';
const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const orderRepo = new OrderRepository();
const orderService = new OrderService(orderRepo);

const orderLineRepo = new OrderLineRepository();
const orderLineService = new OrderLineService(orderLineRepo);

const productRepo = new ProductRepository();
const productService = new ProductService(productRepo);

export default {
    userService,
    orderService,
    orderLineService,
    productService
};