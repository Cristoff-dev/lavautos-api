import response from '../../shared/utils/responses.js';
import ServiceProviders from './providers.service.js';
import { generarPdfProveedores } from '../../services/reporteProveedores.js';

const service = new ServiceProviders();

class ControllerProviders {
    crearProveedor = async (req, res) => {
        try {
            const result = await service.addProvider(req.body);
            return response.ItemCreated(res, result);
        } catch (error) {
            if (error.message === 'RIF_ALREADY_EXISTS') {
                return response.ResConflict(res, "El RIF ya se encuentra registrado por otro proveedor.");
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

    obtenerProveedoresDropdown = async (req, res) => {
        try {
            const result = await service.getProvidersDropdown();
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
            if (error.message === 'PROVIDER_NOT_FOUND') {
                return response.ItemNotFound(res, "Proveedor no encontrado.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    actualizarProveedor = async (req, res) => {
        try {
            const providerData = { id: parseInt(req.params.id), ...req.body };
            const result = await service.updateProvider(providerData);
            return response.QuerySuccess(res, result, "Proveedor actualizado exitosamente.");
        } catch (error) {
            if (error.message === 'PROVIDER_NOT_FOUND') {
                return response.ItemNotFound(res, "Proveedor no encontrado.");
            }
            if (error.message === 'RIF_ALREADY_EXISTS') {
                return response.ResConflict(res, "El RIF ya se encuentra registrado por otro proveedor.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    eliminarProveedor = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.deleteProvider(parseInt(id));
            return response.QuerySuccess(res, result, "Proveedor desactivado exitosamente.");
        } catch (error) {
            if (error.message === 'PROVIDER_NOT_FOUND') {
                return response.ItemNotFound(res, "Proveedor no encontrado.");
            }
            if (error.message === 'PROVIDER_ALREADY_INACTIVE') {
                return response.BadRequest(res, "El proveedor ya está inactivo.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    restaurarProveedor = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.restoreProvider(parseInt(id));
            return response.QuerySuccess(res, result, "Proveedor restaurado exitosamente.");
        } catch (error) {
            if (error.message === 'PROVIDER_NOT_FOUND') {
                return response.ItemNotFound(res, "Proveedor no encontrado.");
            }
            if (error.message === 'PROVIDER_ALREADY_ACTIVE') {
                return response.BadRequest(res, "El proveedor ya está activo.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    obtenerProductosAsignados = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await service.getInsumosAsignados(parseInt(id));
            return response.QuerySuccess(res, result);
        } catch (error) {
            if (error.message === 'PROVIDER_NOT_FOUND') {
                return response.ItemNotFound(res, "Proveedor no encontrado.");
            }
            return response.ErrorInternal(res, error.message);
        }
    }

    exportarReporteProveedores = async (req, res) => {
        try {
            const data = await service.getProviders();
            const buffer = await generarPdfProveedores(data);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="Reporte_Proveedores.pdf"',
                'Content-Length': buffer.length
            });
            return res.send(buffer);
        } catch (error) {
            return response.ErrorInternal(res, error.message);
        }
    }
}

const controlador = new ControllerProviders();
export const {
    crearProveedor,
    obtenerProveedores,
    obtenerProveedoresDropdown,
    obtenerProveedor,
    actualizarProveedor,
    eliminarProveedor,
    restaurarProveedor,
    obtenerProductosAsignados,
    exportarReporteProveedores
} = controlador;