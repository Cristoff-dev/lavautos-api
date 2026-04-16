import prisma from '../../shared/prisma/client.js';

class ModelInventory {
    // Crear un nuevo insumo
    addInsumo = async (data) => {
        try {
            return await prisma.insumo.create({
                data,
                select: {
                    id: true,
                    nombre: true,
                    stockActual: true,
                    stockMinimo: true,
                    activo: true,
                    createdAt: true,
                    updatedAt: true,
                    servicios: {
                        select: {
                            servicio: {
                                select: {
                                    id: true,
                                    nombre: true
                                }
                            },
                            cantidad: true
                        }
                    }
                }
            });
        } catch (error) { throw error; }
    }

    // Obtener todos los insumos activos
    getInsumos = async () => {
        try {
            return await prisma.insumo.findMany({
                where: { activo: true },
                orderBy: { nombre: 'asc' },
                select: {
                    id: true,
                    nombre: true,
                    stockActual: true,
                    stockMinimo: true,
                    activo: true,
                    createdAt: true,
                    updatedAt: true,
                    servicios: {
                        select: {
                            servicio: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    precio: true
                                }
                            },
                            cantidad: true
                        }
                    }
                }
            });
        } catch (error) { throw error; }
    }

    // Obtener insumo por ID
    getInsumoById = async (id) => {
        try {
            return await prisma.insumo.findUnique({
                where: { id },
                select: {
                    id: true,
                    nombre: true,
                    stockActual: true,
                    stockMinimo: true,
                    activo: true,
                    createdAt: true,
                    updatedAt: true,
                    servicios: {
                        select: {
                            servicio: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    precio: true
                                }
                            },
                            cantidad: true
                        }
                    },
                    compras: {
                        select: {
                            compra: {
                                select: {
                                    id: true,
                                    fecha: true,
                                    proveedor: {
                                        select: {
                                            nombre: true
                                        }
                                    }
                                }
                            },
                            cantidad: true,
                            precioUnit: true
                        },
                        take: 5,
                        orderBy: {
                            compra: {
                                fecha: 'desc'
                            }
                        }
                    }
                }
            });
        } catch (error) { throw error; }
    }

    // Obtener insumo por nombre (para validar duplicados)
    getInsumoByNombre = async (nombre) => {
        try {
            return await prisma.insumo.findUnique({
                where: { nombre },
                select: { 
                    id: true, 
                    nombre: true,
                    stockActual: true,
                    stockMinimo: true
                }
            });
        } catch (error) { throw error; }
    }

    // Actualizar insumo
    updateInsumo = async (id, data) => {
        try {
            return await prisma.insumo.update({
                where: { id },
                data,
                select: {
                    id: true,
                    nombre: true,
                    stockActual: true,
                    stockMinimo: true,
                    activo: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        } catch (error) { throw error; }
    }

    // Soft delete (desactivar)
    deleteInsumo = async (id) => {
        try {
            return await prisma.insumo.update({
                where: { id },
                data: { activo: false },
                select: {
                    id: true,
                    nombre: true,
                    activo: true
                }
            });
        } catch (error) { throw error; }
    }

    // Restaurar insumo
    restoreInsumo = async (id) => {
        try {
            return await prisma.insumo.update({
                where: { id },
                data: { activo: true },
                select: {
                    id: true,
                    nombre: true,
                    activo: true
                }
            });
        } catch (error) { throw error; }
    }

    // Actualizar stock (usado en lavados y compras)
    updateStock = async (id, cantidad, operacion = 'SET') => {
        try {
            let data = {};
            
            if (operacion === 'SUMAR') {
                data = { stockActual: { increment: cantidad } };
            } else if (operacion === 'RESTAR') {
                data = { stockActual: { decrement: cantidad } };
            } else {
                data = { stockActual: cantidad };
            }

            return await prisma.insumo.update({
                where: { id },
                data,
                select: {
                    id: true,
                    nombre: true,
                    stockActual: true,
                    stockMinimo: true,
                    activo: true
                }
            });
        } catch (error) { 
            if (error.code === 'P2025') {
                throw new Error('INSUMO_NOT_FOUND');
            }
            throw error; 
        }
    }

    // Obtener insumos con stock bajo (alerta)
    getLowStockInsumos = async () => {
        try {
            const insumos = await prisma.$queryRaw`
                SELECT 
                    id,
                    nombre,
                    "stockActual",
                    "stockMinimo",
                    CASE 
                        WHEN "stockActual" <= "stockMinimo" * 0.25 THEN 'CRITICO'
                        WHEN "stockActual" <= "stockMinimo" * 0.5 THEN 'ALTO'
                        WHEN "stockActual" <= "stockMinimo" * 0.75 THEN 'MEDIO'
                        ELSE 'BAJO'
                    END as criticidad,
                    ROUND(("stockActual" / "stockMinimo") * 100) as porcentaje
                FROM "Insumo"
                WHERE activo = true 
                AND "stockActual" <= "stockMinimo"
                ORDER BY ("stockActual" / "stockMinimo") ASC
            `;
            
            return insumos;
        } catch (error) { throw error; }
    }

    // Obtener insumos para dropdown (selectores)
    getInsumosDropdown = async () => {
        try {
            return await prisma.insumo.findMany({
                where: { activo: true },
                orderBy: { nombre: 'asc' },
                select: {
                    id: true,
                    nombre: true,
                    stockActual: true,
                    stockMinimo: true
                }
            });
        } catch (error) { throw error; }
    }

    // Verificar stock suficiente para una cantidad
    verificarStockSuficiente = async (id, cantidadRequerida) => {
        try {
            const insumo = await prisma.insumo.findUnique({
                where: { id },
                select: { stockActual: true }
            });
            
            if (!insumo) throw new Error('INSUMO_NOT_FOUND');
            return insumo.stockActual >= cantidadRequerida;
        } catch (error) { throw error; }
    }

    // Obtener historial de movimientos del insumo
    getHistorialMovimientos = async (id) => {
        try {
            // Compras donde aparece este insumo
            const compras = await prisma.detalleCompra.findMany({
                where: { insumoId: id },
                select: {
                    cantidad: true,
                    precioUnit: true,
                    compra: {
                        select: {
                            id: true,
                            fecha: true,
                            proveedor: {
                                select: {
                                    nombre: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    compra: {
                        fecha: 'desc'
                    }
                },
                take: 20
            });

            // Servicios donde se usa (para saber dónde se gasta)
            const usos = await prisma.servicioInsumo.findMany({
                where: { insumoId: id },
                select: {
                    cantidad: true,
                    servicio: {
                        select: {
                            id: true,
                            nombre: true,
                            precio: true
                        }
                    }
                }
            });

            return {
                compras: compras.map(c => ({
                    tipo: 'ENTRADA',
                    fecha: c.compra.fecha,
                    cantidad: c.cantidad,
                    precioUnit: c.precioUnit,
                    proveedor: c.compra.proveedor.nombre,
                    documento: `Compra #${c.compra.id}`
                })),
                usos: usos.map(u => ({
                    tipo: 'SALIDA',
                    cantidad: u.cantidad,
                    servicio: u.servicio.nombre,
                    precioServicio: u.servicio.precio
                }))
            };
        } catch (error) { throw error; }
    }
}

export default ModelInventory;