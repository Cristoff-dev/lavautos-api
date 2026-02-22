import response from '../utils/responses.js'
import Token from '../utils/token.access.js'

const validateTokenAccess = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) return response.BadRequest(res, 'The token authentication is required.')

    try {
        const decoded = await Token.verifyToken(authorization)
        req.user = decoded // Inyectamos el usuario decodificado en la request
        next()
    } catch (error) {
        const msg = error.message;
        if (msg === 'Format is invalid') return response.ErrorAuthorization(res, 'Invalid Bearer token format.');
        if (msg === 'Token has expired') return response.ErrorAuthorization(res, 'The token has expired.');
        return response.ErrorAuthorization(res, 'Invalid token.');
    }
}

export default validateTokenAccess;