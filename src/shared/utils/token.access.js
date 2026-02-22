import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const genToken = async (result) => {
    // result debe contener id y rol según nuestro schema de Prisma
    const token = jwt.sign({
        id: result.id,
        rol: result.rol,
    }, process.env.SECRET_KEY, { expiresIn: '8h' }); // 8h es ideal para una jornada de autolavado
    return token;
}

const verifyToken = (authorization) => {
    try {
        const parts = authorization.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new Error('Format is invalid');
        }

        const token = parts[1];
        if (!token) throw new Error('The token is invalid.');
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return decoded;

    } catch (error) {
        if (error.name === 'TokenExpiredError') throw new Error('Token has expired');
        if (error.name === 'JsonWebTokenError') throw new Error('Invalid token');
        throw error;
    }
}

export default { genToken, verifyToken };