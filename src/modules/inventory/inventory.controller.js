import response from '../../shared/utils/responses.js';
import ServiceInventory from './inventory.service.js';

const service = new ServiceInventory();

class ControllerInventory {
    // Crear insumo
    addInsumo = async (req, res) => {
        try {
            const result = await service.addInsumo(req.body);
            return response.ItemCreated(res, result);
        } catch (error) {
            if (error.message === 'NOMBRE_ALREADY_EXISTS') {
                return response.ResConflict(res, "Ya existe un insumo con este nombre.");
            }
            if (error.message === 'STOCK_MINIMO_MAYOR_ACTUAL') {
                return response.BadRequest(res, "El stock mínimo no puede ser mayor al stock actual.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    // Listar todos
    getInsumos = async (req, res) => {
        try {
            const result = await service.getInsumos();
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    // Obtener por ID
    getInsumoById = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.getInsumoById(parseInt(id));
            return response.QuerySuccess(res, result);
        } catch (error) {
            if (error.message === 'INSUMO_NOT_FOUND') {
                return response.ItemNotFound(res, "Insumo no encontrado.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    // Actualizar insumo
    updateInsumo = async (req, res) => {
        try {
            const insumoData = { id: parseInt(req.params.id), ...req.body };
            const result = await service.updateInsumo(insumoData);
            return response.QuerySuccess(res, result, "Insumo actualizado exitosamente.");
        } catch (error) {
            if (error.message === 'INSUMO_NOT_FOUND') {
                return response.ItemNotFound(res, "Insumo no encontrado.");
            }
            if (error.message === 'NOMBRE_ALREADY_EXISTS') {
                return response.ResConflict(res, "Ya existe un insumo con este nombre.");
            }
            if (error.message === 'STOCK_MINIMO_MAYOR_ACTUAL') {
                return response.BadRequest(res, "El stock mínimo no puede ser mayor al stock actual.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    // Eliminar (soft delete)
    deleteInsumo = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.deleteInsumo(parseInt(id));
            return response.QuerySuccess(res, result, "Insumo desactivado exitosamente.");
        } catch (error) {
            if (error.message === 'INSUMO_NOT_FOUND') {
                return response.ItemNotFound(res, "Insumo no encontrado.");
            }
            if (error.message === 'INSUMO_ALREADY_INACTIVE') {
                return response.BadRequest(res, "El insumo ya está inactivo.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    // Restaurar insumo
    restoreInsumo = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.restoreInsumo(parseInt(id));
            return response.QuerySuccess(res, result, "Insumo restaurado exitosamente.");
        } catch (error) {
            if (error.message === 'INSUMO_NOT_FOUND') {
                return response.ItemNotFound(res, "Insumo no encontrado.");
            }
            if (error.message === 'INSUMO_ALREADY_ACTIVE') {
                return response.BadRequest(res, "El insumo ya está activo.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    // Actualizar stock manualmente
    updateStock = async (req, res) => {
        try {
            const { id } = req.params;
            const { cantidad, operacion = 'SET' } = req.body;
            
            const result = await service.updateStock(parseInt(id), parseFloat(cantidad), operacion);
            
            let mensaje = "Stock actualizado exitosamente.";
            if (result.alertaStock) {
                mensaje = result.mensajeAlerta;
            }
            
            return response.QuerySuccess(res, result, mensaje);
        } catch (error) {
            if (error.message === 'INSUMO_NOT_FOUND') {
                return response.ItemNotFound(res, "Insumo no encontrado.");
            }
            if (error.message === 'CANTIDAD_NO_PUEDE_SER_NEGATIVA') {
                return response.BadRequest(res, "La cantidad no puede ser negativa.");
            }
            if (error.message === 'STOCK_INSUFICIENTE') {
                return response.BadRequest(res, "Stock insuficiente para realizar esta operación.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    // Obtener alertas de stock bajo
    getLowStockInsumos = async (req, res) => {
        try {
            const result = await service.getLowStockInsumos();
            
            if (result.length === 0) {
                return response.QuerySuccess(res, [], "No hay insumos con stock bajo.");
            }
            
            return response.QuerySuccess(res, result, `${result.length} insumo(s) con stock bajo.`);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    // Resumen para dashboard
    getResumenInventario = async (req, res) => {
        try {
            const result = await service.getResumenInventario();
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    // Obtener insumos para dropdown
    getInsumosDropdown = async (req, res) => {
        try {
            const result = await service.getInsumosDropdown();
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    // Obtener historial de un insumo
    getHistorialInsumo = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.getHistorialInsumo(parseInt(id));
            return response.QuerySuccess(res, result);
        } catch (error) {
            if (error.message === 'INSUMO_NOT_FOUND') {
                return response.ItemNotFound(res, "Insumo no encontrado.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    generateReportPdf = async (req, res) => {
        try {
            const pdfBuffer = await service.generarReportePdf();
            
            // Configuramos los headers para que el navegador entienda que es un PDF
            res.setHeader('Content-Type', 'application/pdf');
            // Cambia 'attachment' por 'inline' si prefieres que se abra en el navegador en vez de descargarse directo
            res.setHeader('Content-Disposition', 'attachment; filename="reporte_inventario.pdf"'); 
            res.setHeader('Content-Length', pdfBuffer.length);
            
            return res.status(200).send(pdfBuffer);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

}

export default ControllerInventory;