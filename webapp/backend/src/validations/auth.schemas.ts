// auth.schemas.ts
import * as yup from 'yup';

// Remueve el nivel extra de "body"
export const registerSchema = yup.object({
  nombre: yup.string().required().min(3),
  apellido: yup.string().required().min(3),
  email: yup.string().email().required(),
  username: yup.string().required().min(3).matches(/^[a-zA-Z0-9_]+$/),
  password: yup.string().min(8).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).required()
});

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
});