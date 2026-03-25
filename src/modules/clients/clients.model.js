import prisma from '../../shared/prisma/client.js';

class ModelClients {
    addClient = async (data) => {
        try {
            return await prisma.cliente.create({
                data,
                select: { id: true, cedula: true, nombre: true, telefono: true, email: true, activo: true }
            });
        } catch (error) { throw error; }
    }

    getClients = async () => {
        try {
            return await prisma.cliente.findMany({
                where: { activo: true },
                orderBy: { nombre: 'asc' },
                select: { id: true, cedula: true, nombre: true, telefono: true, email: true, activo: true }
            });
        } catch (error) { throw error; }
    }

    getClientById = async (id) => {
        try {
            return await prisma.cliente.findUnique({ where: { id } });
        } catch (error) { throw error; }
    }

    getClientByCedula = async (cedula) => {
        try {
            return await prisma.cliente.findUnique({ where: { cedula } });
        } catch (error) { throw error; }
    }

    updateClient = async (id, data) => {
        try {
            return await prisma.cliente.update({
                where: { id },
                data,
                select: { id: true, cedula: true, nombre: true, telefono: true, email: true, activo: true }
            });
        } catch (error) { throw error; }
    }

    deleteClient = async (id) => {
        try {
            return await prisma.cliente.update({
                where: { id },
                data: { activo: false }
            });
        } catch (error) { throw error; }
    }

    restoreClient = async (id) => {
        try {
            return await prisma.cliente.update({
                where: { id },
                data: { activo: true },
                select: { id: true, cedula: true, nombre: true, telefono: true, email: true, activo: true }
            });
        } catch (error) { throw error; }
    }
}

export default ModelClients;