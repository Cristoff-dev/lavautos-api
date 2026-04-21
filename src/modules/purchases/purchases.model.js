import prisma from '../../shared/prisma/client.js';

class ModelPurchases {
    createPurchase = async (data, tx = prisma) => {
        try {
            return await tx.compra.create({ data });
        } catch (error) { throw error; }
    }

    createPurchaseDetails = async (details, tx = prisma) => {
        try {
            return await tx.detalleCompra.createMany({ data: details });
        } catch (error) { throw error; }
    }

    getProviderById = async (id) => {
        try {
            return await prisma.proveedor.findUnique({ where: { id } });
        } catch (error) { throw error; }
    }
}

export default ModelPurchases;