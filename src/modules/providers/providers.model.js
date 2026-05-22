import prisma from '../../shared/prisma/client.js';

class ModelProviders {
    addProvider = async (data) => {
        try {
            return await prisma.proveedor.create({
                data: { ...data, activo: true },
                select: { id: true, rif: true, nombre: true, telefono: true, email: true, activo: true }
            });
        } catch (error) { throw error; }
    }

    getProviders = async () => {
        try {
            return await prisma.proveedor.findMany({
                orderBy: [{ activo: 'desc' }, { nombre: 'asc' }],
                select: { id: true, rif: true, nombre: true, telefono: true, email: true, activo: true }
            });
        } catch (error) { throw error; }
    }

    getActiveProviders = async () => {
        try {
            return await prisma.proveedor.findMany({
                where: { activo: true },
                orderBy: { nombre: 'asc' },
                select: { id: true, rif: true, nombre: true }
            });
        } catch (error) { throw error; }
    }

    getProviderById = async (id) => {
        try {
            return await prisma.proveedor.findUnique({ where: { id } });
        } catch (error) { throw error; }
    }

    getProviderByRif = async (rif) => {
        try {
            return await prisma.proveedor.findUnique({ where: { rif } });
        } catch (error) { throw error; }
    }

    updateProvider = async (id, data) => {
        try {
            return await prisma.proveedor.update({
                where: { id },
                data,
                select: { id: true, rif: true, nombre: true, telefono: true, email: true, activo: true }
            });
        } catch (error) { throw error; }
    }

    deleteProvider = async (id) => {
        try {
            return await prisma.proveedor.update({
                where: { id },
                data: { activo: false },
                select: { id: true, nombre: true, activo: true }
            });
        } catch (error) { throw error; }
    }

    restoreProvider = async (id) => {
        try {
            return await prisma.proveedor.update({
                where: { id },
                data: { activo: true },
                select: { id: true, nombre: true, activo: true }
            });
        } catch (error) { throw error; }
    }

    getInsumosAsignados = async (proveedorId) => {
        try {
            const detalles = await prisma.detalleCompra.findMany({
                where: {
                    compra: { proveedorId: proveedorId }
                },
                select: {
                    insumo: {
                        select: { id: true, nombre: true, stockActual: true, stockMinimo: true, activo: true }
                    }
                }
            });

            const mapeoInsumos = new Map();
            detalles.forEach(d => {
                if (d.insumo && !mapeoInsumos.has(d.insumo.id)) {
                    mapeoInsumos.set(d.insumo.id, d.insumo);
                }
            });

            return Array.from(mapeoInsumos.values());
        } catch (error) { throw error; }
    }
}

export default ModelProviders;