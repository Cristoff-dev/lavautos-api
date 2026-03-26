import response from '../../shared/utils/responses.js';
import ServiceServices from './services.service.js';

const service = new ServiceServices();

class ControllerServices {
    crearServicio = async (req, res) => {
        try {
            const result = await service.addService(req.body);
            return response.QuerySuccess(res, result, "Service registered successfully.");
        } catch (error) {
            if (error.message === 'NOMBRE_ALREADY_EXISTS') {
                return response.ResConflict(res, "The service name is already registered.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    obtenerServicios = async (req, res) => {
        try {
            const result = await service.getServices();
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    obtenerServicio = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.getServiceById(parseInt(id));
            return response.QuerySuccess(res, result);
        } catch (error) {
            if (error.message === 'SERVICE_NOT_FOUND') return response.ItemNotFound(res, "Service not found.");
            return response.ErrorInternal(res, error.message);
        }
    }

    actualizarServicio = async (req, res) => {
        try {
            const serviceData = { id: parseInt(req.params.id), ...req.body };
            const result = await service.updateService(serviceData);
            return response.QuerySuccess(res, result, "Service updated successfully.");
        } catch (error) {
            if (error.message === 'SERVICE_NOT_FOUND') return response.ItemNotFound(res, "Service not found.");
            return response.ErrorInternal(res, error.message);
        }
    }

    eliminarServicio = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.deleteService(parseInt(id));
            return response.QuerySuccess(res, result, "Service deleted successfully.");
        } catch (error) {
            if (error.message === 'SERVICE_NOT_FOUND') return response.ItemNotFound(res, "Service not found.");
            return response.ErrorInternal(res, error.message);
        }
    }
}

export const {
    crearServicio,
    obtenerServicios,
    obtenerServicio,
    actualizarServicio,
    eliminarServicio
} = new ControllerServices();
