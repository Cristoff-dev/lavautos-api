import response from '../../shared/utils/responses.js';
import ServiceClients from './clients.service.js';

const service = new ServiceClients();

class ControllerClients {
    addClient = async (req, res) => {
        try {
            const result = await service.addClient(req.body);
            return response.QuerySuccess(res, result, "Client registered successfully.");
        } catch (error) {
            if (error.message === 'CEDULA_ALREADY_EXISTS') {
                return response.ResConflict(res, "The ID (Cedula) is already registered.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    getClients = async (req, res) => {
        try {
            const result = await service.getClients();
            return response.QuerySuccess(res, result);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }

    // NUEVO: Buscar cliente específico por cédula
    getClientByCedula = async (req, res) => {
        try {
            const { cedula } = req.params;
            const result = await service.getClientByCedula(cedula);
            return response.QuerySuccess(res, result);
        } catch (error) {
            if (error.message === 'CLIENT_NOT_FOUND') return response.ItemNotFound(res, "Client not found with that Cedula.");
            return response.ErrorInternal(res, error.message);
        }
    }

    updateClient = async (req, res) => {
        try {
            const clientData = { id: parseInt(req.params.id), ...req.body };
            const result = await service.updateClient(clientData);
            return response.QuerySuccess(res, result, "Client updated successfully.");
        } catch (error) {
            if (error.message === 'CLIENT_NOT_FOUND') return response.ItemNotFound(res, "Client not found.");
            return response.ErrorInternal(res, error.message);
        }
    }

    deleteClient = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const result = await service.deleteClient(id);
            
            return response.QuerySuccess(
                res, 
                { id: id, status: 'inactive' }, 
                "Client deactivated successfully."
            );
        } catch (error) {
            if (error.message === 'CLIENT_NOT_FOUND') return response.ItemNotFound(res, "Client not found.");
            return response.ErrorInternal(res, error.message);
        }
    }

    restoreClient = async (req, res) => {
        try {
            const result = await service.restoreClient(parseInt(req.params.id));
            return response.QuerySuccess(res, result, "Client restored successfully.");
        } catch (error) {
            if (error.message === 'CLIENT_NOT_FOUND') return response.ItemNotFound(res, "Client not found.");
            if (error.message === 'CLIENT_ALREADY_ACTIVE') return response.ResConflict(res, "Client is already active.");
            return response.ErrorInternal(res, error.message);
        }
    }
}

export default ControllerClients;