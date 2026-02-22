const QuerySuccess = (res, details) => res.status(200).json({
    success: true, code: 'REQUEST_SUCCESSFUL', message: 'The request was successful.', details 
});

const ItemCreated = (res, details) => res.status(201).json({
    success: true, code: 'ITEM_CREATED', message: 'The item was created successfully.', details 
});

const ResConflict = (res, details) => res.status(409).json({
    success: false, code: 'RESOURCE_CONFLICT', message: 'The resource already exists or conflicts.', details 
});

const BadRequest = (res, details) => res.status(400).json({
    success: false, code: 'BAD_REQUEST', message: 'The request was invalid.', details 
});

const ParametersInvalid = (res, details) => res.status(422).json({
    success: false, code: 'VALIDATION_ERROR', message: 'Parameter validation failed.', details 
});

const ItemNotFound = (res, details) => res.status(404).json({
    success: false, code: 'ITEM_NOT_FOUND', message: 'The item was not found.', details 
});

const ErrorAuthorization = (res, details) => res.status(401).json({
    success: false, code: 'ERROR_AUTHORIZATION', message: 'Authorization error.', details 
});

const UnauthorizedEdit = (res, details) => res.status(403).json({
    success: false, code: 'UNAUTHORIZED_EDIT', message: 'You are not authorized to access this.', details 
});

const ErrorInternal = (res, details) => res.status(500).json({
    success: false, code: 'ERROR_INTERNAL', message: 'Internal error.', details 
});

export default {
    BadRequest, ParametersInvalid, ItemNotFound, QuerySuccess, 
    ResConflict, ItemCreated, ErrorAuthorization, ErrorInternal, UnauthorizedEdit
};