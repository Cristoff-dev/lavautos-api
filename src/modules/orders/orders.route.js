import express from 'express';
const router = express.Router();

// Ruta temporal para que el servidor no explote
router.get('/check', (req, res) => res.json({ message: "Módulo orders activo" }));

export default router;
