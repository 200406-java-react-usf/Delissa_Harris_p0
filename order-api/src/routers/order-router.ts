import express from 'express';
import AppConfig from '../config/app';

export const OrderRouter = express.Router();

const OrderService = AppConfig.orderService;

OrderRouter.get('', async (req, resp) => {

    try {
        let payload = await OrderService.getAllOrders();
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
    resp.send();
});

OrderRouter.get('/:orderId', async (req, resp) => {
    const orderId = +req.params.orderId;
    try {
        let payload = await OrderService.getOrderById(orderId);
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
    resp.send();
});

// OrderRouter.post('', async (req, resp) => {
//     console.log('Post request received');
//     try {
//         let newOrder = await OrderService.saveOrder(req.body);
//         resp.status(201).json(newOrder);
//     } catch (e) {
//         resp.status(e.statusCode).json(e);
//     }
//     resp.send();
// });

// OrderRouter.put('', async (req, resp) => {
//     console.log('Post request received');
//     try {
//         let newOrder = await OrderService.updateOrder(req.body);
//         resp.status(201).json(newOrder);
//     } catch (e) {
//         resp.status(e.statusCode).json(e);
//     }
//     resp.send();
// });

OrderRouter.delete('', async (req, resp) => {
    console.log('Delete request received');
    console.log(req.body);

    try {
        let result = await OrderService.deleteById(req.body);
        resp.status(202).json(result);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
    resp.send();
});