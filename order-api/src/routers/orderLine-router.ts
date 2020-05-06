import express from 'express';
import AppConfig from '../config/app';
import { adminGuard } from '../middleware/auth-middleware';

export const OrderLineRouter = express.Router();

const OrderLineService = AppConfig.orderLineService;

OrderLineRouter.get('', adminGuard, async (req, resp) => {

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

// OrderLineRouter.post('/:orderId', async (req, resp) => {
//     console.log('Post request received');
//     const orderId = +req.params.orderId;
//     const productId = +req.body.prodId;
//     try {
//         let newOrder = await OrderLineService.addNewOrder(orderId);
//         resp.status(201).json(newOrder);
//     } catch (e) {
//         resp.status(e.statusCode).json(e);
//     }
//     resp.send();
// });

// OrderLineRouter.patch('/:orderid', async (req, resp) => {
//     const orderid = +req.params.orderId;
//     const productId = +req.body.prodId;
//     try {
//         let status = await OrderLineService.updateOrder(orderid);
//         return resp.status(204).json(status).send();
//     } catch (e) {
//         return resp.status(e.statusCode).json(e).send();
//     }
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

