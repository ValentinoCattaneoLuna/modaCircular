import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import dotenv from 'dotenv';

dotenv.config();
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
        nombre: string;
    };
}

export const guardarPublicacion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id_publicacion } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
    }
    if (!id_publicacion) {
        res.status(400).json({ error: 'ID de publicación es requerido' });
        return;
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.execute(
            `INSERT INTO Publicaciones_Favoritas (id_usuario, id_publicacion,fecha_favorito) VALUES (?, ?, ?)`,
            [userId, id_publicacion, new Date()]
        )
        await connection.commit();
        res.status(201).json({ message: 'Publicación guardada correctamente', result });    
        
    } catch (e) {
        await connection.rollback();
        console.error(e);
        res.status(500).json({ error: 'Error al guardar publicación' });
    }
    finally {
        connection.release();
    }
}

export const borrarPublicacion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    const { id_publicacion } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
    }
    if (!id_publicacion) {
        res.status(400).json({ error: 'ID de publicación es requerido' });
        return;
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.execute(
            `DELETE FROM Publicaciones_Favoritas WHERE id_usuario = ? AND id_publicacion = ?`,
            [userId, id_publicacion]
        )
        await connection.commit();
        res.status(200).json({ message: 'publicación eliminada de guardados' });    
        
    } catch (e) {
        await connection.rollback();
        console.error(e);
        res.status(500).json({ error: 'Error al eliminar de guardados' });
    }
    finally {
        connection.release();
    }
}