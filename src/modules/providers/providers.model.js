import prisma from '../../shared/prisma/client.js';

class ModelProviders {
    addProvider = async (data) => {
        try {
            return await prisma.proveedor.create({
                data,
                select: { id: true, rif: true, nombre: true, telefono: true, email: true, activo: true }
            });
        } catch (error) { throw error; }
    }

    getProviders = async () => {
        try {
            return await prisma.proveedor.findMany({
                orderBy: { nombre: 'asc' },
                select: { id: true, rif: true, nombre: true, telefono: true, email: true, activo: true }
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
                data: { activo: false }
            });
        } catch (error) { throw error; }
    }
}

export default ModelProviders;