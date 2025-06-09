import type { Request, Response } from 'express';
import pool from '../config/db';
import dotenv from 'dotenv';
import { uploadImages } from '../middleware/uploadImages';
import fs from 'fs';
import path from 'path';


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
export const crearPublicacion = async (req: Request, res: Response) => {
  uploadImages(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length < 1) {
      res.status(400).json({ error: 'Se requiere al menos una imagen' });
      return
    }

    // Insertar publicación
    const { id_tipo_publicacion, id_categoria, id_talle, titulo, descripcion, precio, estado, color } = req.body;
    const id_usuario = (req as any).user.id;

    if (!id_tipo_publicacion || !id_categoria || !id_talle || !titulo || !estado) {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
      return
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result]: any = await connection.execute(
        `INSERT INTO Publicaciones (id_usuario, id_tipo_publicacion, id_categoria, id_talle, titulo, descripcion, precio, estado, color) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_usuario, id_tipo_publicacion, id_categoria, id_talle, titulo, descripcion || null, precio || null, estado, color || null]
      );
      const insertId = result.insertId;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = `http://localhost:4000/public/publicaciones_img/${file?.filename}`;
        await connection.execute(
          `INSERT INTO Fotos_publicacion (id_publicacion, url_imagen, orden, es_principal) VALUES (?, ?, ?, ?)`,
          [insertId, url, i + 1, i === 0]
        );
      }

      await connection.commit();
      res.status(201).json({ message: 'Publicación creada', id: insertId });
    } catch (e) {
      await connection.rollback();
      console.error(e);
      // Borrar archivos ya subidos si falla
      files.forEach(f => {
        const p = path.join(__dirname, '../public/publicaciones_img', f.filename);
        fs.unlink(p, () => {});
      });
      res.status(500).json({ error: 'Error al crear publicación' });
    } finally {
      connection.release();
    }
  });
};



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
        const id_publicacion = req.params.id_publicacion;

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


    //eliminar publicacion por id
    export const eliminarPublicacionPorId = async (req: AuthenticatedRequest, res: Response) => {
        const id_publicacion = req.params.id_publicacion;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Buscar la publicación
            const [rows] = await connection.execute(
                `SELECT id_usuario FROM Publicaciones WHERE id_publicacion = ? LIMIT 1`,
                [id_publicacion]
            );

            const publicaciones = rows as { id_usuario: number }[];

            if (publicaciones.length === 0) {
                connection.release();
                res.status(404).json({ error: 'Publicación no encontrada' });
                return
            }

            const publicacion = publicaciones[0];

            // 2. Verificar si es del usuario autenticado
            if (publicacion?.id_usuario !== req.user?.id) {
                connection.release();
                res.status(403).json({ error: 'No tienes permiso para eliminar esta publicación' });
                return
            }

            // 3. Eliminar
            await connection.execute(
                `DELETE FROM Publicaciones WHERE id_publicacion = ?`,
                [id_publicacion]
            );

            await connection.commit();
            connection.release();

            res.status(200).json({ message: 'Publicación eliminada correctamente' });

        } catch (error) {
            await connection.rollback();
            connection.release();
            console.error('❌ Error al eliminar publicación:', error);
            res.status(500).json({ error: 'Error al eliminar publicación' });
        } finally {
            connection.release();
        }
    };


    //editar publicacion por id
    export const editarPublicacionPorId = async (req: AuthenticatedRequest, res: Response) => {
        const connection = await pool.getConnection();
        const id_publicacion = req.params.id_publicacion;
        //TODO

    };

