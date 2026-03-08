import ModelClients from './clients.model.js';

const model = new ModelClients();

class ServiceClients {
    addClient = async (clientData) => {
        try {
            const existingClient = await model.getClientByCedula(clientData.cedula);
            if (existingClient) throw new Error('CEDULA_ALREADY_EXISTS');

            return await model.addClient(clientData);
        } catch (error) { throw error; }
    }

    getClients = async () => {
        try {
            return await model.getClients();
        } catch (error) { throw error; }
    }

    // NUEVO: Método para buscar por cédula
    getClientByCedula = async (cedula) => {
        try {
            const client = await model.getClientByCedula(cedula);
            if (!client) throw new Error('CLIENT_NOT_FOUND');
            return client;
        } catch (error) { throw error; }
    }

    updateClient = async (clientData) => {
        try {
            // Extraemos la cédula para que NO se envíe a actualizar, garantizando su inmutabilidad
            const { id, cedula, ...dataToUpdate } = clientData;

            const existClient = await model.getClientById(id);
            if (!existClient) throw new Error('CLIENT_NOT_FOUND');

            return await model.updateClient(id, dataToUpdate);
        } catch (error) { throw error; }
    }

    deleteClient = async (id) => {
        try {
            const client = await model.getClientById(id);
            if (!client) throw new Error('CLIENT_NOT_FOUND');

            return await model.deleteClient(id);
        } catch (error) { throw error; }
    }

    restoreClient = async (id) => {
        try {
            const client = await model.getClientById(id);
            if (!client) throw new Error('CLIENT_NOT_FOUND');
            if (client.activo) throw new Error('CLIENT_ALREADY_ACTIVE');

            return await model.restoreClient(id);
        } catch (error) { throw error; }
    }
}

export default ServiceClients;