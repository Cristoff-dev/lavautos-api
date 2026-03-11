import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await prisma.provider.findMany({
            where: { isActive: true }
        });
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los proveedores' });
    }
};

export const obtenerProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const proveedor = await prisma.provider.findFirst({
            where: { id: id, isActive: true }
        });

        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el proveedor' });
    }
};

export const crearProveedor = async (req, res) => {
    try {
        const proveedor = await prisma.provider.create({
            data: req.body
        });
        res.status(201).json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el proveedor' });
    }
};

export const actualizarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const proveedor = await prisma.provider.update({
            where: { id: id, isActive: true },
            data: req.body
        });
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el proveedor' });
    }
};

export const eliminarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.provider.update({
            where: { id: id },
            data: { isActive: false }
        });
        res.json({ mensaje: 'Proveedor eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el proveedor' });
    }
};