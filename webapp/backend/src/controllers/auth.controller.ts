import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

//funcion de registro
export const register = async (req: Request, res: Response) => {
    try {
        //datos del formulario de registro
        const { nombre, apellido, username, email, password } = req.body

        //validar que el correo no este registrado
        const [emailCheck] = await pool.execute(
            'SELECT * FROM Usuarios WHERE email = ?',
            [email]
        );

        //valiidar que el username no este registrado
        const [usernameCheck] = await pool.execute(
            'SELECT * FROM Usuarios WHERE username = ?',
            [username]
        );

        //se encontro el mail en la db
        if ((emailCheck as any).length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        //se encontro el username en la db
        if ((usernameCheck as any).length > 0) {
            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        }

        //hasheo de contraseña
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS!));

        //registramos el usuario en la db
        const [result] = await pool.execute(
            'INSERT INTO Usuarios(nombre, apellido, mail, password_hash, username) VALUES(?,?,?,?,?)',
            [nombre, apellido, email, hashedPassword, username]
        );

        //creacion del token de validacion
        const token = jwt.sign(
            { id: (result as any).insertId, email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' } //hardcodeado por error del metodo sign xd¿?
        );
        //agrega al header el token
        res.status(201).json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

export const login = async (req: Request, res: Response) => {


    try {
        //datos del formulario de inicio de sesion
        const {email, password} = req.body;


        //obtenemos el usuario que coincida con el mail
        const [users] = await pool.execute(
            'SELECT * FROM Usuarios Where email = ?',
            [email]
        );

        //guardamos la primer tupla encontrada en una constante(deberia de ser la unica que exista)
        const user = (users as any)[0];

        //si no hay 'user' retorna que las credenciales son invalidas
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        //hasheamos la contraseña obtenida y la comparamos con la hasheada del usuario en la db
        const validPassword = await bcrypt.compare(password, user.password_hash);

        //si no son iguales retorna que las credenciales son invalidas
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        //creamos el token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        //se guarda el token en el body de la respuesta
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};