import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando la carga de datos (Seed)...');

    // 1. CREAR ADMINISTRADOR INICIAL
    const adminPassword = await bcrypt.hash('Admin123*', 10);

    const admin = await prisma.usuario.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin@lavautos.com',
            nombre: 'Administrador General',
            password: admin123,
            rol: 'ADMIN',
            activo: true,
        },
    });
    // Corregido: Ahora imprime admin.username en lugar de admin.email
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

    // 3. CREAR INSUMOS CRÍTICOS
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

    // 4. CLIENTE DE PRUEBA
    const clientePrueba = await prisma.cliente.upsert({
        where: { cedula: '10101010' },
        update: {},
        create: {
            cedula: '10101010',
            nombre: 'Cliente de Prueba Postman',
            telefono: '555000111',
            email: 'test@cliente.com', // El cliente SÍ puede conservar su email
            activo: true
        }
    });
    console.log(`✅ Cliente de prueba verificado: ${clientePrueba.nombre}`);

    console.log('🚀 Base de datos lista para pruebas.');
}

main()
    .catch((e) => {
        console.error('❌ Error ejecutando el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });