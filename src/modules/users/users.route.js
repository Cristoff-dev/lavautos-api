import express from "express";
import ControllerUsers from "./users.controller.js";
import middlewares from "./users.middleware.js";
import validationToken from '../../shared/middlewares/validate.token.middleware.js';
import authorization from '../../shared/middlewares/authorization.middleware.js';

const router = express.Router();
const controller = new ControllerUsers();

// Todas las rutas de este módulo están protegidas
router.use(validationToken);

router.get('/', authorization(['ADMIN']), controller.getUsers);
router.post('/', authorization(['ADMIN']), middlewares.addUserMiddleware, controller.addUser);
router.delete('/:id', authorization(['ADMIN']), middlewares.deleteUserMiddleware, controller.deleteUser);
router.patch('/:id', authorization(['ADMIN']), middlewares.updateUserMiddleware, controller.updateUser);

export default router;