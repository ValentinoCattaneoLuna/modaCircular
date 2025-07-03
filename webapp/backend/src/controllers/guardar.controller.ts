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
export const esFavorito = async (req: AuthenticatedRequest, res: Response) => {
  const { id_publicacion } = req.params;
  const id_usuario = req.user?.id;

  if (!id_usuario) {
    res.status(401).json({ error: "No autenticado" });
    return
}

  const [result] = await pool.query(
    `SELECT 1 FROM Publicaciones_Favoritas WHERE id_usuario = ? AND id_publicacion = ? LIMIT 1`,
    [id_usuario, id_publicacion]
  );

  const favorito = (result as any[]).length > 0;
  res.status(200).json({ es_favorito: favorito });
};

export const obtenerPublicacionesGuardadas = async (req: AuthenticatedRequest, res: Response) => {
  const id_usuario = req.user?.id;

  if (!id_usuario) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  try {
    const [result] = await pool.query(
      `SELECT 
        p.id_publicacion,
        p.id_usuario,
        u.nombre AS nombre_usuario,
        u.apellido AS apellido_usuario,
        tp.tipo_publicacion,
        c.categoria,
        t.talle,
        p.titulo,
        p.descripcion,
        p.precio,
        p.estado,
        p.color,
        DATE_FORMAT(p.fecha_publicacion, '%d/%m/%Y') AS fecha_publicacion,
        p.activo,
        GROUP_CONCAT(fp.url_imagen ORDER BY fp.orden SEPARATOR ',') AS imagenes,
        TRUE as es_favorito
      FROM Publicaciones p
      JOIN Publicaciones_Favoritas pf ON pf.id_publicacion = p.id_publicacion
      JOIN Usuarios u ON p.id_usuario = u.id_usuario
      JOIN tipos_publicacion tp ON p.id_tipo_publicacion = tp.id_tipo_publicacion
      JOIN categorias c ON p.id_categoria = c.id_categoria
      JOIN talles t ON p.id_talle = t.id_talle
      LEFT JOIN Fotos_publicacion fp ON p.id_publicacion = fp.id_publicacion
      WHERE pf.id_usuario = ?
      GROUP BY p.id_publicacion
      ORDER BY pf.fecha_favorito DESC`,
      [id_usuario]
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener publicaciones guardadas" });
  }
}