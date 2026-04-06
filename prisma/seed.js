import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando la carga de datos (Seed) con Finanzas...');

    // 1. CREAR ADMINISTRADOR INICIAL
    const adminPassword = await bcrypt.hash('Admin123*', 10);

    const admin = await prisma.usuario.upsert({
        where: { username: 'admin' }, // Ajustado a 'username' según tu schema
        update: {},
        create: {
            username: 'admin',
            nombre: 'Administrador General',
            password: adminPassword,
            rol: 'ADMIN',
            activo: true,
        },
    });
    console.log(`✅ Usuario Admin verificado: ${admin.username}`);

    // 2. CREAR TIPOS DE SERVICIOS
    const servicios = [
        { nombre: 'Lavado Sencillo', precio: 10.0, esCombo: false },
        { nombre: 'Lavado Premium', precio: 25.0, esCombo: false },
        { nombre: 'Combo Limpieza Total', precio: 45.0, esCombo: true },
    ];

    for (const s of servicios) {
        await prisma.servicio.upsert({
            where: { nombre: s.nombre },
            update: { precio: s.precio },
            create: s,
        });
    }
    console.log('✅ Catálogo de servicios inicializado');

    // 3. CREAR UN CLIENTE Y VEHÍCULO PARA PRUEBAS CONTABLES
    const cliente = await prisma.cliente.upsert({
        where: { cedula: 'V-20123456' },
        update: {},
        create: {
            cedula: 'V-20123456',
            nombre: 'Carlos Rodriguez',
            telefono: '0414-1234567',
            propiedades: {
                create: {
                    placa: 'AE123BB',
                    marca: 'Toyota',
                    modelo: 'Corolla',
                    color: 'Blanco',
                    clase: 'SEDAN'
                }
            }
        },
        include: { propiedades: true }
    });

    const adnId = cliente.propiedades[0].id;

    // 4. CREAR UNA OPERACIÓN DE LAVADO (VEHICULO)
    const vehiculoOperacion = await prisma.vehiculo.create({
        data: {
            tipoVehiculoId: adnId,
            conductorId: cliente.id,
            estado: 'ENTREGADO_Y_PAGADO',
            montoTotal: 25.0,
            comisionLavador: 6.25, // 25% automático
        }
    });

    // 5. SEMBRAR TRANSACCIONES CONTABLES (Módulo FINANCE)
    // Borramos transacciones previas para evitar basura en pruebas de balance
    await prisma.transaccionContable.deleteMany({});

    await prisma.transaccionContable.createMany({
        data: [
            { 
                categoria: 'INGRESO_LAVADO', 
                monto: 25.0, 
                descripcion: `Cobro Lavado Placa ${cliente.propiedades[0].placa}`,
                vehiculoId: vehiculoOperacion.id 
            },
            { 
                categoria: 'GASTO_OPERATIVO', 
                monto: 15.0, 
                descripcion: "Pago de servicios (Electricidad)" 
            },
            { 
                categoria: 'COMPRA_INSUMO', 
                monto: 30.0, 
                descripcion: "Compra de 5L de Champú Activo" 
            }
        ]
    });
    console.log('✅ Movimientos contables de prueba generados');

    // 6. CREAR INSUMOS CRÍTICOS
    const insumos = [
        { nombre: 'Champú Activo', stockActual: 100.0, stockMinimo: 20.0 },
        { nombre: 'Desengrasante', stockActual: 50.0, stockMinimo: 10.0 },
        { nombre: 'Silicona de Gomas', stockActual: 30.0, stockMinimo: 5.0 },
    ];

    for (const i of insumos) {
        await prisma.insumo.upsert({
            where: { nombre: i.nombre },
            update: {},
            create: i,
        });
    }
    console.log('✅ Inventario de insumos cargado');
    console.log('🚀 Base de datos lista con historial contable.');
}

main()
    .catch((e) => {
        console.error('❌ Error ejecutando el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });