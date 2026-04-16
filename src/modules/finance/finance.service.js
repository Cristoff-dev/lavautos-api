import ModelFinance from './finance.model.js';

const model = new ModelFinance();

class ServiceFinance {
    // Registrar ingreso (llamado desde VEHICLES)
    registrarIngreso = async (monto, vehiculoId) => {
        try {
            return await model.create({
                categoria: 'INGRESO_LAVADO',
                monto,
                descripcion: `Cobro por servicio de lavado - Vehículo #${vehiculoId}`,
                vehiculoId
            });
        } catch (error) { throw error; }
    }

    // Registrar egreso (llamado desde PURCHASES o EXPENSES)
    registrarEgreso = async (monto, descripcion, categoria) => {
        try {
            return await model.create({
                categoria,
                monto,
                descripcion
            });
        } catch (error) { throw error; }
    }

    // Crear transacción manual
    crearTransaccion = async (data) => {
        try {
            // Validar monto positivo
            if (data.monto <= 0) throw new Error('MONTO_DEBE_SER_POSITIVO');

            // Validar categoría requerida
            if (!data.categoria) throw new Error('CATEGORIA_REQUERIDA');

            // Validar descripción
            if (!data.descripcion || data.descripcion.trim().length === 0) {
                throw new Error('DESCRIPCION_REQUERIDA');
            }

            return await model.create(data);
        } catch (error) { throw error; }
    }

    // Obtener todas las transacciones
    obtenerTransacciones = async () => {
        try {
            const transacciones = await model.findAll();

            // Agregar información adicional para cada transacción
            return transacciones.map(transaccion => ({
                ...transaccion,
                tipo: transaccion.monto > 0 ? 'INGRESO' : 'EGRESO',
                montoAbsoluto: Math.abs(transaccion.monto)
            }));
        } catch (error) { throw error; }
    }

    // Obtener transacción por ID
    obtenerTransaccionPorId = async (id) => {
        try {
            const transaccion = await model.findById(id);
            if (!transaccion) throw new Error('TRANSACCION_NOT_FOUND');

            return {
                ...transaccion,
                tipo: transaccion.monto > 0 ? 'INGRESO' : 'EGRESO',
                montoAbsoluto: Math.abs(transaccion.monto)
            };
        } catch (error) { throw error; }
    }

    // Actualizar transacción
    actualizarTransaccion = async (id, data) => {
        try {
            // Verificar que existe
            const existTransaccion = await model.findById(id);
            if (!existTransaccion) throw new Error('TRANSACCION_NOT_FOUND');

            // Validar monto si se actualiza
            if (data.monto !== undefined && data.monto <= 0) {
                throw new Error('MONTO_DEBE_SER_POSITIVO');
            }

            // Validar descripción si se actualiza
            if (data.descripcion !== undefined && (!data.descripcion || data.descripcion.trim().length === 0)) {
                throw new Error('DESCRIPCION_REQUERIDA');
            }

            return await model.update(id, data);
        } catch (error) { throw error; }
    }

    // Eliminar transacción
    eliminarTransaccion = async (id) => {
        try {
            const transaccion = await model.findById(id);
            if (!transaccion) throw new Error('TRANSACCION_NOT_FOUND');

            return await model.delete(id);
        } catch (error) { throw error; }
    }

    // Obtener resumen financiero básico
    obtenerResumen = async () => {
        try {
            const resumen = await model.getResumenFinanciero();

            return {
                ingresos: resumen.ingresos.total,
                egresos: resumen.egresos.total,
                balance: resumen.balance,
                rentabilidad: resumen.rentabilidad
            };
        } catch (error) { throw error; }
    }

    // Obtener resumen financiero detallado para dashboard
    getResumenFinanciero = async () => {
        try {
            return await model.getResumenFinanciero();
        } catch (error) { throw error; }
    }

    // Obtener historial de transacciones por período
    getHistorialTransacciones = async (fechaInicio, fechaFin, categoria = null) => {
        try {
            return await model.getHistorialTransacciones(fechaInicio, fechaFin, categoria);
        } catch (error) { throw error; }
    }

    // Obtener transacciones para dropdown/selectores
    getTransaccionesDropdown = async () => {
        try {
            const transacciones = await model.findAll();
            return transacciones.map(t => ({
                id: t.id,
                descripcion: `${t.categoria}: ${t.descripcion} - $${Math.abs(t.monto)}`,
                categoria: t.categoria,
                monto: t.monto,
                fecha: t.fecha
            }));
        } catch (error) { throw error; }
    }

    // Calcular balance por período
    calcularBalancePorPeriodo = async (fechaInicio, fechaFin) => {
        try {
            const transacciones = await model.getHistorialTransacciones(fechaInicio, fechaFin);

            const ingresos = transacciones
                .filter(t => t.monto > 0)
                .reduce((sum, t) => sum + t.monto, 0);

            const egresos = Math.abs(transacciones
                .filter(t => t.monto < 0)
                .reduce((sum, t) => sum + t.monto, 0));

            return {
                periodo: { inicio: fechaInicio, fin: fechaFin },
                ingresos,
                egresos,
                balance: ingresos - egresos,
                totalTransacciones: transacciones.length
            };
        } catch (error) { throw error; }
    }
}

export default ServiceFinance;