// validate.ts
import * as yup from 'yup';
import type { Request, Response, NextFunction } from 'express';

const validate = (schema: yup.AnySchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validar y transformar el cuerpo
    const validatedBody = await schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    // Reemplazar el cuerpo con los datos validados
    req.body = validatedBody;
    next();
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return res.status(400).json({
        error: 'Error de validación',
        details: err.errors
      });
    }
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export default validate;