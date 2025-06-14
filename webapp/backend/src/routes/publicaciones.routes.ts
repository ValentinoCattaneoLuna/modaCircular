import { Router } from "express";
import { crearPublicacion, verPublicaciones, verPublicacionPorId, eliminarPublicacionPorId, editarPublicacionPorId} from "../controllers/publicaciones.controller";
import { authenticate } from "../middleware/auth";



const router = Router();

//ruta para crear publicacion
router.post('/',authenticate, crearPublicacion)

//ruta para ver todas publicaciones
router.get('/', verPublicaciones)

//ruta para ver publicacion por id
router.get('/:id_publicacion',verPublicacionPorId)

//ruta para eliminar publicacion por id
router.delete('/:id_publicacion',authenticate, eliminarPublicacionPorId)

//ruta para editar publicacion por id
router.put('/:id_publicacion',authenticate, editarPublicacionPorId)

export default router;