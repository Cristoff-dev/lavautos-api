import prisma from '../../shared/prisma/client.js';
import ModelPurchases from './purchases.model.js';

const model = new ModelPurchases();

class ServicePurchases {
    registerPurchase = async (purchaseData, details) => {
        return await prisma.$transaction(async (tx) => {
            const provider = await model.getProviderById(purchaseData.proveedorId);
            if (!provider) throw new Error('PROVIDER_NOT_FOUND');

            const purchase = await model.createPurchase(purchaseData, tx);

            const detailsToSave = details.map(item => ({
                compraId: purchase.id,
                insumoId: item.insumoId,
                cantidad: item.cantidad,
                precioUnit: item.precioUnit // CAMBIADO de precioUnitario a precioUnit
            }));
            
            await model.createPurchaseDetails(detailsToSave, tx);

            for (const item of details) {
                await tx.insumo.update({
                    where: { id: item.insumoId },
                    data: { stockActual: { increment: item.cantidad } } // Ajustado a tu schema (stockActual)
                });
            }

            await tx.transaccionContable.create({
                data: {
        monto: purchase.total,
        categoria: 'COMPRA_INSUMO', // Asegúrate de que esto coincide con tu Enum
        descripcion: `Compra registrada: Insumos de ${provider.nombre}`,
                }
            });

            return purchase;
        });
    }
}

export default ServicePurchases;