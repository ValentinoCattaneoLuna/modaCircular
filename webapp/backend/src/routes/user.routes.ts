import { Router } from "express";
import { verUsuarios, verUsuarioPorId, actualizarUsuarioId, verUsuarioPorUsername} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";


const router = Router();


router.get('/', verUsuarios)

router.get('/:id_usuario',verUsuarioPorId)

router.get('/username/:username',verUsuarioPorUsername)

router.patch('/:id_usuario',authenticate, actualizarUsuarioId)

export default router;