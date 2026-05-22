import prisma from '../../shared/prisma/client.js';
import ModelPurchases from './purchases.model.js';

const model = new ModelPurchases();

class ServicePurchases {
    getPurchases = async () => {
        try {
            return await model.getPurchases();
        } catch (error) { throw error; }
    }

    registerPurchase = async (purchaseData, details) => {
        return await prisma.$transaction(async (tx) => {
            const { proveedorId, total, facturaNum, metodoPago } = purchaseData;

            const provider = await model.getProviderById(proveedorId);
            if (!provider) throw new Error('PROVIDER_NOT_FOUND');

            const transactionDescription = `Compra registrada: Insumos de ${provider.nombre}. Factura #${facturaNum || 'N/A'} (${metodoPago || 'N/A'})`;
            const txContable = await tx.transaccionContable.create({
                data: {
                    monto: total,
                    categoria: 'COMPRA_INSUMO',
                    descripcion: transactionDescription
                }
            });

            const purchase = await model.createPurchase({
                proveedorId,
                total,
                transaccionId: txContable.id
            }, tx);

            const detailsToSave = details.map(item => ({
                compraId: purchase.id,
                insumoId: item.insumoId,
                cantidad: item.cantidad,
                precioUnit: item.precioUnit
            }));

            await model.createPurchaseDetails(detailsToSave, tx);

            for (const item of details) {
                await tx.insumo.update({
                    where: { id: item.insumoId },
                    data: { stockActual: { increment: item.cantidad } }
                });
            }

            return purchase;
        });
    }
}

export default ServicePurchases;