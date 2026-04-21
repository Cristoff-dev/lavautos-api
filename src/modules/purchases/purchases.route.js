import express from 'express';
import ControllerPurchases from './purchases.controller.js';
import middlewares from './purchases.middleware.js';
import validationToken from '../../shared/middlewares/validate.token.middleware.js';
import authorization from '../../shared/middlewares/authorization.middleware.js';

const router = express.Router();
const controller = new ControllerPurchases();

router.use(validationToken);

router.post(
    '/', 
    authorization(['ADMIN']), 
    middlewares.addPurchaseMiddleware, 
    controller.addPurchase
);

export default router;