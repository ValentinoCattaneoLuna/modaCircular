import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { login, register } from '../controllers/auth.controller';
import validate from '../middleware/validate';
import { loginSchema, registerSchema } from '../validations/auth.schemas';

const router = Router();

router.post('/register', register);
router.post('/login',  login);

export default router;