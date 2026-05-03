import puppeteer from 'puppeteer';

export const generarPdfInventario = async (insumos, resumen) => {
    // 1. Estructura HTML con Tailwind
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Reporte de Inventario de Insumos</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="p-8 bg-gray-50 text-gray-800 font-sans">
        <div class="mb-8 border-b-2 border-blue-600 pb-4 flex justify-between items-end">
            <div class="flex items-center space-x-3">
                <div class="bg-blue-600 p-3 rounded-lg text-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-blue-800 uppercase tracking-wide">Reporte de Inventario</h1>
                    <p class="text-blue-500 font-semibold text-lg">Control de Insumos</p>
                    <p class="text-sm text-gray-400 mt-1">Generado el: ${new Date().toLocaleString()}</p>
                </div>
            </div>
            
            <div class="flex gap-4">
                <div class="bg-white p-4 rounded-lg border border-blue-100 shadow-sm min-w-[120px] text-center">
                    <p class="text-xs text-gray-500 uppercase font-bold mb-1">Insumos</p>
                    <p class="text-2xl font-black text-blue-700">${resumen.totalInsumos}</p>
                </div>
                <div class="bg-white p-4 rounded-lg border border-blue-100 shadow-sm min-w-[120px] text-center">
                    <p class="text-xs text-gray-500 uppercase font-bold mb-1">Valor</p>
                    <p class="text-2xl font-black text-blue-700">$${resumen.valorInventario.toFixed(2)}</p>
                </div>
                <div class="bg-white p-4 rounded-lg border border-red-100 shadow-sm min-w-[120px] text-center">
                    <p class="text-xs text-gray-500 uppercase font-bold mb-1">Críticos</p>
                    <p class="text-2xl font-black ${resumen.criticos > 0 ? 'text-red-600' : 'text-blue-700'}">${resumen.criticos}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-blue-600 text-white">
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">ID</th>
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">Insumo</th>
                        <th class="py-3 px-4 text-center text-xs uppercase font-semibold">Stock Actual</th>
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">Nivel Gráfico</th>
                        <th class="py-3 px-4 text-center text-xs uppercase font-semibold">Estado</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
    `;

    // 2. Mapeo de insumos
    insumos.forEach(item => {
        // Lógica de colores según criticidad (evitamos clases de animación en PDF porque no renderizan bien)
        let statusClass = "bg-green-100 text-green-800 border-green-200";
        let statusText = "STOCK OK";

        if (item.stockActual <= item.stockMinimo) {
            const porcentaje = (item.stockActual / item.stockMinimo) * 100;
            if (porcentaje <= 25) {
                statusClass = "bg-red-100 text-red-800 border-red-300 font-bold";
                statusText = "CRÍTICO";
            } else if (porcentaje <= 50) {
                statusClass = "bg-orange-100 text-orange-800 border-orange-300 font-semibold";
                statusText = "ALTO RIESGO";
            } else if (porcentaje <= 75) {
                statusClass = "bg-yellow-100 text-yellow-800 border-yellow-300 font-semibold";
                statusText = "MEDIO";
            } else {
                statusClass = "bg-yellow-50 text-yellow-600 border-yellow-200";
                statusText = "BAJO";
            }
        }

        let percent = Math.min(100, Math.round((item.stockActual / (item.stockMinimo * 2)) * 100));
        let barColor = statusText === "CRÍTICO" ? "bg-red-500" : statusText === "ALTO RIESGO" ? "bg-orange-500" : statusText === "MEDIO" ? "bg-yellow-500" : "bg-green-500";

        htmlContent += `
            <tr class="hover:bg-blue-50 transition-colors">
                <td class="py-3 px-4 text-sm text-gray-500 font-medium">#${String(item.id).padStart(3, '0')}</td>
                <td class="py-3 px-4 text-sm font-semibold text-gray-800">${item.nombre}</td>
                <td class="py-3 px-4 text-sm text-center font-bold ${item.stockActual <= item.stockMinimo ? 'text-red-600' : 'text-blue-700'}">
                    ${item.stockActual} <span class="text-xs text-gray-400 font-normal">/ min ${item.stockMinimo}</span>
                </td>
                <td class="py-3 px-4 text-sm">
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                      <div class="${barColor} h-2.5 rounded-full" style="width: ${percent}%"></div>
                    </div>
                </td>
                <td class="py-3 px-4 text-sm text-center">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold border ${statusClass}">
                        ${statusText}
                    </span>
                </td>
            </tr>
        `;
    });

    // Cierre de la tabla y firmas
    htmlContent += `
                </tbody>
            </table>
        </div>
        <div class="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
            <p>Documento generado automáticamente por el módulo de Inventario.</p>
            <p>Lavado de Autos Acuático © ${new Date().getFullYear()}</p>
        </div>
    </body>
    </html>`;

    // 3. Lanzamos Puppeteer
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Recomendado si despliegas en servidores Linux/Docker
    });
    const page = await browser.newPage();

    // 4. Cargamos el HTML y generamos el PDF
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true, // Importante para que se vean los colores de Tailwind
        margin: { top: '30px', right: '30px', bottom: '30px', left: '30px' }
    });

    await browser.close();

    return pdfBuffer;
};