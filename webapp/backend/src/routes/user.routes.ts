import { Router } from "express";
import { verUsuarios, verUsuarioPorId, actualizarUsuarioId} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";


const router = Router();


router.get('/', verUsuarios)

router.get('/:id_usuario',verUsuarioPorId)

router.patch('/:id_usuario',authenticate, actualizarUsuarioId)

export default router;