import prisma from '../../shared/prisma/client.js';

class ModelFinance {
    create = async (data) => {
        try {
            return await prisma.transaccionContable.create({
                data
            });
        } catch (error) { throw error; }
    }

    findAll = async () => {
        try {
            return await prisma.transaccionContable.findMany({
                orderBy: { fecha: 'desc' }
            });
        } catch (error) { throw error; }
    }

    findById = async (id) => {
        try {
            return await prisma.transaccionContable.findUnique({
                where: { id }
            });
        } catch (error) { throw error; }
    }

    update = async (id, data) => {
        try {
            return await prisma.transaccionContable.update({
                where: { id },
                data
            });
        } catch (error) { throw error; }
    }

    delete = async (id) => {
        try {
            return await prisma.transaccionContable.delete({
                where: { id }
            });
        } catch (error) { throw error; }
    }

    getTotalByCategoria = async (categoria) => {
        try {
            const result = await prisma.transaccionContable.aggregate({
                _sum: { monto: true },
                where: { categoria }
            });
            return result._sum.monto || 0;
        } catch (error) { throw error; }
    }

    getResumenFinanciero = async () => {
        try {
            const [
                ingresosLavado, gastosOperativos, comprasInsumos, otrosIngresos, otrosEgresos, pagoComision
            ] = await Promise.all([
                this.getTotalByCategoria('INGRESO_LAVADO'),
                this.getTotalByCategoria('GASTO_OPERATIVO'),
                this.getTotalByCategoria('COMPRA_INSUMO'),
                this.getTotalByCategoria('OTRO_INGRESO'),
                this.getTotalByCategoria('OTRO_EGRESO'),
                this.getTotalByCategoria('PAGO_COMISION') // Faltaba evaluar comisiones
            ]);

            const totalIngresos = ingresosLavado + otrosIngresos;
            const totalEgresos = gastosOperativos + comprasInsumos + otrosEgresos + pagoComision;
            const balance = totalIngresos - totalEgresos;

            return {
                ingresos: { lavados: ingresosLavado, otros: otrosIngresos, total: totalIngresos },
                egresos: { operativos: gastosOperativos, insumos: comprasInsumos, comisiones: pagoComision, otros: otrosEgresos, total: totalEgresos },
                balance,
                rentabilidad: totalIngresos > 0 ? Number(((balance / totalIngresos) * 100).toFixed(2)) : 0
            };
        } catch (error) { throw error; }
    }

    getHistorialTransacciones = async (fechaInicio, fechaFin, categoria = null) => {
        try {
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);

            // Verificación de seguridad: Si la fecha es inválida, lanzamos error controlado
            if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
                throw new Error("Invalid Date");
            }

            const where = {
                fecha: {
                    gte: inicio,
                    lte: fin
                }
            };

            if (categoria) {
                where.categoria = categoria;
            }

            return await prisma.transaccionContable.findMany({
                where,
                orderBy: { fecha: 'desc' }
            });
        } catch (error) { throw error; }
    }
}

export default ModelFinance;