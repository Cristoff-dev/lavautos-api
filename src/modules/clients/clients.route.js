import express from "express";
import ControllerClients from "./clients.controller.js";
import middlewares from "./clients.middleware.js";
import validationToken from '../../shared/middlewares/validate.token.middleware.js';
import authorization from '../../shared/middlewares/authorization.middleware.js';

const router = express.Router();
const controller = new ControllerClients();

router.use(validationToken);

// IMPORTANTE: La ruta de búsqueda específica debe ir antes de las rutas con :id dinámico
router.get('/search/:cedula', authorization(['ADMIN', 'CAJERO']), controller.getClientByCedula);

router.get('/', authorization(['ADMIN', 'CAJERO']), controller.getClients);
router.post('/', authorization(['ADMIN', 'CAJERO']), middlewares.addClientMiddleware, controller.addClient);
router.patch('/:id', authorization(['ADMIN', 'CAJERO']), middlewares.updateClientMiddleware, controller.updateClient);
router.delete('/:id', authorization(['ADMIN']), middlewares.deleteClientMiddleware, controller.deleteClient);
router.patch('/restore/:id', authorization(['ADMIN']), controller.restoreClient);

export default router;