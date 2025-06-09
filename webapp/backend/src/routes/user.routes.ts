import { Router } from "express";
import { verUsuarios, verUsuarioPorId } from "../controllers/user.controller";


const router = Router();


router.get('/', verUsuarios)

router.get('/:id_usuario',verUsuarioPorId)

export default router;