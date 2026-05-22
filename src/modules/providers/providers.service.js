import ModelProviders from './providers.model.js';

const model = new ModelProviders();

class ServiceProviders {
    addProvider = async (providerData) => {
        try {
            const existingProvider = await model.getProviderByRif(providerData.rif);
            if (existingProvider) throw new Error('RIF_ALREADY_EXISTS');
            return await model.addProvider(providerData);
        } catch (error) { throw error; }
    }

    getProviders = async () => {
        try { return await model.getProviders(); } catch (error) { throw error; }
    }

    getProvidersDropdown = async () => {
        try { return await model.getActiveProviders(); } catch (error) { throw error; }
    }

    getProviderById = async (id) => {
        try {
            const provider = await model.getProviderById(id);
            if (!provider) throw new Error('PROVIDER_NOT_FOUND');
            return provider;
        } catch (error) { throw error; }
    }

    updateProvider = async (providerData) => {
        try {
            const { id, ...dataToUpdate } = providerData;
            const existProvider = await model.getProviderById(id);
            if (!existProvider) throw new Error('PROVIDER_NOT_FOUND');

            if (dataToUpdate.rif && dataToUpdate.rif !== existProvider.rif) {
                const rifOcupado = await model.getProviderByRif(dataToUpdate.rif);
                if (rifOcupado) throw new Error('RIF_ALREADY_EXISTS');
            }
            return await model.updateProvider(id, dataToUpdate);
        } catch (error) { throw error; }
    }

    deleteProvider = async (id) => {
        try {
            const provider = await model.getProviderById(id);
            if (!provider) throw new Error('PROVIDER_NOT_FOUND');
            if (!provider.activo) throw new Error('PROVIDER_ALREADY_INACTIVE');
            return await model.deleteProvider(id);
        } catch (error) { throw error; }
    }

    restoreProvider = async (id) => {
        try {
            const provider = await model.getProviderById(id);
            if (!provider) throw new Error('PROVIDER_NOT_FOUND');
            if (provider.activo) throw new Error('PROVIDER_ALREADY_ACTIVE');
            return await model.restoreProvider(id);
        } catch (error) { throw error; }
    }

    getInsumosAsignados = async (id) => {
        try {
            const provider = await model.getProviderById(id);
            if (!provider) throw new Error('PROVIDER_NOT_FOUND');
            return await model.getInsumosAsignados(id);
        } catch (error) { throw error; }
    }
}

export default ServiceProviders;