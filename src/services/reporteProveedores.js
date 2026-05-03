import puppeteer from 'puppeteer';

export const generarPdfProveedores = async (proveedores) => {
    const proveedoresActivos = proveedores.filter(p => p.activo === true);
    
    const totalProveedores = proveedoresActivos.length;
    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Reporte de Proveedores</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="p-8 bg-gray-50 text-gray-800 font-sans">
        <!-- HEADER -->
        <div class="mb-8 border-b-2 border-blue-600 pb-4 flex justify-between items-end">
            <div class="flex items-center space-x-3">
                <div class="bg-blue-600 p-3 rounded-lg text-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-blue-800 uppercase tracking-wide">Reporte de Proveedores</h1>
                    <p class="text-blue-500 font-semibold text-lg">Directorio Activo</p>
                    <p class="text-sm text-gray-400 mt-1">Generado el: ${new Date().toLocaleString()}</p>
                </div>
            </div>
            
            <div class="flex gap-4">
                <div class="bg-white p-4 rounded-lg border border-blue-100 shadow-sm min-w-[140px] text-center">
                    <p class="text-xs text-gray-400 uppercase font-bold mb-1">Total Proveedores</p>
                    <p class="text-2xl font-black text-blue-700">${totalProveedores}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-blue-600 text-white">
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">ID</th>
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">RIF</th>
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">Nombre</th>
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">Teléfono</th>
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">Email</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
    `;

    for (const prov of proveedoresActivos) {
        html += `
                    <tr class="hover:bg-blue-50 transition-colors">
                        <td class="py-3 px-4 text-sm text-gray-500 font-medium">#${String(prov.id).padStart(3, '0')}</td>
                        <td class="py-3 px-4 text-sm font-semibold text-gray-700">${prov.rif || '-'}</td>
                        <td class="py-3 px-4 text-sm font-bold text-gray-800">${prov.nombre || '-'}</td>
                        <td class="py-3 px-4 text-sm text-gray-600">${prov.telefono || '-'}</td>
                        <td class="py-3 px-4 text-sm text-blue-600">${prov.email || '-'}</td>
                    </tr>
        `;
    }

    html += `
                </tbody>
            </table>
        </div>
        
        <div class="mt-8 text-center text-xs text-gray-400">
            <p>Documento generado automáticamente por el ERP Lavautos.</p>
        </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    const buffer = await page.pdf({ format: 'A4' });
    await browser.close();

    return Buffer.from(buffer);
};
