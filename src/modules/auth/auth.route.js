import express from 'express';
import validateLogin from './auth.middleware.js';
import AuthController from './auth.controller.js';

const controllerAuth = new AuthController();
const router = express.Router();

// Ruta pública para el inicio de sesión
router.post('/login', validateLogin, (req, res) => controllerAuth.login(req, res));

export default router;