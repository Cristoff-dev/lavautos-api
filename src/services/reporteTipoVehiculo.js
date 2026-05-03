import puppeteer from 'puppeteer';

export const generarPdfTipoVehiculo = async (vehiculos) => {
    const total = vehiculos.length;
    const stats = vehiculos.reduce((acc, v) => {
        acc[v.clase] = (acc[v.clase] || 0) + 1;
        return acc;
    }, {});
    
    const classColors = {
        'MOTO': 'bg-teal-500',
        'CARRO': 'bg-blue-500',
        'CAMIONETA': 'bg-indigo-500',
        'CAMION': 'bg-cyan-600',
        'DEFAULT': 'bg-blue-300'
    };

    let graphBars = '';
    let graphLabels = '';
    
    if (total > 0) {
        Object.entries(stats).forEach(([clase, count]) => {
            const percent = ((count / total) * 100).toFixed(1);
            const color = classColors[clase] || classColors['DEFAULT'];
            graphBars += `<div class="${color} h-full" style="width: ${percent}%"></div>`;
            graphLabels += `
                <div class="flex items-center space-x-1">
                    <div class="w-3 h-3 rounded-full ${color}"></div>
                    <span class="text-xs text-gray-600 font-semibold">${clase} (${percent}%)</span>
                </div>
            `;
        });
    }

    let htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Reporte de Tipos de Vehículos</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="p-8 bg-gray-50 text-gray-800 font-sans">
        <!-- HEADER -->
        <div class="mb-6 border-b-2 border-blue-600 pb-4 flex justify-between items-end">
            <div class="flex items-center space-x-3">
                <div class="bg-blue-600 p-3 rounded-lg text-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-blue-800 uppercase tracking-wide">Reporte de Flota</h1>
                    <p class="text-blue-500 font-semibold text-lg">Tipos de Vehículos</p>
                    <p class="text-sm text-gray-400 mt-1">Generado el: ${new Date().toLocaleString()}</p>
                </div>
            </div>
            <div class="bg-white p-4 rounded-lg border border-blue-100 shadow-sm min-w-[140px] text-center">
                <p class="text-xs text-gray-400 uppercase font-bold mb-1">Total Vehículos</p>
                <p class="text-2xl font-black text-blue-700">${total}</p>
            </div>
        </div>

        <!-- GRAPHIC DISTRIBUCION -->
        <div class="mb-8 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 class="text-xs text-gray-500 uppercase font-bold mb-3">Distribución de Tipos de Vehículo</h3>
            <div class="w-full h-4 rounded-full overflow-hidden flex bg-gray-100 mb-3 border border-gray-200">
                ${graphBars}
            </div>
            <div class="flex flex-wrap gap-4">
                ${graphLabels}
            </div>
        </div>
        
        <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-blue-600 text-white">
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">ID</th>
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">Placa</th>
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">Marca</th>
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">Modelo</th>
                        <th class="py-3 px-4 text-center text-xs uppercase font-semibold">Clase</th>
                        <th class="py-3 px-4 text-right text-xs uppercase font-semibold">Precio Base Sugerido</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
    `;

    // 2. Llenamos la tabla con los datos
    vehiculos.forEach(v => {

        const badgeColor = v.clase === 'MOTO' ? 'bg-blue-100 text-blue-800' : 
                v.clase === 'CAMIONETA' ? 'bg-orange-100 text-orange-800' : 
                'bg-green-100 text-green-800';

    const obtenerPrecioSugerido = (clase) => {
            switch(clase) {
                case 'MOTO': return '5.00$';
                case 'CARRO': return '10.00$';
                case 'CAMION': return '20.00$';
                    default: return '0.00$';
    }
}

        htmlContent += `
            <tr class="hover:bg-blue-50 transition-colors">
                <td class="py-3 px-4 text-sm text-gray-500 font-medium">#${String(v.id).padStart(3, '0')}</td>
                <td class="py-3 px-4 text-sm font-bold text-blue-700 uppercase">${v.placa}</td>
                <td class="py-3 px-4 text-sm text-gray-700">${v.marca}</td>
                <td class="py-3 px-4 text-sm text-gray-700">${v.modelo}</td>
                <td class="py-3 px-4 text-sm text-center">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${badgeColor}">
                        ${v.clase}
                    </span>
                </td>
                <td class="py-3 px-4 text-sm font-bold text-gray-700 text-right">
                    ${obtenerPrecioSugerido(v.clase)}
                </td>
            </tr>
        `;
    });

    htmlContent += `
            </tbody>
            </table>
        </div>
        
        <div class="mt-8 text-center text-xs text-gray-400">
            <p>Documento generado automáticamente por el ERP Lavautos.</p>
        </div>
    </body>
    </html>
    `;

    // 3. Lanzamos Puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // 4. Cargamos el HTML y generamos el PDF
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ 
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();
    
    return pdfBuffer;
};