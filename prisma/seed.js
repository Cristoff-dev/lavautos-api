import pkg from '@prisma/client';
import bcrypt from 'bcrypt';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando la carga de datos (Seed)...');

    // 1. CREAR ADMINISTRADOR INICIAL
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin123*', salt);

    const admin = await prisma.usuario.upsert({
        where: { email: 'admin@lavautos.com' },
        update: {}, 
        create: {
            email: 'admin@lavautos.com',
            nombre: 'Administrador General',
            password: adminPassword,
            rol: 'ADMIN',
            activo: true,
        },
    });
    console.log(`✅ Usuario Admin verificado: ${admin.email}`);

    // 2. CREAR TIPOS DE SERVICIOS
    const servicios = [
        { nombre: 'Lavado Sencillo', precio: 10.0, descripcion: 'Lavado de carrocería básica' },
        { nombre: 'Lavado Premium', precio: 25.0, descripcion: 'Motor, Chasis y Pulitura' },
        { nombre: 'Limpieza Tapicería', precio: 45.0, descripcion: 'Limpieza profunda de asientos y techos' },
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
        { nombre: 'Champú Activo', stockActual: 100.0, stockMinimo: 20.0, unidad: 'Litros' },
        { nombre: 'Desengrasante', stockActual: 50.0, stockMinimo: 10.0, unidad: 'Litros' },
        { nombre: 'Silicona de Gomas', stockActual: 30.0, stockMinimo: 5.0, unidad: 'Litros' },
    ];

    for (const i of insumos) {
        await prisma.insumo.upsert({
            where: { nombre: i.nombre },
            update: {},
            create: i, // Ahora 'i' contiene 'unidad', que es lo que espera el modelo
        });
    }
    console.log('✅ Inventario de insumos cargado');

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