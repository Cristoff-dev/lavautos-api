import response from '../../shared/utils/responses.js';
import ServiceFinance from './finance.service.js';

const service = new ServiceFinance();

class ControllerFinance {
    // Obtener balance/resumen
    getBalance = async (req, res) => {
        try {
            const result = await service.obtenerResumen();
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    // Obtener historial de transacciones
    getHistory = async (req, res) => {
        try {
            const result = await service.obtenerTransacciones();
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    // Crear transacción
    createTransaction = async (req, res) => {
        try {
            const result = await service.crearTransaccion(req.body);
            return response.ItemCreated(res, result);
        } catch (error) {
            if (error.message === 'MONTO_DEBE_SER_POSITIVO') {
                return response.BadRequest(res, "El monto debe ser un valor positivo.");
            }
            if (error.message === 'CATEGORIA_REQUERIDA') {
                return response.BadRequest(res, "La categoría es requerida.");
            }
            if (error.message === 'DESCRIPCION_REQUERIDA') {
                return response.BadRequest(res, "La descripción es requerida.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    // Obtener transacción por ID
    getTransactionById = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.obtenerTransaccionPorId(parseInt(id));
            return response.QuerySuccess(res, result);
        } catch (error) {
            if (error.message === 'TRANSACCION_NOT_FOUND') {
                return response.ItemNotFound(res, "Transacción no encontrada.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    // Actualizar transacción
    updateTransaction = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.actualizarTransaccion(parseInt(id), req.body);
            return response.QuerySuccess(res, result);
        } catch (error) {
            if (error.message === 'TRANSACCION_NOT_FOUND') {
                return response.ItemNotFound(res, "Transacción no encontrada.");
            }
            if (error.message === 'MONTO_DEBE_SER_POSITIVO') {
                return response.BadRequest(res, "El monto debe ser un valor positivo.");
            }
            if (error.message === 'DESCRIPCION_REQUERIDA') {
                return response.BadRequest(res, "La descripción es requerida.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    // Eliminar transacción
    deleteTransaction = async (req, res) => {
        try {
            const { id } = req.params;
            await service.eliminarTransaccion(parseInt(id));
            return response.ItemDeleted(res);
        } catch (error) {
            if (error.message === 'TRANSACCION_NOT_FOUND') {
                return response.ItemNotFound(res, "Transacción no encontrada.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    // Obtener resumen financiero detallado
    getResumenFinanciero = async (req, res) => {
        try {
            const result = await service.getResumenFinanciero();
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    // Obtener historial por período
    getHistorialTransacciones = async (req, res) => {
        try {
            const { fechaInicio, fechaFin, categoria } = req.query;
            const result = await service.getHistorialTransacciones(fechaInicio, fechaFin, categoria);
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    // Obtener transacciones para dropdown
    getTransaccionesDropdown = async (req, res) => {
        try {
            const result = await service.getTransaccionesDropdown();
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    // Calcular balance por período
    calcularBalancePorPeriodo = async (req, res) => {
        try {
            const { fechaInicio, fechaFin } = req.query;
            if (!fechaInicio || !fechaFin) {
                return response.BadRequest(res, "Se requieren fechaInicio y fechaFin.");
            }
            const result = await service.calcularBalancePorPeriodo(fechaInicio, fechaFin);
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }
}

export default ControllerFinance;