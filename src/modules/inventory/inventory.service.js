import ModelInventory from './inventory.model.js';
import { generarPdfInventario } from '../../services/reporteInventario.js';

const model = new ModelInventory();

class ServiceInventory {
    // Crear insumo con validaciones de negocio
    addInsumo = async (insumoData) => {
        try {
            // Validar nombre único
            const existingInsumo = await model.getInsumoByNombre(insumoData.nombre);
            if (existingInsumo) throw new Error('NOMBRE_ALREADY_EXISTS');

            // Validar stock mínimo no sea mayor al actual
            if (insumoData.stockMinimo > insumoData.stockActual) {
                throw new Error('STOCK_MINIMO_MAYOR_ACTUAL');
            }

            return await model.addInsumo(insumoData);
        } catch (error) { throw error; }
    }

    // Listar todos los insumos
    getInsumos = async () => {
        try {
            const insumos = await model.getInsumos();
            
            // Calcular alerta para cada insumo
            return insumos.map(insumo => ({
                ...insumo,
                alertaStock: insumo.stockActual <= insumo.stockMinimo,
                porcentajeStock: Math.round((insumo.stockActual / insumo.stockMinimo) * 100)
            }));
        } catch (error) { throw error; }
    }

    // Obtener insumo por ID
    getInsumoById = async (id) => {
        try {
            const insumo = await model.getInsumoById(id);
            if (!insumo) throw new Error('INSUMO_NOT_FOUND');
            
            // Calcular alerta de stock bajo
            if (insumo.stockActual <= insumo.stockMinimo) {
                insumo.alertaStock = true;
                insumo.criticidad = this.calcularCriticidad(insumo.stockActual, insumo.stockMinimo);
                insumo.mensajeAlerta = `Stock ${insumo.criticidad}: ${insumo.stockActual} - Mínimo: ${insumo.stockMinimo}`;
            }
            
            return insumo;
        } catch (error) { throw error; }
    }

    // Actualizar insumo
    updateInsumo = async (insumoData) => {
        try {
            const { id, nombre, stockMinimo, stockActual, ...dataToUpdate } = insumoData;

            // Verificar que existe
            const existInsumo = await model.getInsumoById(id);
            if (!existInsumo) throw new Error('INSUMO_NOT_FOUND');

            // Si se cambia el nombre, verificar único
            if (nombre && nombre !== existInsumo.nombre) {
                const existingNombre = await model.getInsumoByNombre(nombre);
                if (existingNombre) throw new Error('NOMBRE_ALREADY_EXISTS');
                dataToUpdate.nombre = nombre;
            }

            // Validar stock mínimo si se actualiza
            if (stockMinimo !== undefined) {
                const newStockActual = stockActual ?? existInsumo.stockActual;
                if (stockMinimo > newStockActual) {
                    throw new Error('STOCK_MINIMO_MAYOR_ACTUAL');
                }
                dataToUpdate.stockMinimo = stockMinimo;
            }

            // Validar stock actual si se actualiza
            if (stockActual !== undefined) {
                const newStockMinimo = stockMinimo ?? existInsumo.stockMinimo;
                if (newStockMinimo > stockActual) {
                    throw new Error('STOCK_MINIMO_MAYOR_ACTUAL');
                }
                dataToUpdate.stockActual = stockActual;
            }

            return await model.updateInsumo(id, dataToUpdate);
        } catch (error) { throw error; }
    }

    // Eliminar (soft delete)
    deleteInsumo = async (id) => {
        try {
            const insumo = await model.getInsumoById(id);
            if (!insumo) throw new Error('INSUMO_NOT_FOUND');
            if (!insumo.activo) throw new Error('INSUMO_ALREADY_INACTIVE');

            return await model.deleteInsumo(id);
        } catch (error) { throw error; }
    }

    // Restaurar insumo
    restoreInsumo = async (id) => {
        try {
            const insumo = await model.getInsumoById(id);
            if (!insumo) throw new Error('INSUMO_NOT_FOUND');
            if (insumo.activo) throw new Error('INSUMO_ALREADY_ACTIVE');

            return await model.restoreInsumo(id);
        } catch (error) { throw error; }
    }

    // Actualizar stock (método principal usado por otros módulos)
    updateStock = async (id, cantidad, operacion = 'SET') => {
        try {
            // Validar cantidad
            if (cantidad < 0) throw new Error('CANTIDAD_NO_PUEDE_SER_NEGATIVA');

            // Verificar que existe
            const insumo = await model.getInsumoById(id);
            if (!insumo) throw new Error('INSUMO_NOT_FOUND');

            // Si es resta, verificar stock suficiente
            if (operacion === 'RESTAR') {
                const stockSuficiente = await model.verificarStockSuficiente(id, cantidad);
                if (!stockSuficiente) throw new Error('STOCK_INSUFICIENTE');
            }

            const result = await model.updateStock(id, cantidad, operacion);
            
            // Verificar si después de la operación quedó con stock bajo
            if (result.stockActual <= result.stockMinimo) {
                result.alertaStock = true;
                result.criticidad = this.calcularCriticidad(result.stockActual, result.stockMinimo);
                result.mensajeAlerta = `⚠️ Stock ${result.criticidad}: ${result.stockActual} (Mínimo: ${result.stockMinimo})`;
            }
            
            return result;
        } catch (error) { throw error; }
    }

    // Obtener alertas de stock bajo
    getLowStockInsumos = async () => {
        try {
            return await model.getLowStockInsumos();
        } catch (error) { throw error; }
    }

    // Calcular nivel de criticidad del stock
    calcularCriticidad = (stockActual, stockMinimo) => {
        const porcentaje = (stockActual / stockMinimo) * 100;
        if (porcentaje <= 25) return 'CRITICO';
        if (porcentaje <= 50) return 'ALTO';
        if (porcentaje <= 75) return 'MEDIO';
        return 'BAJO';
    }

    // Consumir insumos en un lavado (usado por módulo services)
    consumirInsumosLavado = async (detallesInsumos) => {
        try {
            const resultados = [];
            const errores = [];

            for (const detalle of detallesInsumos) {
                const { insumoId, cantidad } = detalle;
                try {
                    const resultado = await this.updateStock(insumoId, cantidad, 'RESTAR');
                    resultados.push({
                        insumoId,
                        nombre: resultado.nombre,
                        stockRestante: resultado.stockActual,
                        exito: true
                    });
                } catch (error) {
                    errores.push({
                        insumoId,
                        error: error.message
                    });
                }
            }

            if (errores.length > 0) {
                throw {
                    message: 'Error al consumir algunos insumos',
                    resultados,
                    errores
                };
            }

            return resultados;
        } catch (error) { throw error; }
    }

    // Agregar stock por compra (usado por módulo purchases)
    agregarStockCompra = async (detallesCompra) => {
        try {
            const resultados = [];
            for (const detalle of detallesCompra) {
                const { insumoId, cantidad } = detalle;
                const resultado = await this.updateStock(insumoId, cantidad, 'SUMAR');
                resultados.push(resultado);
            }
            return resultados;
        } catch (error) { throw error; }
    }

    // Obtener resumen de inventario para dashboard
    getResumenInventario = async () => {
        try {
            const insumos = await model.getInsumos();
            const alertas = await model.getLowStockInsumos();
            
            // Calcular valor aproximado del inventario
            const historialPrecios = await Promise.all(
                insumos.map(async insumo => {
                    const historial = await model.getHistorialMovimientos(insumo.id);
                    const ultimaCompra = historial.compras[0];
                    return {
                        insumoId: insumo.id,
                        ultimoPrecio: ultimaCompra?.precioUnit || 0
                    };
                })
            );

            const valorInventario = insumos.reduce((total, insumo) => {
                const precio = historialPrecios.find(p => p.insumoId === insumo.id)?.ultimoPrecio || 0;
                return total + (insumo.stockActual * precio);
            }, 0);

            return {
                totalInsumos: insumos.length,
                totalAlertas: alertas.length,
                valorInventario: Math.round(valorInventario * 100) / 100,
                porcentajeStockCritico: alertas.length > 0 ? Math.round((alertas.length / insumos.length) * 100) : 0,
                alertas: alertas.slice(0, 5), // Top 5 alertas
                criticos: alertas.filter(a => a.criticidad === 'CRITICO').length,
                altos: alertas.filter(a => a.criticidad === 'ALTO').length,
                medios: alertas.filter(a => a.criticidad === 'MEDIO').length
            };
        } catch (error) { throw error; }
    }

    getInsumosDropdown = async () => {
        try {
            return await model.getInsumosDropdown();
        } catch (error) { 
            throw error; 
        }
    }   
    
    // Obtener historial de un insumo
    getHistorialInsumo = async (id) => {
        try {
            const insumo = await model.getInsumoById(id);
            if (!insumo) throw new Error('INSUMO_NOT_FOUND');

            const historial = await model.getHistorialMovimientos(id);
            
            // Combinar y ordenar movimientos
            const movimientos = [
                ...historial.compras,
                ...historial.usos.map(u => ({
                    ...u,
                    fecha: new Date() // Simulado, idealmente vendría de vehículos completados
                }))
            ].sort((a, b) => b.fecha - a.fecha);

            return {
                insumo: {
                    id: insumo.id,
                    nombre: insumo.nombre,
                    stockActual: insumo.stockActual,
                    stockMinimo: insumo.stockMinimo
                },
                movimientos: movimientos.slice(0, 50) // Últimos 50 movimientos
            };
        } catch (error) { throw error; }
    }

    generarReportePdf = async () => {
        try {
            // Reutilizamos tus métodos existentes para obtener la data
            const insumos = await this.getInsumos();
            const resumen = await this.getResumenInventario();
            
            // Pasamos la data a Puppeteer
            const pdfBuffer = await generarPdfInventario(insumos, resumen);
            return pdfBuffer;
        } catch (error) { throw error; }
    }

}

export default ServiceInventory;