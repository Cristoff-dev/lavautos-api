import ModelTypeVehicles from './type_vehicles.model.js';

const model = new ModelTypeVehicles();

class ServiceTypeVehicles {
    addTypeVehicle = async (vehicleData) => {
        try {

            //aqui nos aseguramos de que auto se guarde como carro
            if(vehicleData.clase === 'AUTO') vehicleData.clase = 'CARRO';

            const existingVehicle = await model.getTypeVehicleByPlaca(vehicleData.placa);
            if (existingVehicle) throw new Error('PLACA_ALREADY_EXISTS');

            return await model.addTypeVehicle(vehicleData);
        } catch (error) { throw error; }
    }

    getTypeVehicles = async () => {
        try {
            return await model.getTypeVehicles();
        } catch (error) { throw error; }
    }

    getTypeVehicleById = async (id) => {
        try {
            const vehicle = await model.getTypeVehicleById(id);
            if (!vehicle) throw new Error('VEHICLE_NOT_FOUND');
            return vehicle;
        } catch (error) { throw error; }
    }

    updateTypeVehicle = async (vehicleData) => {
        try {
            const { id, ...dataToUpdate } = vehicleData;
            
            const existVehicle = await model.getTypeVehicleById(id);
            if (!existVehicle) throw new Error('VEHICLE_NOT_FOUND');

            return await model.updateTypeVehicle(id, dataToUpdate);
        } catch (error) { throw error; }
    }

desactivarVehiculo = async (id) => {
    try {
        const vehicle = await model.getTypeVehicleById(id);
        if (!vehicle) throw new Error('VEHICLE_NOT_FOUND');
        return await model.desactiveTypeVehicle(id);
    } catch (error) { throw error; }
}

reactivarVehiculo = async (id) => {
    try {
        const vehicle = await model.getTypeVehicleById(id);
        if (!vehicle) throw new Error('VEHICLE_NOT_FOUND');
        return await model.activateTypeVehicle(id);
    } catch (error) { throw error; }
}
}

export default ServiceTypeVehicles;