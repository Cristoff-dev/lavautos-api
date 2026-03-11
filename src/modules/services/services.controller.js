import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerServicios = async (req, res) => {
    try {
        const servicios = await prisma.servicio.findMany({
            where: { activo: true }
        });
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los servicios' });
    }
};

export const obtenerServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const servicio = await prisma.servicio.findFirst({
            where: { id: Number(id), activo: true }
        });

        if (!servicio) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }

        res.json(servicio);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el servicio' });
    }
};

export const crearServicio = async (req, res) => {
    try {
        const servicio = await prisma.servicio.create({
            data: req.body
        });
        res.status(201).json(servicio);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el servicio' });
    }
};

export const actualizarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const servicio = await prisma.servicio.update({
            where: { id: Number(id) },
            data: req.body
        });
        res.json(servicio);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el servicio' });
    }
};

export const eliminarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.servicio.update({
            where: { id: Number(id) },
            data: { activo: false }
        });
        res.json({ mensaje: 'Servicio eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el servicio' });
    }
};