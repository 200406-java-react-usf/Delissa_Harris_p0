import express from 'express';
import AppConfig from '../config/app';

export const OrderLineRouter = express.Router();

const OrderLineService = AppConfig.orderService;

OrderLineRouter.get('', async (req, resp) => {

    try {
        let payload = await OrderLineService.getAllOrders();
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
    resp.send();
});

OrderLineRouter.get('/:orderLineId', async (req, resp) => {
    const orderLineId = +req.params.orderLineId;
    try {
        let payload = await OrderLineService.getOrderById(orderLineId);
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

OrderLineRouter.delete('', async (req, resp) => {
    console.log('Delete request received');
    console.log(req.body);

    try {
        let result = await OrderLineService.deleteById(req.body);
        resp.status(202).json(result);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
    resp.send();
});