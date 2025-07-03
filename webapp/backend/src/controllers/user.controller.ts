import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import dotenv from 'dotenv';
import e from 'express';

dotenv.config();
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
        nombre: string;
    };
}
export const verUsuarios = async (req: Request, res: Response) => {
    try {
        const [usuarios] = await pool.query(`
            SELECT id_usuario, nombre, apellido, mail, username,nacimiento, telefono, ubicacion,  avatar,
            bio, fecha_creacion AS joinDate
            from Usuarios
            Order by id_usuario
    `);
        res.status(200).json(usuarios);

    } catch (error) {
        console.error('❌ Error al obtener publicaciones:', error);
        res.status(500).json({ error: 'Error al obtener publicaciones' });
    }
};


export const verUsuarioPorId = async (req: Request, res: Response) => {
    const id_usuario = req.params.id_usuario;

    try {
        const [resultado] = await pool.query(`
            SELECT id_usuario, nombre, apellido, mail, username, nacimiento, telefono, ubicacion, avatar,
            bio, fecha_creacion AS joinDate
            from Usuarios where id_usuario = ?
            Order by id_usuario
    `, [id_usuario]);

        const usuarios = resultado as any[];

        if (usuarios.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return
        }

        const usuario = usuarios[0];
        res.status(200).json(usuario);

    } catch (error) {
        console.error('❌ Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};
export const verUsuarioPorUsername = async (req: Request, res: Response) => {
    const username = req.params.username;

    try {
        const [resultado] = await pool.query(`
            SELECT id_usuario, nombre, apellido, mail, username, nacimiento, telefono, ubicacion, avatar,
            bio, fecha_creacion AS joinDate
            from Usuarios where username = ?
            Order by username
    `, [username]);

        const usuarios = resultado as any[];

        if (usuarios.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return
        }

        const usuario = usuarios[0];
        res.status(200).json(usuario);

    } catch (error) {
        console.error('❌ Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};
export const actualizarUsuarioId = async (req: AuthenticatedRequest, res: Response) => {
  const connection = await pool.getConnection();
  const { bio, nacimiento, telefono, ubicacion } = req.body;

  const id_usuario = req.user?.id;

  if (!id_usuario) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  try {
    await connection.beginTransaction();

    const campos: string[] = [];
    const valores: any[] = [];

    if (bio !== undefined) {
      campos.push("bio = ?");
      valores.push(bio);
    }

    if (nacimiento !== undefined) {
      campos.push("nacimiento = ?");
      valores.push(nacimiento);
    }

    if (telefono !== undefined) {
      campos.push("telefono = ?");
      valores.push(telefono);
    }

    if (ubicacion !== undefined) {
      campos.push("ubicacion = ?");
      valores.push(ubicacion);
    }

    if (campos.length === 0) {
      res.status(400).json({ error: 'No se enviaron campos para actualizar' });
      return;
    }

    const sql = `UPDATE Usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`;
    valores.push(id_usuario);

    await connection.execute(sql, valores);
    await connection.commit();

    res.status(200).json({ message: 'Usuario actualizado con éxito' });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error actualizando usuario:", error);
    res.status(500).json({ error: 'Error actualizando el usuario' });
  } finally {
    connection.release();
  }
};
