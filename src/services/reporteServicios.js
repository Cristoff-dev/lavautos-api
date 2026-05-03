import puppeteer from 'puppeteer';

export const generarPdfServicios = async (servicios) => {
    const serviciosActivos = servicios.filter(s => s.activo === true);

    const totalServicios = serviciosActivos.length;
    const precioPromedio = serviciosActivos.length > 0 ? 
        (serviciosActivos.reduce((acc, s) => acc + (s.precio || 0), 0) / serviciosActivos.length).toFixed(2) : '0.00';

    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Reporte de Servicios</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="p-8 bg-gray-50 text-gray-800 font-sans">
        <!-- HEADER -->
        <div class="mb-8 border-b-2 border-blue-600 pb-4 flex justify-between items-end">
            <div class="flex items-center space-x-3">
                <div class="bg-blue-600 p-3 rounded-lg text-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.492-3.053c.201-.246.154-.609-.088-.822l-4.15-3.611.16-.155A4.408 4.408 0 008 5.571c0-1.282-.574-2.457-1.48-3.238l-.16-.134-2.81 2.81a.75.75 0 00-.22.53v.55a.75.75 0 00.75.75h.55a.75.75 0 00.53-.22l1.62-1.62c.48.33.78.88.78 1.48 0 1.282-.574 2.457-1.48 3.238l-.16.134-2.81 2.81A.75.75 0 002 12.55v.55a.75.75 0 00.75.75h.55a.75.75 0 00.53-.22l2.81-2.81c.78-.81 1.956-1.38 3.238-1.38.6 0 1.15.3 1.48.78l-1.62 1.62a.75.75 0 00-.22.53v.55a.75.75 0 00.75.75h.55a.75.75 0 00.53-.22l2.81-2.81c.81-.78 1.38-1.956 1.38-3.238 0-.6-.3-1.15-.78-1.48l1.62-1.62a.75.75 0 00-.22-.53z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-blue-800 uppercase tracking-wide">Reporte de Servicios</h1>
                    <p class="text-blue-500 font-semibold text-lg">Catálogo Activo</p>
                    <p class="text-sm text-gray-400 mt-1">Generado el: ${new Date().toLocaleString()}</p>
                </div>
            </div>
            
            <div class="flex gap-4">
                <div class="bg-white p-4 rounded-lg border border-blue-100 shadow-sm min-w-[140px] text-center">
                    <p class="text-xs text-gray-400 uppercase font-bold mb-1">Total Servicios</p>
                    <p class="text-2xl font-black text-blue-700">${totalServicios}</p>
                </div>
                <div class="bg-white p-4 rounded-lg border border-blue-100 shadow-sm min-w-[140px] text-center">
                    <p class="text-xs text-gray-400 uppercase font-bold mb-1">Precio Promedio</p>
                    <p class="text-2xl font-black text-blue-700">$${precioPromedio}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-blue-600 text-white">
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">ID</th>
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">Nombre</th>
                        <th class="py-3 px-4 text-center text-xs uppercase font-semibold">Tipo Vehículo</th>
                        <th class="py-3 px-4 text-right text-xs uppercase font-semibold">Precio</th>
                        <th class="py-3 px-4 text-center text-xs uppercase font-semibold">Duración</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
    `;

    for (const serv of serviciosActivos) {
        html += `
                    <tr class="hover:bg-blue-50 transition-colors">
                        <td class="py-3 px-4 text-sm text-gray-500 font-medium">#${String(serv.id).padStart(3, '0')}</td>
                        <td class="py-3 px-4 text-sm font-semibold text-gray-800">
                            ${serv.nombre || '-'}
                            <div class="text-xs font-normal text-gray-400 mt-0.5">${serv.descripcion || 'Sin descripción'}</div>
                        </td>
                        <td class="py-3 px-4 text-sm text-center">
                            <span class="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                ${serv.tipoVehiculo || 'General'}
                            </span>
                        </td>
                        <td class="py-3 px-4 text-sm text-right font-bold text-gray-700">
                            $${Number(serv.precio || 0).toFixed(2)}
                        </td>
                        <td class="py-3 px-4 text-sm text-center text-gray-600">
                            ${serv.duracionMinutos || 0} min
                        </td>
                    </tr>
        `;
    }

    html += `
                </tbody>
            </table>
        </div>
        
        <div class="mt-8 text-center text-xs text-gray-400">
            <p>Documento generado automáticamente por el ERP Lavautos.</p>
            <p>Lavado de Autos © ${new Date().getFullYear()}</p>
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
