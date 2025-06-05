import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import dotenv from 'dotenv';
import e from 'express';

dotenv.config();
// Extiende Request con el tipo definido en auth.ts
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
        nombre: string;
    };
}
//crear publicacion
export const crearPublicacion = async (req: AuthenticatedRequest, res: Response) => {

    const { id_tipo_publicacion, id_categoria, id_talle, titulo, descripcion, precio, estado, color, imagenes } = req.body;
    const id_usuario = req.user?.id;

    if (
        !id_usuario || !id_tipo_publicacion || !id_categoria || !id_talle ||
        !titulo || !estado || !imagenes || !Array.isArray(imagenes)
    ) {
        res.status(400).json({ error: 'Faltan datos obligatorios' });
        return;
    }
   
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction;
        // 1. Insertar la publicación
        const [result] = await connection.execute(
            `INSERT INTO Publicaciones (id_usuario, id_tipo_publicacion, id_categoria, id_talle,titulo, descripcion, precio, estado, color) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id_usuario,
                id_tipo_publicacion,
                id_categoria,
                id_talle,
                titulo,
                descripcion || null,
                precio || null,
                estado,
                color || null
            ]
        );
        const insertId = (result as any).insertId;
        // 2. Insertar las imágenes

        for (let i = 0; i < imagenes.length; i++) {
            const { url, es_principal } = imagenes[i];
            await connection.execute(
                `INSERT INTO Fotos_publicacion (id_publicacion, url_imagen, orden, es_principal)
                VALUES (?, ?, ?, ?)`,
                [insertId, url, i + 1, es_principal || false]
            );
        }
        await connection.commit();
        res.status(201).json({ message: 'Publicación creada', id: (result as any).insertId });
    }

    catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al crear publicación' });
    }

}



//ver todas publicaciones
export const verPublicaciones = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const [publicaciones] = await pool.query(`
      SELECT 
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
        GROUP_CONCAT(fp.url_imagen ORDER BY fp.orden SEPARATOR ',') AS imagenes
      FROM Publicaciones p
      JOIN Usuarios u ON p.id_usuario = u.id_usuario
      JOIN tipos_publicacion tp ON p.id_tipo_publicacion = tp.id_tipo_publicacion
      JOIN categorias c ON p.id_categoria = c.id_categoria
      JOIN talles t ON p.id_talle = t.id_talle
      LEFT JOIN Fotos_publicacion fp ON p.id_publicacion = fp.id_publicacion
      WHERE p.activo = TRUE
      GROUP BY p.id_publicacion
      ORDER BY p.fecha_publicacion DESC
    `);
        res.status(200).json(publicaciones);

    } catch (error) {
        console.error('❌ Error al obtener publicaciones:', error);
        res.status(500).json({ error: 'Error al obtener publicaciones' });
    }
};


//ver publicacion por id
export const verPublicacionPorId = async (req: Request, res: Response) => {
    const id_publicacion  = req.params.id_publicacion;

    try {
        const [resultado] = await pool.query(`
       SELECT 
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
        GROUP_CONCAT(fp.url_imagen ORDER BY fp.orden SEPARATOR ',') AS imagenes
      FROM Publicaciones p
      JOIN Usuarios u ON p.id_usuario = u.id_usuario
      JOIN tipos_publicacion tp ON p.id_tipo_publicacion = tp.id_tipo_publicacion
      JOIN categorias c ON p.id_categoria = c.id_categoria
      JOIN talles t ON p.id_talle = t.id_talle
      LEFT JOIN Fotos_publicacion fp ON p.id_publicacion = fp.id_publicacion
      WHERE p.activo = TRUE AND p.id_publicacion = ?
      GROUP BY p.id_publicacion
      ORDER BY p.fecha_publicacion DESC
    `, [id_publicacion]);

        const publicaciones = resultado as any[];

        if (publicaciones.length === 0) {
            res.status(404).json({ error: 'Publicación no encontrada' });
            return
        }

        const publicacion = publicaciones[0];
        publicacion.imagenes = publicacion.imagenes ? publicacion.imagenes.split(',') : [];
        res.status(200).json(publicacion);

    } catch (error) {
        console.error('❌ Error al obtener la publicación:', error);
        res.status(500).json({ error: 'Error al obtener la publicación' });
    }
};
