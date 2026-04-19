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
        let { fechaInicio, fechaFin, categoria } = req.query;

        if (!fechaInicio || !fechaFin) {
            const hoy = new Date();
            fechaInicio = new Date(hoy.setHours(0, 0, 0, 0)).toISOString();
            fechaFin = new Date(hoy.setHours(23, 59, 59, 999)).toISOString();
        }

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
        let { fechaInicio, fechaFin } = req.query;

        // Lógica de "Hoy por defecto"
        if (!fechaInicio || !fechaFin) {
            const hoy = new Date();
            
            // Inicio del día: 2026-04-19T00:00:00
            const inicio = new Date(hoy.setHours(0, 0, 0, 0)).toISOString();
            // Fin del día: 2026-04-19T23:59:59
            const fin = new Date(hoy.setHours(23, 59, 59, 999)).toISOString();
            
            fechaInicio = inicio;
            fechaFin = fin;
        }

        const result = await service.calcularBalancePorPeriodo(fechaInicio, fechaFin);
        return response.QuerySuccess(res, result);
        } catch (error) {
        return response.ErrorInternal(res, error.message);
        }
    }
}

export default ControllerFinance;