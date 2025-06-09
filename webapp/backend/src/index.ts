import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import {connectDB} from './config/db.ts';
import authRutes from './routes/auth.routes'
import publicacionesRoutes from './routes/publicaciones.routes';
import publicacionesFKRoutes from './routes/publicaciones_fk.routes';
import usuariosRoutes from './routes/user.routes.ts'
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

import path from 'path';
//conexion a la db
connectDB();

//cfg servidor
dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT || 4000;

app.use('/public', express.static(path.join(__dirname, '../public')));

//cfg middleware
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));


//montado de rutas
app.use('/api/auth', authRutes);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/publicaciones_fk', publicacionesFKRoutes);
app.use('/api/usuarios', usuariosRoutes)

//verificaciones del servidor
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});


app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
})

;app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});