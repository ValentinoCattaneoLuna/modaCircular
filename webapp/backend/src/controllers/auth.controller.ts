import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

// 👉 Función de registro
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, apellido, username, email, password } = req.body;

    // Verifica si el email ya está registrado
    const [emailCheck] = await pool.execute(
      'SELECT * FROM Usuarios WHERE mail = ?',
      [email]
    );

    if ((emailCheck as any[]).length > 0) {
      res.status(400).json({ error: 'El email ya está registrado' });
      return;
    }

    // Verifica si el username ya está en uso
    const [usernameCheck] = await pool.execute(
      'SELECT * FROM Usuarios WHERE username = ?',
      [username]
    );

    if ((usernameCheck as any[]).length > 0) {
      res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
      return;
    }

    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)
    );

    // Inserta el usuario en la base de datos
    const [result] = await pool.execute(
      'INSERT INTO Usuarios(nombre, apellido, mail, password_hash, username) VALUES(?,?,?,?,?)',
      [nombre, apellido, email, hashedPassword, username]
    );

    const insertId = (result as any).insertId;

    // Crea un token JWT
    const token = jwt.sign(
      { id: insertId, email },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '7d' }
    );

    // Devuelve el token
    res.status(201).json({ token });
  } catch (error) {
    console.error('❌ Error en register:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// 👉 Función de login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Busca el usuario por email
    const [users] = await pool.execute(
      'SELECT * FROM Usuarios WHERE mail = ?',
      [email]
    );

    const user = (users as any[])[0];

    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Compara la contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Crea el token
    const token = jwt.sign(
      { id: user.id_usuario, email: user.mail },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '7d' }
    );

    // Responde con el token y algunos datos del usuario
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.mail,
        nombre: user.nombre,
        username: user.username
      }
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
