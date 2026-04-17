import puppeteer from 'puppeteer';

export const generarPdfServicios = async (servicios) => {
    const serviciosActivos = servicios.filter(s => s.activo === true);

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reporte de Servicios</title>
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Vehículo</th>
                        <th>Precio</th>
                        <th>Duración</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
    `;

    for (const serv of serviciosActivos) {
        html += `
                    <tr>
                        <td>${String(serv.id)}</td>
                        <td>${serv.nombre || ''}</td>
                        <td>${serv.tipoVehiculo || ''}</td>
                        <td>${serv.precio || 0}</td>
                        <td>${serv.duracionMinutos || 0} min</td>
                        <td>${serv.descripcion || ''}</td>
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
