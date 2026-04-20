import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando la carga masiva de 20 registros por tabla...');

    // ==========================================
    // 0. LIMPIEZA DE TABLAS (Orden estricto por FK)
    // ==========================================
    console.log('🧹 Limpiando base de datos...');
    await prisma.detalleCompra.deleteMany();
    await prisma.servicioInsumo.deleteMany();
    await prisma.detalleServicio.deleteMany();
    await prisma.compra.deleteMany();
    await prisma.gastoOperativo.deleteMany();
    await prisma.transaccionContable.deleteMany();
    await prisma.vehiculo.deleteMany();
    await prisma.tipoVehiculo.deleteMany();
    await prisma.insumo.deleteMany();
    await prisma.servicio.deleteMany();
    await prisma.proveedor.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.service.deleteMany();
    await prisma.provider.deleteMany();

    // Nombres para darle realismo a los datos
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
    console.log('📦 Creando 20 Proveedores y 20 Insumos...');
    const proveedores = [];
    const insumos = [];
    for (let i = 0; i < 20; i++) {
        proveedores.push(await prisma.proveedor.create({
            data: {
                rif: `J-${30000000 + i}`,
                nombre: `Distribuidora ${i + 1} C.A.`,
                telefono: `0251-55500${i.toString().padStart(2, '0')}`,
                email: `contacto@distribuidora${i + 1}.com`,
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
    // 4. SERVICIOS (Y Pivote Servicio-Insumo)
    // ==========================================
    console.log('🚿 Creando 20 Servicios y sus recetas...');
    const servicios = [];
    for (let i = 0; i < 20; i++) {
        const servicio = await prisma.servicio.create({
            data: {
                nombre: `Lavado Especial Tipo ${i + 1}`,
                precio: 10.0 + (i * 2),
                descripcion: `Descripción detallada del servicio ${i + 1}`,
                duracionMinutos: 30 + i,
                esCombo: i % 5 === 0,
                tipoVehiculo: i % 2 === 0 ? 'SEDAN' : 'SUV',
            }
        });
        servicios.push(servicio);

        // Relación Pivote: Cada servicio usa 1 insumo
        await prisma.servicioInsumo.create({
            data: {
                servicioId: servicio.id,
                insumoId: insumos[i].id,
                cantidad: 0.5 + (i * 0.1)
            }
        });
    }

    // ==========================================
    // 5. VEHÍCULOS (Ficha y Operación)
    // ==========================================
    console.log('🚗 Creando 20 Tipos de Vehículo y 20 Vehículos en cola...');
    const tiposVehiculo = [];
    const vehiculos = [];
    
    // Filtrar un lavador disponible para asignar
    const lavadores = usuarios.filter(u => u.rol === 'LAVADOR');

    for (let i = 0; i < 20; i++) {
        // Ficha Técnica (ADN)
        const tipoV = await prisma.tipoVehiculo.create({
            data: {
                placa: `ABC-${100 + i}`,
                marca: i % 2 === 0 ? 'Toyota' : 'Chevrolet',
                modelo: `Modelo ${i + 1}`,
                color: 'Negro',
                clase: i % 2 === 0 ? 'Sedan' : 'SUV',
                clienteId: clientes[i].id
            }
        });
        tiposVehiculo.push(tipoV);

        // Operación actual
        const vehiculo = await prisma.vehiculo.create({
            data: {
                placa: `OP-${tipoV.placa}`, // Placa única de operación
                marca: tipoV.marca,
                modelo: tipoV.modelo,
                estado: i % 3 === 0 ? 'LISTO' : 'EN_ESPERA',
                tipoVehiculoId: tipoV.id,
                conductorId: clientes[i].id,
                lavadorId: lavadores[i % lavadores.length].id,
                montoTotal: servicios[i].precio,
                comisionLavador: 5.0,
            }
        });
        vehiculos.push(vehiculo);

        // Relación Pivote: Detalle del Servicio realizado al vehículo
        await prisma.detalleServicio.create({
            data: {
                vehiculoId: vehiculo.id,
                servicioId: servicios[i].id,
                precioFijo: servicios[i].precio
            }
        });
    }

    // ==========================================
    // 6. CONTABILIDAD (Transacciones, Compras, Gastos)
    // ==========================================
    console.log('📊 Generando Movimientos Contables (Ingresos, Compras y Gastos)...');
    for (let i = 0; i < 20; i++) {
        // A. Crear 20 Ingresos por Lavado
        await prisma.transaccionContable.create({
            data: {
                categoria: 'INGRESO_LAVADO',
                monto: vehiculos[i].montoTotal,
                descripcion: `Ingreso por lavado - ${vehiculos[i].placa}`,
                vehiculoId: vehiculos[i].id,
            }
        });

        // B. Crear 20 Compras y sus respectivas Transacciones
        const transaccionCompra = await prisma.transaccionContable.create({
            data: {
                categoria: 'COMPRA_INSUMO',
                monto: 50.0 + i,
                descripcion: `Factura de compra #${1000 + i}`,
            }
        });
        
        const compra = await prisma.compra.create({
            data: {
                total: 50.0 + i,
                proveedorId: proveedores[i].id,
                transaccionId: transaccionCompra.id
            }
        });

        // Detalle de esa compra
        await prisma.detalleCompra.create({
            data: {
                compraId: compra.id,
                insumoId: insumos[i].id,
                cantidad: 10,
                precioUnit: 5.0 + (i * 0.1)
            }
        });

        // C. Crear 20 Gastos Operativos y sus Transacciones
        const transaccionGasto = await prisma.transaccionContable.create({
            data: {
                categoria: 'GASTO_OPERATIVO',
                monto: 20.0 + i,
                descripcion: `Pago de servicio/mantenimiento #${i + 1}`,
            }
        });

        await prisma.gastoOperativo.create({
            data: {
                concepto: `Mantenimiento equipo ${i + 1}`,
                monto: 20.0 + i,
                transaccionId: transaccionGasto.id
            }
        });
    }

    // ==========================================
    // 7. TABLAS INDEPENDIENTES (Provider, Service)
    // ==========================================
    console.log('⚙️ Llenando tablas UUID extra...');
    for (let i = 0; i < 20; i++) {
        await prisma.provider.create({
            data: {
                name: `External Provider ${i + 1}`,
                contactName: `Contact ${i + 1}`,
                phone: `0000-00000${i.toString().padStart(2, '0')}`,
            }
        });
        
        await prisma.service.create({
            data: {
                name: `External Service ${i + 1}`,
                price: 100.0 + i,
            }
        });
    }

    console.log('✅ ¡Semilla plantada con éxito! Toda la BD tiene exactamente 20 registros relacionados.');
}

main()
    .catch((e) => {
        console.error('❌ Error en el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });