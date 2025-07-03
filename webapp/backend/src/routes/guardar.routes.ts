import { Router } from 'express';
import { borrarPublicacion, guardarPublicacion } from '../controllers/guardar.controller';

const router = Router();

// Ruta para registrar usuario
router.post('/guardarPublicacion', guardarPublicacion);

// Ruta para iniciar sesión
router.delete('/borrarPublicacion/:id_publicacion', borrarPublicacion);



export default router;