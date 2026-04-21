import response from '../../shared/utils/responses.js';
import ServicePurchases from './purchases.service.js';

const service = new ServicePurchases();

class ControllerPurchases {
    addPurchase = async (req, res) => {
        try {
            const { purchaseData, details } = req.body;
            const result = await service.registerPurchase(purchaseData, details);
            
            return response.QuerySuccess(
                res, 
                result, 
                "Compra registrada con éxito. Inventario y Finanzas actualizados."
            );
        } catch (error) {
            if (error.message === 'PROVIDER_NOT_FOUND') {
                return response.ItemNotFound(res, "El proveedor indicado no existe.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }
}

export default ControllerPurchases;