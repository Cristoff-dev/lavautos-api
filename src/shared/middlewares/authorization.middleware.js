import responses from '../utils/responses.js';

const authorization = (allowedRoles) => {
    return (req, res, next) => {
        // req.user viene del middleware validateTokenAccess
        const userRole = req.user?.rol;
        
        if (allowedRoles.map(role => role.toLowerCase()).includes(userRole?.toLowerCase())) {
            return next();
        } 
        
        return responses.UnauthorizedEdit(res, "You don't have permission to access this resource.");
    }
}

export default authorization;