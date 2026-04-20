import response from '../../shared/utils/responses.js';
import ServiceTypeVehicles from './type_vehicles.service.js';
import { generarPdfTipoVehiculo } from '../../services/reporteTipoVehiculo.js';

const service = new ServiceTypeVehicles();

class ControllerTypeVehicles {
    crearTipoVehiculo = async (req, res) => {
        try {
            const result = await service.addTypeVehicle(req.body);
            return response.QuerySuccess(res, result, "Tipo de vehículo registrado exitosamente.");
        } catch (error) {
            if (error.message === 'PLACA_ALREADY_EXISTS') {
                return response.ResConflict(res, "La placa ya está registrada.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    obtenerTipoVehiculos = async (req, res) => {
        try {
            const result = await service.getTypeVehicles();
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    obtenerTipoVehiculo = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.getTypeVehicleById(parseInt(id));
            return response.QuerySuccess(res, result);
        } catch (error) {
            if (error.message === 'VEHICLE_NOT_FOUND') return response.ItemNotFound(res, "Tipo de vehículo no encontrado.");
            return response.ErrorInternal(res, error.message);
        }
    }

    actualizarTipoVehiculo = async (req, res) => {
        try {
            const vehicleData = { id: parseInt(req.params.id), ...req.body };
            const result = await service.updateTypeVehicle(vehicleData);
            return response.QuerySuccess(res, result, "Tipo de vehículo actualizado exitosamente.");
        } catch (error) {
            if (error.message === 'VEHICLE_NOT_FOUND') return response.ItemNotFound(res, "Tipo de vehículo no encontrado.");
            return response.ErrorInternal(res, error.message);
        }
    }

desactivarTipoVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        await service.desactivarVehiculo(parseInt(id));
        return response.QuerySuccess(res, null, "Vehículo desactivado (movido a inactivos).");
    } catch (error) {
        return response.ErrorInternal(res, error.message);
    }
}

reactivarTipoVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        await service.reactivarVehiculo(parseInt(id));
        return response.QuerySuccess(res, null, "Vehículo reactivado exitosamente.");
    } catch (error) {
        return response.ErrorInternal(res, error.message);
    }
}

    exportarReporteTipoVehiculo = async (req, res) => {
        try {
            const vehiculos = await service.getTypeVehicles();
            const pdfBuffer = await generarPdfTipoVehiculo(vehiculos);
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=reporte_tipo_vehiculos.pdf');
            res.send(pdfBuffer);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }
}

const controller = new ControllerTypeVehicles();
export const { crearTipoVehiculo, obtenerTipoVehiculos, obtenerTipoVehiculo, actualizarTipoVehiculo, desactivarTipoVehiculo,reactivarTipoVehiculo , exportarReporteTipoVehiculo } = controller;