import response from '../../shared/utils/responses.js';
import ServiceProviders from './providers.service.js';

const service = new ServiceProviders();

class ControllerProviders {
    crearProveedor = async (req, res) => {
        try {
            const result = await service.addProvider(req.body);
            return response.QuerySuccess(res, result, "Provider registered successfully.");
        } catch (error) {
            if (error.message === 'RIF_ALREADY_EXISTS') {
                return response.ResConflict(res, "The RIF is already registered.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    obtenerProveedores = async (req, res) => {
        try {
            const result = await service.getProviders();
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    obtenerProveedor = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.getProviderById(parseInt(id));
            return response.QuerySuccess(res, result);
        } catch (error) {
            if (error.message === 'PROVIDER_NOT_FOUND') return response.ItemNotFound(res, "Provider not found.");
            return response.ErrorInternal(res, error.message);
        }
    }

    actualizarProveedor = async (req, res) => {
        try {
            const providerData = { id: parseInt(req.params.id), ...req.body };
            const result = await service.updateProvider(providerData);
            return response.QuerySuccess(res, result, "Provider updated successfully.");
        } catch (error) {
            if (error.message === 'PROVIDER_NOT_FOUND') return response.ItemNotFound(res, "Provider not found.");
            return response.ErrorInternal(res, error.message);
        }
    }

    eliminarProveedor = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.deleteProvider(parseInt(id));
            return response.QuerySuccess(res, result, "Provider deleted successfully.");
        } catch (error) {
            if (error.message === 'PROVIDER_NOT_FOUND') return response.ItemNotFound(res, "Provider not found.");
            return response.ErrorInternal(res, error.message);
        }
    }
}

export const {
    crearProveedor,
    obtenerProveedores,
    obtenerProveedor,
    actualizarProveedor,
    eliminarProveedor
} = new ControllerProviders();