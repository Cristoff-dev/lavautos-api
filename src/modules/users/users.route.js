import express from "express";
import ControllerUsers from "./users.controller.js";
import middlewares from "./users.middleware.js";
import validationToken from '../../shared/middlewares/validate.token.middleware.js';
import authorization from '../../shared/middlewares/authorization.middleware.js';

const router = express.Router();
const controller = new ControllerUsers();

router.use(validationToken);

router.get('/', authorization(['ADMIN']), controller.getUsers);
router.post('/', authorization(['ADMIN']), middlewares.addUserMiddleware, controller.addUser);

// deleteUserMiddleware añadido al DELETE
router.delete('/:id', authorization(['ADMIN']), middlewares.deleteUserMiddleware, controller.deleteUser);

router.patch('/:id', authorization(['ADMIN']), middlewares.updateUserMiddleware, controller.updateUser);

// deleteUserMiddleware añadido al RESTORE para validar el ID
router.patch('/restore/:id', authorization(['ADMIN']), middlewares.deleteUserMiddleware, controller.restoreUser);

export default router;