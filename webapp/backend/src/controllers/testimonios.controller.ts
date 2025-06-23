import type { Request, Response } from 'express';
import pool from '../config/db';
import dotenv from 'dotenv';



dotenv.config();

export async function crearTestimonio(req: Request, res: Response) {

    const connection = await pool.getConnection()
    const { nombre_testimonio, mensaje_testimonio, cantidad_estrellas } = req.body

    if (!nombre_testimonio || !mensaje_testimonio || !cantidad_estrellas) {
        res.status(400).json({ error: 'Faltan campos obligatorios' });
        return
    }
    try {

        await connection.beginTransaction()
        const [result] = await connection.execute(
         `
        INSERT INTO testimonios(nombre_testimonio,mensaje_testimonio,cantidad_estrellas) VALUES (?,?,?) 
        `
        , [nombre_testimonio, mensaje_testimonio, cantidad_estrellas])

        await connection.commit()
        res.status(201).json({ message: "testimonio cargado con exito" })
    }

    catch (err) {
        res.status(500).json({ Error: "error cargando el testimonio" })
        await connection.rollback()

    }
    finally {
        connection.release()
    }



}



export async function verTestimonios(req: Request, res: Response) {


    try {
        const [testimonios] = await pool.query(
            `
            SELECT * FROM testimonios
            ORDER BY RAND()
            LIMIT 6;
            `)
        res.status(200).json(testimonios)
        return
    } catch (err) {
        res.status(500).json({ Error: "Error del obteniendo los testimonios" })
        return
    }


}
