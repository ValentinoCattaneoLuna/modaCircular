import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import {connectDB} from './config/db.ts';
import authRutes from './routes/auth.routes'
import publicacionesRoutes from '.routes/publicaciones.routes'
import type { Request, Response, NextFunction } from 'express';

//cfg servidor
const app = express();
const PORT = process.env.SERVER_PORT || 4000;


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

//conexion a la db
connectDB();

//montado de rutas
app.use('/api/auth', authRutes);
app.use('/api/publicaciones', publicacionesRoutes);


//verificaciones del servidor
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});


app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});