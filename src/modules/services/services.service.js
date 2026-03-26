import ModelServices from './services.model.js';

const model = new ModelServices();

class ServiceServices {
    addService = async (serviceData) => {
        try {
            const existingService = await model.getServiceByNombre(serviceData.nombre);
            if (existingService) throw new Error('NOMBRE_ALREADY_EXISTS');

            return await model.addService(serviceData);
        } catch (error) { throw error; }
    }

    getServices = async () => {
        try {
            return await model.getServices();
        } catch (error) { throw error; }
    }

    getServiceById = async (id) => {
        try {
            const service = await model.getServiceById(id);
            if (!service) throw new Error('SERVICE_NOT_FOUND');
            return service;
        } catch (error) { throw error; }
    }

    updateService = async (serviceData) => {
        try {
            const { id, nombre, ...dataToUpdate } = serviceData;

            const existService = await model.getServiceById(id);
            if (!existService) throw new Error('SERVICE_NOT_FOUND');

            return await model.updateService(id, dataToUpdate);
        } catch (error) { throw error; }
    }

    deleteService = async (id) => {
        try {
            const service = await model.getServiceById(id);
            if (!service) throw new Error('SERVICE_NOT_FOUND');

            return await model.deleteService(id);
        } catch (error) { throw error; }
    }
}

export default ServiceServices;
