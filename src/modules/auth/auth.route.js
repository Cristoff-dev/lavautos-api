import express from 'express';
import validateLogin from './auth.middleware.js';
import AuthController from './auth.controller.js';

const router = express.Router();
const controller = new AuthController();

// POST /api/auth/login
router.post('/login', validateLogin, (req, res) => controller.login(req, res));

export default router;