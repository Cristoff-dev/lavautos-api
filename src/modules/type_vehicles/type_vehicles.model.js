import prisma from '../../shared/prisma/client.js';

class ModelTypeVehicles {
    addTypeVehicle = async (data) => {
        try {
            return await prisma.tipoVehiculo.create({
                data,
                select: { id: true, placa: true, marca: true, modelo: true, color: true, clase: true, activo: true, clienteId: true }
            });
        } catch (error) { throw error; }
    }

    getTypeVehicles = async () => {
        try {
            return await prisma.tipoVehiculo.findMany({
                orderBy: { id: 'asc' },
                include: { cliente: { select: { id: true, activo: true } } } // Trae info básica del cliente
            });
        } catch (error) { throw error; }
    }

    getTypeVehiclesInactivos = async () => {
    try {
        return await prisma.tipoVehiculo.findMany({
            where: { activo: false },
            include: { cliente: true }
        });
    } catch (error) { throw error; }
}

    getTypeVehicleById = async (id) => {
        try {
            return await prisma.tipoVehiculo.findUnique({ where: { id } });
        } catch (error) { throw error; }
    }

    getTypeVehicleByPlaca = async (placa) => {
        try {
            return await prisma.tipoVehiculo.findUnique({ where: { placa } });
        } catch (error) { throw error; }
    }

    updateTypeVehicle = async (id, data) => {
        try {
            return await prisma.tipoVehiculo.update({
                where: { id },
                data,
                select: { id: true, placa: true, marca: true, modelo: true, color: true, clase: true, activo: true }
            });
        } catch (error) { throw error; }
    }

    desactiveTypeVehicle = async (id) => {
        try {
            // Soft Delete según tu schema
            return await prisma.tipoVehiculo.update({
                where: { id },
                data: { activo: false }
            });
        } catch (error) { throw error; }
    }

    activateTypeVehicle = async (id) => {
        try {
            return await prisma.tipoVehiculo.update({
                where: { id },
                data: { activo: true }
            });
        } catch (error ) { throw error; }
    }
}

export default ModelTypeVehicles;