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
    <body class="p-8 bg-white text-gray-800 font-sans">
        <div class="mb-8 border-b-2 border-slate-800 pb-4 flex justify-between items-end">
            <div>
                <h1 class="text-3xl font-bold text-slate-800 uppercase tracking-wide">Reporte de Inventario</h1>
                <p class="text-slate-500 font-semibold text-lg">Lavado de Autos Acuático</p>
                <p class="text-sm text-gray-400 mt-1">Generado el: ${new Date().toLocaleString()}</p>
            </div>
            <div class="text-right text-sm bg-slate-50 p-3 rounded border border-slate-200">
                <p class="font-bold text-slate-800 uppercase mb-1">Resumen General</p>
                <p class="text-slate-600">Total Insumos: <span class="font-bold text-slate-800">${resumen.totalInsumos}</span></p>
                <p class="text-slate-600">Valor Estimado: <span class="font-bold text-green-600">$${resumen.valorInventario.toFixed(2)}</span></p>
                <p class="text-slate-600 mt-1 pt-1 border-t border-slate-200">
                    Alertas Críticas: <span class="font-bold ${resumen.criticos > 0 ? 'text-red-600' : 'text-slate-800'}">${resumen.criticos}</span>
                </p>
            </div>
        </div>
        
        <table class="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <thead>
                <tr class="bg-slate-800 text-white">
                    <th class="py-3 px-4 border-b text-left text-xs uppercase font-semibold">ID</th>
                    <th class="py-3 px-4 border-b text-left text-xs uppercase font-semibold">Insumo</th>
                    <th class="py-3 px-4 border-b text-center text-xs uppercase font-semibold">Stock Actual</th>
                    <th class="py-3 px-4 border-b text-center text-xs uppercase font-semibold">Stock Mínimo</th>
                    <th class="py-3 px-4 border-b text-center text-xs uppercase font-semibold">Estado / Alerta</th>
                </tr>
            </thead>
            <tbody>
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

        htmlContent += `
            <tr class="hover:bg-gray-50 border-b border-gray-100 transition-colors">
                <td class="py-3 px-4 text-sm text-gray-500">${item.id}</td>
                <td class="py-3 px-4 text-sm font-semibold text-slate-700">${item.nombre}</td>
                <td class="py-3 px-4 text-sm text-center font-bold ${item.stockActual <= item.stockMinimo ? 'text-red-600' : 'text-slate-800'}">
                    ${item.stockActual}
                </td>
                <td class="py-3 px-4 text-sm text-center text-gray-500">${item.stockMinimo}</td>
                <td class="py-3 px-4 text-sm text-center">
                    <span class="px-3 py-1 rounded-full text-xs border ${statusClass}">
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

        <div class="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
            <p>Documento generado automáticamente por el módulo de Inventario.</p>
            <p>Lavado de Autos Acuático © ${new Date().getFullYear()}</p>
        </div>
    </body>
    </html>
    `;

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