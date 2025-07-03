"use client"


import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Camera, AlertCircle, Save  } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Cookies from "js-cookie"
import { toast } from 'sonner';

interface ProductoBackend {
  id_publicacion: number
  titulo: string
  precio?: number
  imagenes: string
  estado: string
  talle: string
  tipo_publicacion: string
  categoria: string
  descripcion: string
  color: string
  id_usuario: number
  nombre_usuario: string
  apellido_usuario: string
  fecha_publicacion: string
}
interface UsuarioBackend {

  id_usuario: number
  username: string
  avatar: string | null
  telefono: string
  nombre: string
  apellido: string
}
interface EditProductFormProps {
  product: ProductoBackend
}

interface FormErrors {
  titulo?: string
  descripcion?: string
  precio?: string
  imagenes?: string
  categoria?: string
  talle?: string
  estado?: string
  color?: string
  measurements?: {
    bust?: string
    waist?: string
    length?: string
  }
}

export function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [tiposPublicacion, setTiposPublicacion] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [talles, setTalles] = useState([]);
  const [errors, setErrors] = useState<FormErrors>({})
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setFormData] = useState<{
    titulo: string
    descripcion: string
    precio: string
    imagenes: (string | File)[]
    tipo_publicacion: string
    categoria: string
    talle: string
    estado: string
    color: string
  }>({
    titulo: product.titulo,
    descripcion: product.descripcion,
    precio: product.precio?.toString() || "0",
    imagenes: product.imagenes.toString().split(","),
    tipo_publicacion: product.tipo_publicacion,
    categoria: product.categoria,
    talle: product.talle,
    estado: product.estado,
    color: product.color,
  })
    console.log("🧾 product.imagenes:", product.imagenes);

  // Validaciones

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Título
    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es obligatorio"
    } else if (formData.titulo.length < 5) {
      newErrors.titulo = "El título debe tener al menos 5 caracteres"
    } else if (formData.titulo.length > 100) {
      newErrors.titulo = "El título no puede exceder 100 caracteres"
    }

    // Descripción
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria"
    } else if (formData.descripcion.length < 20) {
      newErrors.descripcion = "La descripción debe tener al menos 20 caracteres"
    } else if (formData.descripcion.length > 1000) {
      newErrors.descripcion = "La descripción no puede exceder 1000 caracteres"
    }

    // Precio (solo para ventas)
    if (formData.tipo_publicacion === "1") {
      const precio = Number.parseFloat(formData.precio)
      if (!formData.precio || isNaN(precio)) {
        newErrors.precio = "El precio es obligatorio para productos en venta"
      } else if (precio <= 0) {
        newErrors.precio = "El precio debe ser mayor a 0"
      }
    }

    // Imágenes
    if (formData.imagenes.length === 0) {
      newErrors.imagenes = "Debe agregar al menos una imagen"
    } else if (formData.imagenes.length > 6) {
      newErrors.imagenes = "No puede agregar más de 6 imágenes"
    }

    // Campos obligatorios
    if (!formData.categoria) {
      newErrors.categoria = "La categoría es obligatoria"
    }
    if (!formData.talle) {
      newErrors.talle = "La talla es obligatoria"
    }
    if (!formData.estado) {
      newErrors.estado = "El estado es obligatorio"
    }
    if (!formData.color.trim()) {
      newErrors.color = "El color es obligatorio"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function getPublicacionesFKData(url: string) {
    try {
      const response = await fetch(`${API_URL}${url}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener FK DATA:", error);
      return null;
    }
  }
  useEffect(() => {
    async function fetchFKData() {
      const [tipos, cats, sizes] = await Promise.all([
        getPublicacionesFKData('/api/publicaciones_fk/tipo_publicacion'),
        getPublicacionesFKData('/api/publicaciones_fk/categorias'),
        getPublicacionesFKData('/api/publicaciones_fk/talles')

      ]);
      if (tipos) setTiposPublicacion(tipos);
      if (cats) setCategorias(cats);
      if (sizes) setTalles(sizes);
    }

    fetchFKData();
  }, []);


  const handleImageUpload = () => {
    if (formData.imagenes.length >= 6) return;
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);

    // Validar cantidad total
    const total = formData.imagenes.length + filesArray.length;
    if (total > 6) {
      toast.error("No puedes subir más de 6 imágenes");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, ...filesArray],
    }));
  };
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }))
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...formData.imagenes]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    setFormData((prev) => ({ ...prev, imagenes: newImages }))
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Validación básica
    if (!formData.titulo.trim()) {
      setErrors({ ...errors, titulo: "El título es obligatorio" })
      return
    }

    setIsLoading(true)

    try {
      const form = new FormData()

      form.append("id_tipo_publicacion", formData.tipo_publicacion)
      form.append("id_categoria", formData.categoria)
      form.append("id_talle", formData.talle)
      form.append("titulo", formData.titulo)
      form.append("descripcion", formData.descripcion)
      form.append("precio", formData.precio || "0")
      form.append("estado", formData.estado)
      form.append("color", formData.color)

      // Imágenes: separar entre nuevas y existentes
      for (const img of formData.imagenes) {
        if (typeof img === "string" && !img.startsWith("blob:") && !img.startsWith("data:")) {
          form.append("imagenes_existentes[]", img); // URL de imagen ya almacenada
        } else if (img instanceof File) {
          form.append("imagenes", img); // archivo nuevo
        }
      }
      const totalImagenes = formData.imagenes.length;
      if (totalImagenes > 6) {
        toast.error("No puedes guardar más de 6 imágenes.");
        setIsLoading(false);
        return;
      }
      if (totalImagenes === 0) {
        toast.error("Debes agregar al menos una imagen.");
        setIsLoading(false);
        return;
      }

      const token = Cookies.get("token")

      const res = await fetch(`${API_URL}/api/publicaciones/${product.id_publicacion}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form,
      })

      if (!res.ok) throw new Error("Error al actualizar la publicación")

      toast.success("¡Publicación actualizada con éxito!")
      router.push(`/product/${product.id_publicacion}`)

    } catch (err) {
      console.error(err)
      toast.error("Hubo un error al guardar los cambios.")
    } finally {
      setIsLoading(false)
    }

  }





  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información básica */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle>Información básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tipo de publicación */}
          <div className="space-y-2">
            <Label className="text-sm block font-bold text-gray-900 mb-1">Tipo de publicación *</Label>
            <span className="text-[0.7rem] font-bold text-gray-500"> Tipo anterior: {product.tipo_publicacion}</span>

            <Select
              value={formData.tipo_publicacion}
              onValueChange={(value) => setFormData({ ...formData, tipo_publicacion: value })}
              required
            >
              <SelectTrigger className="bg-white cursor-pointer border-gray-300 focus:ring-[#22c55e]">
                <SelectValue placeholder="¿Qué quieres hacer con tu prenda?" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {tiposPublicacion.map((tipo: any) => (
                  <SelectItem
                    className="bg-white hover:bg-green-50 cursor-pointer"
                    key={tipo.id_tipo_publicacion}
                    value={String(tipo.id_tipo_publicacion)}
                  >
                    {tipo.tipo_publicacion}
                  </SelectItem>

                ))}

              </SelectContent>
            </Select>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label className="block text-sm font-bold text-gray-900 mb-1" htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
              placeholder="Ej: Vestido floral vintage talla M"
              className={errors.titulo ? "border-red-500" : ""}
            />
            {errors.titulo && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.titulo}
              </p>
            )}
            <p className="text-xs text-gray-500">{formData.titulo.length}/100 caracteres</p>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label className="block text-sm font-bold text-gray-900 mb-1" htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Describe tu prenda: estado, detalles, historia..."
              className={`resize-none min-h-[120px] ${errors.descripcion ? "border-red-500" : ""}`}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.descripcion}
              </p>
            )}
            <p className="text-xs text-gray-500">{formData.descripcion.length}/1000 caracteres</p>
          </div>

          {/* Precio (solo para ventas) */}
          {formData.tipo_publicacion === '1' && (
            <div className="space-y-2">
              <Label className="block text-sm font-bold text-gray-900 mb-1" htmlFor="precio">Precio ($) *</Label>

              <span className="text-[0.7rem] font-bold text-gray-500"> Precio anterior: ${product.precio}</span>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={(e) => setFormData((prev) => ({ ...prev, precio: e.target.value }))}
                placeholder="0.00"
                className={errors.precio ? "border-red-500" : ""}
              />
              {errors.precio && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.precio}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Imágenes */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle>Imágenes del producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 items-start">
            {formData.imagenes.map((image, index) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt={`Producto ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  {index > 0 && (
                    <Button type="button" size="sm" variant="secondary" onClick={() => moveImage(index, index - 1)}>
                      ←
                    </Button>
                  )}
                  {index < formData.imagenes.length - 1 && (
                    <Button type="button" size="sm" variant="secondary" onClick={() => moveImage(index, index + 1)}>
                      →
                    </Button>
                  )}
                  <Button type="button" size="sm" variant="destructive" onClick={() => removeImage(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {index === 0 && <Badge className="absolute top-2 left-2 bg-primary-custom text-white">Principal</Badge>}
              </div>
            ))}
            {formData.imagenes.length < 6 && (
              <div
                onClick={handleImageUpload}
                className="flex items-center justify-center aspect-square w-full border-2 border-dashed border-gray-400 rounded-lg hover:border-green-500 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex flex-col items-center space-y-2 text-center">
                  <Camera className="w-10 h-10 text-green-600" />
                  <span className="text-sm text-gray-800 font-medium">Agregar más fotos</span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>

            )}
          </div>
          {errors.imagenes && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.imagenes}</AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-gray-500">Puedes agregar hasta 6 imágenes. La primera será la imagen principal.</p>
        </CardContent>
      </Card>

      {/* Detalles del producto */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle>Detalles del producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm block font-bold text-gray-900 mb-1">Categoría *</Label>
              <span className="text-[0.7rem] font-bold text-gray-500"> Categoria anterior: {product.categoria}</span>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                required

              >
                <SelectTrigger className="bg-white cursor-pointer border-gray-300 focus:ring-[#22c55e]">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categorias.map((cat: any) => (
                    <SelectItem
                      key={cat.id_categoria}
                      value={String(cat.id_categoria)}

                      className="bg-white hover:bg-green-50 cursor-pointer "
                    >
                      {cat.categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria && <p className="text-sm text-red-500">{errors.categoria}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm block font-bold text-gray-900 mb-1">Talle *</Label>
              <span className="text-[0.7rem] font-bold text-gray-500"> Talle anterior: {product.talle}</span>
              <Select
                value={formData.talle}
                onValueChange={(value) => setFormData({ ...formData, talle: value })}
                required
              >
                <SelectTrigger className="bg-white cursor-pointer border-gray-300 focus:ring-[#22c55e]">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {talles.map((talle: any) => (
                    <SelectItem
                      key={talle.id_talle}
                      value={String(talle.id_talle)}
                      className="bg-white hover:bg-green-50 cursor-pointer"
                    >
                      {talle.talle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.talle && <p className="text-sm text-red-500">{errors.talle}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm block font-bold text-gray-900 mb-1">Estado *</Label>
              <span className="text-[0.7rem] font-bold text-gray-500"> Estado anterior: {product.estado}</span>
              <Select
                value={formData.estado}
                onValueChange={(value) => setFormData({ ...formData, estado: value })}
                required
              >
                <SelectTrigger className="bg-white hover:cursor-pointer border-gray-300 focus:ring-[#22c55e]">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="bg-white ">
                  <SelectItem value="Nuevo" className="bg-white hover:bg-green-50 cursor-pointer">Nuevo</SelectItem>
                  <SelectItem value="Como nuevo" className="bg-white hover:bg-green-50 cursor-pointer">Como nuevo</SelectItem>
                  <SelectItem value="Bueno" className="bg-white hover:bg-green-50 cursor-pointer">Bueno</SelectItem>
                  <SelectItem value="Detalles" className="bg-white hover:bg-green-50 cursor-pointer">Detalles</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado && <p className="text-sm text-red-500">{errors.estado}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm block font-bold text-gray-900 mb-1">Color *</Label>
              <span className="text-[0.7rem] font-bold text-gray-500"> Color anterior: {product.color}</span>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                placeholder="Ej: Azul marino"
                className={errors.color ? "border-red-500" : ""}
              />
              {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
            </div>




          </div>
          <Separator />

        </CardContent>
      </Card>


      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">


        <div className="flex  gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="bg-red-600 text-white cursor-pointer transition-all hover:scale-110 focus:scale-90"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            className="bg-primary-custom hover:bg-primary-custom/90 text-white cursor-pointer transition-all hover:scale-110 focus:scale-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </div>


    </form>
  )
}
