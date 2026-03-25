import express from 'express';
const router = express.Router();

router.get('/check', (req, res) => res.json({ message: "Módulo orders activo" }));

export default router;
