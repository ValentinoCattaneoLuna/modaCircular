import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { customAlphabet } from 'nanoid';
import { Request } from 'express';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../public/publicaciones_img'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = path.basename(file.originalname, ext);
    const uniqueName = `${name}-${nanoid()}${ext}`;
    cb(null, uniqueName);
  }
});

// ✅ Tipado correcto del fileFilter
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedExt = /\.(png|jpe?g|webp)$/i;
  const allowedMime = ['image/png', 'image/jpeg', 'image/webp'];

  if (allowedExt.test(file.originalname) && allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes PNG, JPG, JPEG o WEBP'));
  }
};

// Middleware exportado listo para usar
export const uploadImages = multer({
  storage,
  fileFilter,
  limits: {
    files: 6,
    fileSize: 5 * 1024 * 1024 // 5MB por imagen
  }
}).array('imagenes', 6); // El campo debe llamarse 'imagenes' en el formulario
