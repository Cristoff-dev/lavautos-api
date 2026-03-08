import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerProveedores = async (req: Request, res: Response) => {
    try {
        const proveedores = await prisma.provider.findMany({
            where: { isActive: true }
        });
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los proveedores' });
    }
};

export const obtenerProveedor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const proveedor = await prisma.provider.findFirst({
            where: { id: id as string, isActive: true }
        });

        if (!proveedor) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }

        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el proveedor' });
    }
};

export const crearProveedor = async (req: Request, res: Response) => {
    try {
        const proveedor = await prisma.provider.create({
            data: req.body as any
        });
        res.status(201).json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el proveedor' });
    }
};

export const actualizarProveedor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const proveedor = await prisma.provider.update({
            where: { id: id as string, isActive: true },
            data: req.body as any
        });
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el proveedor' });
    }
};

export const eliminarProveedor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.provider.update({
            where: { id: id as string },
            data: { isActive: false }
        });
        res.json({ mensaje: 'Proveedor eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el proveedor' });
    }
};
