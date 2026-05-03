import puppeteer from 'puppeteer';

export const generarPdfCliente = async (clientes) => {
    const total = clientes.length;
    const activos = clientes.filter(c => c.activo).length;
    const inactivos = total - activos;
    
    const afiliados = clientes.filter(c => c.esAfiliado).length;
    const estandar = total - afiliados;

    let htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Reporte de Clientes</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="p-8 bg-slate-50 text-slate-800 font-sans">
        <!-- HEADER -->
        <div class="mb-6 border-b-2 border-cyan-600 pb-4 flex justify-between items-end">
            <div class="flex items-center space-x-3">
                <div class="bg-cyan-600 p-3 rounded-lg text-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-cyan-800 uppercase tracking-wide">Directorio de Clientes</h1>
                    <p class="text-cyan-600 font-semibold text-lg">Reporte General</p>
                    <p class="text-sm text-slate-400 mt-1">Generado el: ${new Date().toLocaleString()}</p>
                </div>
            </div>
            <div class="flex gap-4">
                <div class="bg-white p-4 rounded-lg border border-cyan-100 shadow-sm min-w-[120px] text-center">
                    <p class="text-xs text-slate-400 uppercase font-bold mb-1">Total</p>
                    <p class="text-2xl font-black text-cyan-700">${total}</p>
                </div>
                <div class="bg-white p-4 rounded-lg border border-green-100 shadow-sm min-w-[120px] text-center">
                    <p class="text-xs text-slate-400 uppercase font-bold mb-1">Afiliados</p>
                    <p class="text-2xl font-black text-green-600">${afiliados}</p>
                </div>
            </div>
        </div>

        <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-slate-200">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-cyan-600 text-white">
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">Cédula / RIF</th>
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">Nombre Completo</th>
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">Teléfono</th>
                        <th class="py-3 px-4 text-left text-xs uppercase font-semibold">Email</th>
                        <th class="py-3 px-4 text-center text-xs uppercase font-semibold">Estado</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
    `;

    clientes.forEach(c => {
        const badgeColor = c.esAfiliado ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600';
        const statusText = c.esAfiliado ? 'Afiliado VIP' : 'Estándar';
        const emailText = c.email ? c.email : '<span class="text-slate-300 italic">No registrado</span>';

        htmlContent += `
            <tr class="hover:bg-cyan-50 transition-colors">
                <td class="py-3 px-4 text-sm font-mono font-bold text-cyan-700">${c.cedula}</td>
                <td class="py-3 px-4 text-sm font-bold text-slate-700">${c.nombre}</td>
                <td class="py-3 px-4 text-sm text-slate-600">${c.telefono}</td>
                <td class="py-3 px-4 text-sm text-slate-500">${emailText}</td>
                <td class="py-3 px-4 text-sm text-center">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor}">
                        ${statusText}
                    </span>
                </td>
            </tr>
        `;
    });

    htmlContent += `
            </tbody>
            </table>
        </div>
        
        <div class="mt-8 text-center text-xs text-slate-400">
            <p>Documento generado automáticamente por el ERP Lavautos.</p>
        </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ 
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();
    
    return pdfBuffer;
};
