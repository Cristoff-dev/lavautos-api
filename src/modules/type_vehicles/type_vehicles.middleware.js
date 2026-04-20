export function validarTipoVehiculo(req, res, next) {
    const { placa, marca, modelo, clase, clienteId } = req.body;
    const errores = [];

    const clasesPermitidas = ['MOTO','CARRO','AUTO','CAMION'];

    if (!clase || !clasesPermitidas.includes(clase.toUpperCase())) {
        errores.push(`la clase debe ser una de las siguientes y otra: ${clasesPermitidas.join(', ')}.`);
    }

    if (errores.length > 0) {
        return res.status(400).json({ error: 'Datos invalidos', detalles:errores });
    }

    // Aquí podrías validar que el precio no sea menor a X según el tipo
    // Ejemplo: if(clase === 'CAMION' && precio < 20) errores.push("Precio muy bajo para camión");

    if (!placa || typeof placa !== 'string' || placa.trim() === '') {
        errores.push('El campo "placa" es obligatorio.');
    }
    if (!marca || typeof marca !== 'string' || marca.trim() === '') {
        errores.push('El campo "marca" es obligatorio.');
    }
    if (!modelo || typeof modelo !== 'string' || modelo.trim() === '') {
        errores.push('El campo "modelo" es obligatorio.');
    }
    if (!clase || typeof clase !== 'string' || clase.trim() === '') {
        errores.push('El campo "clase" es obligatorio (Ej: Sedan, SUV, Moto).');
    }
    if (!clienteId || isNaN(Number(clienteId))) {
        errores.push('El campo "clienteId" es obligatorio y debe ser un número válido.');
    }

    if (errores.length > 0) {
        return res.status(400).json({ error: 'Datos inválidos', detalles: errores });
    }

    //normalizacion a mayusculas antes de otro proceso
    req.body.clase = clase.toUpperCase();
    next();
}