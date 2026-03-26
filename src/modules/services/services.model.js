import prisma from '../../shared/prisma/client.js';

class ModelServices {
    addService = async (data) => {
        try {
            return await prisma.servicio.create({
                data,
                select: { id: true, nombre: true, precio: true, descripcion: true, duracionMinutos: true, esCombo: true, activo: true, tipoVehiculo: true }
            });
        } catch (error) { throw error; }
    }

    getServices = async () => {
        try {
            return await prisma.servicio.findMany({
                where: { activo: true },
                orderBy: { nombre: 'asc' },
                select: { id: true, nombre: true, precio: true, descripcion: true, duracionMinutos: true, esCombo: true, activo: true, tipoVehiculo: true }
            });
        } catch (error) { throw error; }
    }

    getServiceById = async (id) => {
        try {
            return await prisma.servicio.findUnique({ where: { id } });
        } catch (error) { throw error; }
    }

    getServiceByNombre = async (nombre) => {
        try {
            return await prisma.servicio.findUnique({ where: { nombre } });
        } catch (error) { throw error; }
    }

    updateService = async (id, data) => {
        try {
            return await prisma.servicio.update({
                where: { id },
                data,
                select: { id: true, nombre: true, precio: true, descripcion: true, duracionMinutos: true, esCombo: true, activo: true, tipoVehiculo: true }
            });
        } catch (error) { throw error; }
    }

    deleteService = async (id) => {
        try {
            return await prisma.servicio.update({
                where: { id },
                data: { activo: false }
            });
        } catch (error) { throw error; }
    }
}

export default ModelServices;
