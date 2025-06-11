import { Router } from "express";
import {crearTestimonio, verTestimonios} from '../controllers/testimonios.controller'


const router = Router();

router.get('/',verTestimonios)


router.post('/', crearTestimonio)


export default router
