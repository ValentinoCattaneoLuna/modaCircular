import { Router } from 'express';
import { talles, categorias, tipos_publicacion } from '../controllers/publicaciones_fk.controller';

const router = Router();

router.get('/talles',talles)
router.get('/categorias',categorias)
router.get('/tipo_publicacion',tipos_publicacion)


export default router;