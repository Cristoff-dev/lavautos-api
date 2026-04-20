import puppeteer from 'puppeteer';

export const generarPdfTipoVehiculo = async (vehiculos) => {
    // 1. Armamos el HTML (Puedes meterle los colores dark/slate/cyan de tu UI si quieres)
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Reporte de Tipos de Vehículos</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="p-8 bg-white text-gray-800">
        <div class="mb-6 text-center">
            <h1 class="text-3xl font-bold text-slate-800">Reporte de Tipos de Vehículos</h1>
            <p class="text-gray-500">Lavado de Autos Acuático</p>
            <p class="text-sm text-gray-400">Fecha: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <table class="min-w-full bg-white border border-gray-300">
            <thead>
                <tr class="bg-slate-800 text-white">
                    <th class="py-2 px-4 border-b text-left">ID</th>
                    <th class="py-2 px-4 border-b text-left">Placa</th>
                    <th class="py-2 px-4 border-b text-left">Marca</th>
                    <th class="py-2 px-4 border-b text-left">Modelo</th>
                    <th class="py-2 px-4 border-b text-left">Clase</th>
                </tr>
            </thead>
            <tbody>
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
            <tr class="hover:bg-gray-100">
                <td class="py-2 px-4 border-b">${v.id}</td>
                <td class="py-2 px-4 border-b font-semibold">${v.placa}</td>
                <td class="py-2 px-4 border-b">${v.marca}</td>
                <td class="py-2 px-4 border-b">${v.modelo}</td>
                <td class="py-2 px-4 border-b">${v.clase}</td>
                <td class="py-2 px-4 border-b font-bold text-green-600">
                ${obtenerPrecioSugerido(v.clase)}
</td>
            </tr>
        `;
    });

    htmlContent += `
            </tbody>
        </table>
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