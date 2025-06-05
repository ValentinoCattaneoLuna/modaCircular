import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db';



// Extiende la interfaz Request
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
        nombre: string;
    };
}
//funcion de autenticacion
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    try {
        //se obtienen los header de autorizacion (contiene el token de autenticacion)
        const authHeader = req.headers['authorization'];

        //verifica si authHeader existe y si es asi divide el header en el Bearer y el token.
        //una vez dividido guarda el token 
        const token = authHeader && authHeader.split(' ')[1];

        //valida que exista el token
        if (!token) {
            res.status(401).json({ error: 'Token no proporcionado' });
            return
        }

        // Verifica y decodifica el token JWT usando la clave secreta, 
        // devolviendo el payload con las propiedades 'id' y 'email' del usuario.
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number, email: string };

        // Verificar si el usuario aún existe en la base de datos
        const [users] = await pool.execute(
            'SELECT id_usuario as id, mail as email, nombre FROM Usuarios WHERE id_usuario = ?',
            [decoded.id]
        );

        //si el largo es 0, no se encontro al usuario
        if ((users as any).length === 0) {
            res.status(401).json({ error: 'Usuario no encontrado' });
            return
        }
        //asigna el primer usuario encontrado 
        req.user = (users as any)[0];

        //pasamos a la siguiente ruta / middleware
        next();


    }
    catch (error) {
        console.error(error);
        res.status(403).json({ error: 'Token inválido o expirado' });
        return
    }

};