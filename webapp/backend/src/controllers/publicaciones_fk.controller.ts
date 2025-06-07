import type { Request, Response } from 'express';

import pool from '../config/db';
import dotenv from 'dotenv';



dotenv.config();

export const talles = async(req:Request,res:Response)=>{
    
    try{
        const [talles] = await pool.query( `SELECT * FROM talles`)
        res.status(200).json(talles);
    }
    catch (error) {
        console.error('❌ Error al obtener los talles:', error);
        res.status(500).json({ error: 'Error al obtener talles' });
    }
    
}


export const tipos_publicacion = async(req:Request,res:Response)=>{
    
    try{
        const [talles] = await pool.query( `SELECT * FROM tipos_publicacion`)
        res.status(200).json(talles);
    }
    catch (error) {
        console.error('❌ Error al obtener los tipos depublicacion:', error);
        res.status(500).json({ error: 'Error al obtener tipos depublicacion' });
    }
    
}


export const categorias = async(req:Request,res:Response)=>{
    try{
        const [talles] = await pool.query( `SELECT * FROM categorias`)
        res.status(200).json(talles);
    }
    catch (error) {
        console.error('❌ Error al obtener las categorias:', error);
        res.status(500).json({ error: 'Error al obtener categorias' });
    }
    
}