import prisma from '../../shared/prisma/client.js';

class ModelFinance {
    // Crear una nueva transacción contable
    create = async (data) => {
        try {
            return await prisma.transaccionContable.create({
                data,
                select: {
                    id: true,
                    categoria: true,
                    monto: true,
                    descripcion: true,
                    fecha: true,
                    vehiculoId: true,
                    compraId: true,
                    gastoId: true,
                    createdAt: true,
                    updatedAt: true,
                    vehiculo: {
                        select: {
                            id: true,
                            placa: true,
                            marca: true,
                            modelo: true
                        }
                    },
                    compra: {
                        select: {
                            id: true,
                            fecha: true,
                            total: true,
                            proveedor: {
                                select: {
                                    nombre: true
                                }
                            }
                        }
                    },
                    gasto: {
                        select: {
                            id: true,
                            fecha: true,
                            monto: true,
                            descripcion: true
                        }
                    }
                }
            });
        } catch (error) { throw error; }
    }

    // Obtener todas las transacciones
    findAll = async () => {
        try {
            return await prisma.transaccionContable.findMany({
                orderBy: { fecha: 'desc' },
                select: {
                    id: true,
                    categoria: true,
                    monto: true,
                    descripcion: true,
                    fecha: true,
                    vehiculoId: true,
                    compraId: true,
                    gastoId: true,
                    createdAt: true,
                    updatedAt: true,
                    vehiculo: {
                        select: {
                            id: true,
                            placa: true,
                            marca: true,
                            modelo: true
                        }
                    },
                    compra: {
                        select: {
                            id: true,
                            fecha: true,
                            total: true,
                            proveedor: {
                                select: {
                                    nombre: true
                                }
                            }
                        }
                    },
                    gasto: {
                        select: {
                            id: true,
                            fecha: true,
                            monto: true,
                            descripcion: true
                        }
                    }
                }
            });
        } catch (error) { throw error; }
    }

    // Obtener transacción por ID
    findById = async (id) => {
        try {
            return await prisma.transaccionContable.findUnique({
                where: { id },
                select: {
                    id: true,
                    categoria: true,
                    monto: true,
                    descripcion: true,
                    fecha: true,
                    vehiculoId: true,
                    compraId: true,
                    gastoId: true,
                    createdAt: true,
                    updatedAt: true,
                    vehiculo: {
                        select: {
                            id: true,
                            placa: true,
                            marca: true,
                            modelo: true
                        }
                    },
                    compra: {
                        select: {
                            id: true,
                            fecha: true,
                            total: true,
                            proveedor: {
                                select: {
                                    nombre: true
                                }
                            }
                        }
                    },
                    gasto: {
                        select: {
                            id: true,
                            fecha: true,
                            monto: true,
                            descripcion: true
                        }
                    }
                }
            });
        } catch (error) { throw error; }
    }

    // Actualizar transacción
    update = async (id, data) => {
        try {
            return await prisma.transaccionContable.update({
                where: { id },
                data,
                select: {
                    id: true,
                    categoria: true,
                    monto: true,
                    descripcion: true,
                    fecha: true,
                    vehiculoId: true,
                    compraId: true,
                    gastoId: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        } catch (error) { throw error; }
    }

    // Eliminar transacción
    delete = async (id) => {
        try {
            return await prisma.transaccionContable.delete({
                where: { id },
                select: {
                    id: true,
                    categoria: true,
                    monto: true,
                    descripcion: true
                }
            });
        } catch (error) { throw error; }
    }

    // Obtener total por categoría
    getTotalByCategoria = async (categoria) => {
        try {
            const result = await prisma.transaccionContable.aggregate({
                _sum: { monto: true },
                where: { categoria }
            });
            return result._sum.monto || 0;
        } catch (error) { throw error; }
    }

    // Obtener resumen financiero para dashboard
    getResumenFinanciero = async () => {
        try {
            const [
                ingresosLavado,
                gastosOperativos,
                comprasInsumos,
                otrosIngresos,
                otrosEgresos
            ] = await Promise.all([
                this.getTotalByCategoria('INGRESO_LAVADO'),
                this.getTotalByCategoria('GASTO_OPERATIVO'),
                this.getTotalByCategoria('COMPRA_INSUMO'),
                this.getTotalByCategoria('OTRO_INGRESO'),
                this.getTotalByCategoria('OTRO_EGRESO')
            ]);

            const totalIngresos = ingresosLavado + otrosIngresos;
            const totalEgresos = gastosOperativos + comprasInsumos + otrosEgresos;
            const balance = totalIngresos - totalEgresos;

            return {
                ingresos: {
                    lavados: ingresosLavado,
                    otros: otrosIngresos,
                    total: totalIngresos
                },
                egresos: {
                    operativos: gastosOperativos,
                    insumos: comprasInsumos,
                    otros: otrosEgresos,
                    total: totalEgresos
                },
                balance,
                rentabilidad: totalIngresos > 0 ? Math.round((balance / totalIngresos) * 100) : 0
            };
        } catch (error) { throw error; }
    }

    // Obtener historial de transacciones por período
    getHistorialTransacciones = async (fechaInicio, fechaFin, categoria = null) => {
        try {
            const where = {
                fecha: {
                    gte: new Date(fechaInicio),
                    lte: new Date(fechaFin)
                }
            };

            if (categoria) {
                where.categoria = categoria;
            }

            return await prisma.transaccionContable.findMany({
                where,
                orderBy: { fecha: 'desc' },
                select: {
                    id: true,
                    categoria: true,
                    monto: true,
                    descripcion: true,
                    fecha: true,
                    vehiculo: {
                        select: {
                            placa: true,
                            marca: true,
                            modelo: true
                        }
                    },
                    compra: {
                        select: {
                            id: true,
                            proveedor: {
                                select: {
                                    nombre: true
                                }
                            }
                        }
                    },
                    gasto: {
                        select: {
                            descripcion: true
                        }
                    }
                }
            });
        } catch (error) { throw error; }
    }
}

export default ModelFinance;