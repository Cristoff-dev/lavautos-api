import puppeteer from 'puppeteer';

export const generarPdfProveedores = async (proveedores) => {
    const proveedoresActivos = proveedores.filter(p => p.activo === true);
    
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reporte de Proveedores</title>
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>RIF</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
    `;

    for (const prov of proveedoresActivos) {
        html += `
                    <tr>
                        <td>${String(prov.id)}</td>
                        <td>${prov.rif || ''}</td>
                        <td>${prov.nombre || ''}</td>
                        <td>${prov.telefono || ''}</td>
                        <td>${prov.email || ''}</td>
                    </tr>
        `;
    }

    html += `
                </tbody>
            </table>
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
