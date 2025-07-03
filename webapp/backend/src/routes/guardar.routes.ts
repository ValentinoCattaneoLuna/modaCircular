import { Router } from 'express';
import { borrarPublicacion, guardarPublicacion, esFavorito,obtenerPublicacionesGuardadas } from '../controllers/guardar.controller';
import { authenticate } from "../middleware/auth";
const router = Router();

// Ruta para registrar usuario
router.post('/guardarPublicacion',authenticate, guardarPublicacion);

// Ruta para iniciar sesión
router.delete('/borrarPublicacion/:id_publicacion', authenticate,borrarPublicacion);

router.get('/estado/:id_publicacion', authenticate, esFavorito);

router.get('/guardadas',authenticate,obtenerPublicacionesGuardadas)

export default router;