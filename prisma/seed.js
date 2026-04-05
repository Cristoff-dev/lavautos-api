import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando la carga de datos (Seed)...');

    // 1. CREAR ADMINISTRADOR INICIAL
    const adminPassword = await bcrypt.hash('Admin123*', 10);

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

    // 2. CREAR TIPOS DE SERVICIOS (Ajustado: sin 'descripcion', con 'esCombo')
    const servicios = [
        { nombre: 'Lavado Sencillo', precio: 10.0, esCombo: false },
        { nombre: 'Lavado Premium', precio: 25.0, esCombo: false },
        { nombre: 'Combo Limpieza Total', precio: 45.0, esCombo: true }, // Ejemplo de combo
    ];

    for (const s of servicios) {
        await prisma.servicio.upsert({
            where: { nombre: s.nombre },
            update: { precio: s.precio },
            create: s,
        });
    }
    console.log('✅ Catálogo de servicios inicializado');

    // 3. CREAR INSUMOS CRÍTICOS (Ajustado: sin 'unidad', solo métricas numéricas)
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