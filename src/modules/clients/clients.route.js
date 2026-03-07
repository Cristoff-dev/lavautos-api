import express from 'express';
const router = express.Router();

// Ruta temporal para que el servidor no explote
router.get('/check', (req, res) => res.json({ message: "Módulo activo" }));

export default router;