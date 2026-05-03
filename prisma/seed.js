import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando la carga masiva de registros para Lavautos...');

    // ==========================================
    // 0. LIMPIEZA DE TABLAS (Orden estricto por FK)
    // ==========================================
    console.log('🧹 Limpiando base de datos...');
    // Primero tablas dependientes (hijas)
    await prisma.detalleCompra.deleteMany();
    await prisma.servicioInsumo.deleteMany();
    await prisma.detalleServicio.deleteMany();
    await prisma.transaccionContable.deleteMany();
    await prisma.compra.deleteMany();
    await prisma.facturacion.deleteMany();
    // Luego tablas principales (padres)
    await prisma.vehiculo.deleteMany();
    await prisma.tipoVehiculo.deleteMany();
    await prisma.insumo.deleteMany();
    await prisma.servicio.deleteMany();
    await prisma.proveedor.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.service.deleteMany();
    await prisma.provider.deleteMany();

    const nombresPersonas = [
        'Keiber', 'Aarón', 'Angel', 'Anthony', 'Hendelber', 
        'José', 'Luis', 'Mariana', 'Stefany', 'Carlos', 
        'María', 'Pedro', 'Ana', 'Carmen', 'Jorge', 
        'Rosa', 'Miguel', 'Elena', 'David', 'Laura'
    ];

    // ==========================================
    // 1. USUARIOS
    // ==========================================
    console.log('👤 Creando 20 Usuarios...');
    const passwordHash = await bcrypt.hash('admin123', 10);
    const usuarios = [];

    for (let i = 0; i < 20; i++) {
        let rolAsignado = 'LAVADOR'; 
        if (i === 0) rolAsignado = 'ADMIN';
        else if (i < 5) rolAsignado = 'CAJERO';
        else if (i < 10) rolAsignado = 'SUPERVISOR';

        usuarios.push(await prisma.usuario.create({
            data: {
                nombre: nombresPersonas[i],
                username: `user${i + 1}`,
                password: passwordHash,
                rol: rolAsignado,
                activo: true,
            }
        }));
    }

    // ==========================================
    // 2. CLIENTES
    // ==========================================
    console.log('👥 Creando 20 Clientes...');
    const clientes = [];
    for (let i = 0; i < 20; i++) {
        clientes.push(await prisma.cliente.create({
            data: {
                cedula: `V-${20000000 + i}`,
                nombre: `${nombresPersonas[19 - i]} Apellido${i}`,
                telefono: `0414-12345${i.toString().padStart(2, '0')}`,
                email: `cliente${i + 1}@email.com`,
                activo: true,
            }
        }));
    }

    // ==========================================
    // 3. PROVEEDORES E INSUMOS
    // ==========================================
    console.log('📦 Creando Proveedores e Insumos...');
    const proveedores = [];
    const insumos = [];
    for (let i = 0; i < 20; i++) {
        proveedores.push(await prisma.proveedor.create({
            data: {
                rif: `J-${30000000 + i}`,
                nombre: `Distribuidora ${i + 1} C.A.`,
                telefono: `0251-55500${i.toString().padStart(2, '0')}`,
            }
        }));

        insumos.push(await prisma.insumo.create({
            data: {
                nombre: `Producto Químico ${i + 1}`,
                stockActual: 100.0 + i,
                stockMinimo: 10.0,
            }
        }));
    }

    // ==========================================
    // 4. SERVICIOS
    // ==========================================
    console.log('🚿 Creando Servicios...');
    const servicios = [];
    for (let i = 0; i < 20; i++) {
        const servicio = await prisma.servicio.create({
            data: {
                nombre: `Lavado Especial Tipo ${i + 1}`,
                precio: 10.0 + (i * 2),
                duracionMinutos: 30 + i,
                tipoVehiculo: i % 2 === 0 ? 'SEDAN' : 'SUV',
            }
        });
        servicios.push(servicio);

        await prisma.servicioInsumo.create({
            data: {
                servicioId: servicio.id,
                insumoId: insumos[i].id,
                cantidad: 0.5
            }
        });
    }

    // ==========================================
    // 5. VEHÍCULOS Y FACTURACIÓN (Flujo Operativo)
    // ==========================================
    console.log('🚗 Creando Check-ins y Facturación...');
    const lavadores = usuarios.filter(u => u.rol === 'LAVADOR');

    for (let i = 0; i < 20; i++) {
        // 1. TipoVehiculo (Ficha Técnica)
        const tipoV = await prisma.tipoVehiculo.create({
            data: {
                placa: `ABC-${100 + i}`,
                marca: i % 2 === 0 ? 'Toyota' : 'Ford',
                modelo: `Modelo ${i}`,
                color: 'Gris',
                clase: i % 2 === 0 ? 'Sedan' : 'SUV',
                clienteId: clientes[i].id
            }
        });

        // 2. Vehiculo (Check-in/Entrada)
        const vehiculo = await prisma.vehiculo.create({
            data: {
                tipoVehiculoId: tipoV.id,
                conductorId: clientes[i].id,
            }
        });

        // 3. Facturacion (El proceso de lavado en sí)
        const factura = await prisma.facturacion.create({
            data: {
                vehiculoId: vehiculo.id,
                estado: i % 3 === 0 ? 'ENTREGADO_Y_PAGADO' : 'EN_ESPERA',
                lavadorId: lavadores[i % lavadores.length].id,
                montoTotal: servicios[i].precio,
                comisionLavador: 5.0,
            }
        });

        // 4. DetalleServicio (Qué se le hizo)
        await prisma.detalleServicio.create({
            data: {
                facturacionId: factura.id,
                servicioId: servicios[i].id,
                precioFijo: servicios[i].precio
            }
        });

        // ==========================================
        // 6. CONTABILIDAD
        // ==========================================
        
        // A. Registrar Ingreso si está pagado
        if (factura.estado === 'ENTREGADO_Y_PAGADO') {
            await prisma.transaccionContable.create({
                data: {
                    categoria: 'INGRESO_LAVADO',
                    monto: factura.montoTotal,
                    descripcion: `Pago Lavado - Placa ${tipoV.placa}`,
                    facturacionId: factura.id,
                }
            });
        }

        // B. Compras de insumos
        const transaccionCompra = await prisma.transaccionContable.create({
            data: {
                categoria: 'COMPRA_INSUMO',
                monto: 50.0 + i,
                descripcion: `Compra Insumos Fact #${100 + i}`,
            }
        });

        const compra = await prisma.compra.create({
            data: {
                total: 50.0 + i,
                proveedorId: proveedores[i].id,
                transaccionId: transaccionCompra.id
            }
        });

        await prisma.detalleCompra.create({
            data: {
                compraId: compra.id,
                insumoId: insumos[i].id,
                cantidad: 5,
                precioUnit: 10.0
            }
        });

        // C. Gasto Operativo Directo
        await prisma.transaccionContable.create({
            data: {
                categoria: 'GASTO_OPERATIVO',
                monto: 15.0,
                descripcion: `Gasto operativo general ${i+1}`,
            }
        });
    }

    // ==========================================
    // 7. TABLAS EXTERNAS / UUID
    // ==========================================
    for (let i = 0; i < 20; i++) {
        await prisma.provider.create({ data: { name: `Ext Provider ${i}` } });
        await prisma.service.create({ data: { name: `Ext Service ${i}`, price: 50.0 } });
    }

    console.log('✅ ¡Semilla plantada con éxito! La base de datos está lista.');
}

main()
    .catch((e) => {
        console.error('❌ Error en el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });