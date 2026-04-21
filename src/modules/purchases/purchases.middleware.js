import response from '../../shared/utils/responses.js';
import validators from '../../shared/utils/format.data.js';

const addPurchaseMiddleware = (req, res, next) => {
    const { purchaseData, details } = req.body;
    let errors = [];

    if (!purchaseData || !purchaseData.proveedorId || !purchaseData.total) {
        return response.BadRequest(res, 'purchaseData incompleto: proveedorId y total son requeridos.');
    }

    if (!details || !Array.isArray(details) || details.length === 0) {
        return response.BadRequest(res, 'Debe incluir al menos un detalle de insumo.');
    }

    details.forEach((item, index) => {
        // VALIDACIÓN REAL: insumoId y precioUnit
        if (!item.insumoId || !item.cantidad || !item.precioUnit) {
            errors.push(`Error en item ${index + 1}: Faltan datos (insumoId, cantidad o precioUnit).`);
        }
    });

    if (errors.length > 0) return response.BadRequest(res, errors);
    next();
}

export default { addPurchaseMiddleware };