import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando la carga de datos (Seed) para el Sistema de Autolavado...');

    // 1. LIMPIEZA DE DATOS (Opcional, para evitar duplicados en pruebas)
    // Cuidado: Esto borra los datos actuales de estas tablas
    await prisma.transaccionContable.deleteMany({});
    console.log('🧹 Tablas contables limpiadas');

    // 2. CREAR ADMINISTRADOR INICIAL
    const adminPassword = await bcrypt.hash('Admin123*', 10);
    const admin = await prisma.usuario.upsert({
        where: { username: 'admin' },
        update: { password: adminPassword },
        create: {
            username: 'admin',
            nombre: 'Administrador General',
            password: adminPassword,
            rol: 'ADMIN',
            activo: true,
        },
    });
    console.log(`✅ Usuario Admin verificado: ${admin.username}`);

    // 3. CREAR VEHÍCULO DE PRUEBA (Necesario para relaciones de ingreso)
    // Primero necesitamos un cliente y un tipo de vehículo
    const cliente = await prisma.cliente.upsert({
        where: { cedula: 'V-12345678' },
        update: {},
        create: {
            cedula: 'V-12345678',
            nombre: 'Juan Pérez',
            telefono: '0412-5555555',
        }
    });

    const tipoVehiculo = await prisma.tipoVehiculo.upsert({
        where: { id: 1 }, // Asumiendo ID 1 para Sedan
        update: {},
        create: {
            nombre: 'Sedan',
            descripcion: 'Vehículo particular estándar',
            propietarioId: cliente.id
        }
    });

    const vehiculo = await prisma.vehiculo.create({
        data: {
            placa: 'ABC123DEF',
            marca: 'Toyota',
            modelo: 'Corolla',
            color: 'Blanco',
            tipoId: tipoVehiculo.id,
            conductorId: cliente.id,
            estado: 'LISTO'
        }
    });

    // 4. MOVIMIENTOS CONTABLES (Alineados con el nuevo esquema y lógica)
    console.log('📊 Generando movimientos contables...');
    
    await prisma.transaccionContable.createMany({
        data: [
            // INGRESOS
            { 
                categoria: 'INGRESO_LAVADO', 
                monto: 15.0, 
                descripcion: `Lavado Sencillo - Placa ${vehiculo.placa}`,
                vehiculoId: vehiculo.id,
                fecha: new Date('2026-04-10T10:00:00Z')
            },
            { 
                categoria: 'INGRESO_LAVADO', 
                monto: 25.0, 
                descripcion: `Lavado Premium - Placa ${vehiculo.placa}`,
                vehiculoId: vehiculo.id,
                fecha: new Date('2026-04-11T14:30:00Z')
            },
            { 
                categoria: 'OTRO_INGRESO', 
                monto: 5.0, 
                descripcion: "Venta de ambientador de pino",
                fecha: new Date('2026-04-12T09:15:00Z')
            },

            // EGRESOS (Todos con montos positivos, la categoría define que resta)
            { 
                categoria: 'GASTO_OPERATIVO', 
                monto: 40.0, 
                descripcion: "Pago de servicio de agua (Mes Abril)",
                fecha: new Date('2026-04-12T11:00:00Z')
            },
            { 
                categoria: 'COMPRA_INSUMO', 
                monto: 60.0, 
                descripcion: "Compra de 10L de Jabón pH Neutro",
                fecha: new Date('2026-04-13T16:00:00Z')
            },
            { 
                categoria: 'PAGO_COMISION', 
                monto: 10.0, 
                descripcion: "Comisión lavado operario #4",
                fecha: new Date('2026-04-13T18:00:00Z')
            },
            { 
                categoria: 'OTRO_EGRESO', 
                monto: 12.5, 
                descripcion: "Reparación menor manguera de presión",
                fecha: new Date('2026-04-14T08:30:00Z')
            }
        ]
    });

    console.log('✅ Base de datos poblada con éxito');
}

main()
    .catch((e) => {
        console.error('❌ Error en el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });