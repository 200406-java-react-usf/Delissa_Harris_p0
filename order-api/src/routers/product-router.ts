import express from 'express';
import AppConfig from '../config/app';

export const ProductRouter = express.Router();

const ProductService = AppConfig.productService;

ProductRouter.get('', async (req, resp) => {

    try {
        let payload = await ProductService.getAllProducts();
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
    resp.send();
});

ProductRouter.get('/:prodId', async (req, resp) => {
    const prodId = +req.params.prodId;
    try {
        let payload = await ProductService.getProductById(prodId);
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
    resp.send();
});

// ProductRouter.post('', async (req, resp) => {
//     console.log('Post request received');
//     try {
//         let newProd = await ProductService.saveProdct(req.body);
//         resp.status(201).json(newProd);
//     } catch (e) {
//         resp.status(e.statusCode).json(e);
//     }
//     resp.send();
// });

// ProductRouter.put('', async (req, resp) => {
//     console.log('Post request received');
//     try {
//         let newProd = await ProductService.updateOrder(req.body);
//         resp.status(201).json(newProd);
//     } catch (e) {
//         resp.status(e.statusCode).json(e);
//     }
//     resp.send();
// });

ProductRouter.delete('', async (req, resp) => {
    console.log('Delete request received');
    console.log(req.body);

    try {
        let result = await ProductService.deleteById(req.body.prodId);
        resp.status(202).json(result);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
    resp.send();
});