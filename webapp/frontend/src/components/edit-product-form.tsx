"use client"


import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Camera, Plus, AlertCircle, Save, Eye, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProductoBackend {
    id_publicacion: number
    titulo: string
    precio?: number
    imagenes: string
    estado: string
    talle: string
    tipo_publicacion: "Venta" | "Donación" | "Intercambio"
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
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [newTag, setNewTag] = useState("")

  const [formData, setFormData] = useState({
    titulo: product.titulo,
    descripcion: product.descripcion,
    precio: product.precio?.toString() || "0",
    imagenes: product.imagenes.toString().split(","),
    tipo_publicacion: product.tipo_publicacion,
    categoria: product.categoria,
    talle: product.talle,
    estado: product.estado,
    color: product.color,
   
    //status: product.status,
  })

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
    if (formData.tipo_publicacion === "Venta") {
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

    // Medidas (validación numérica)
    // const measurements: FormErrors["measurements"] = {}
    // if (
    //   formData.measurements.bust &&
    //   (isNaN(Number(formData.measurements.bust)) || Number(formData.measurements.bust) <= 0)
    // ) {
    //   measurements.bust = "Debe ser un número válido mayor a 0"
    // }
    // if (
    //   formData.measurements.waist &&
    //   (isNaN(Number(formData.measurements.waist)) || Number(formData.measurements.waist) <= 0)
    // ) {
    //   measurements.waist = "Debe ser un número válido mayor a 0"
    // }
    // if (
    //   formData.measurements.length &&
    //   (isNaN(Number(formData.measurements.length)) || Number(formData.measurements.length) <= 0)
    // ) {
    //   measurements.length = "Debe ser un número válido mayor a 0"
    // }
    // if (Object.keys(measurements).length > 0) {
    //   newErrors.measurements = measurements
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageUpload = () => {
    if (formData.imagenes.length >= 6) return
    const newImage = `/placeholder.svg?height=300&width=300&text=Nueva+Imagen+${formData.imagenes.length + 1}`
    setFormData((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, newImage],
    }))
  }

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

  // const addTag = () => {
  //   if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase()) && formData.tags.length < 10) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       tags: [...prev.tags, newTag.trim().toLowerCase()],
  //     }))
  //     setNewTag("")
  //   }
  // }

  // const removeTag = (tagToRemove: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     tags: prev.tags.filter((tag) => tag !== tagToRemove),
  //   }))
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simular llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Producto actualizado:", formData)

      // Redirigir al producto actualizado
      router.push(`/product/${product.id_publicacion}`)
    } catch (error) {
      console.error("Error al actualizar producto:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    router.push(`/product/${product.id_publicacion}`)
  }

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.")) {
      setIsLoading(true)
      try {
        // Simular eliminación
        await new Promise((resolve) => setTimeout(resolve, 1000))
        router.push("/profile")
      } catch (error) {
        console.error("Error al eliminar producto:", error)
      } finally {
        setIsLoading(false)
      }
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
            <Select
              value={formData.tipo_publicacion}
              onValueChange={(value: "Venta" | "Donación" | "Intercambio") =>
                setFormData((prev) => ({ ...prev, tipo_publicacion: value, precio: value === "Venta" ? prev.precio : "0" }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full border border-gray-300 rounded-md bg-white text-gray-900 shadow-md">
                <SelectItem value="Venta" className="border-b border-gray-200 py-2">Vender</SelectItem>
                <SelectItem value="Donación" className="border-b border-gray-200 py-2">Regalar</SelectItem>
                <SelectItem value="Intercambio" className="border-b border-gray-200 py-2">Intercambiar</SelectItem>
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
          {formData.tipo_publicacion === "Venta" && (
            <div className="space-y-2">
              <Label className="block text-sm font-bold text-gray-900 mb-1"  htmlFor="precio">Precio ($) *</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                max="10000"
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
                  src={image || "/placeholder.svg"}
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
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, categoria: value }))}
              >
                <SelectTrigger className={errors.categoria ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="w-full border border-gray-300 rounded-md bg-white text-gray-900 shadow-md">
                  <SelectItem value="vestidos" className="border-b border-gray-200 py-2">Vestidos</SelectItem>
                  <SelectItem value="camisetas" className="border-b border-gray-200 py-2">Camisetas</SelectItem>
                  <SelectItem value="pantalones" className="border-b border-gray-200 py-2">Pantalones</SelectItem>
                  <SelectItem value="chaquetas" className="border-b border-gray-200 py-2">Chaquetas</SelectItem>
                  <SelectItem value="zapatos" className="border-b border-gray-200 py-2">Zapatos</SelectItem>
                  <SelectItem value="accesorios" className="border-b border-gray-200 py-2">Accesorios</SelectItem>
                  <SelectItem value="bolsos" className="border-b border-gray-200 py-2">Bolsos</SelectItem>
                </SelectContent>
              </Select>
              {errors.categoria && <p className="text-sm text-red-500">{errors.categoria}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm block font-bold text-gray-900 mb-1">Talla *</Label>
              <Select
                value={formData.talle}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, talle: value }))}
              >
                <SelectTrigger className={errors.talle ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="w-full border border-gray-300 rounded-md bg-white text-gray-900 shadow-md">
                  <SelectItem value="xs" className="border-b border-gray-200 py-2">XS</SelectItem>
                  <SelectItem value="s" className="border-b border-gray-200 py-2">S</SelectItem>
                  <SelectItem value="m" className="border-b border-gray-200 py-2">M</SelectItem>
                  <SelectItem value="l" className="border-b border-gray-200 py-2">L</SelectItem>
                  <SelectItem value="xl" className="border-b border-gray-200 py-2">XL</SelectItem>
                  <SelectItem value="xxl" className="border-b border-gray-200 py-2">XXL</SelectItem>
                  <SelectItem value="unica" className="border-b border-gray-200 py-2">Talla única</SelectItem>
                </SelectContent>
              </Select>
              {errors.talle && <p className="text-sm text-red-500">{errors.talle}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm block font-bold text-gray-900 mb-1">Estado *</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, estado: value }))}
              >
                <SelectTrigger className={errors.estado ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="w-full border border-gray-300 rounded-md bg-white text-gray-900 shadow-md">
                  <SelectItem value="nuevo" className="border-b border-gray-200 py-2">Nuevo con etiquetas</SelectItem>
                  <SelectItem value="como-nuevo" className="border-b border-gray-200 py-2">Como nuevo</SelectItem>
                  <SelectItem value="muy-bueno" className="border-b border-gray-200 py-2">Muy bueno</SelectItem>
                  <SelectItem value="bueno" className="border-b border-gray-200 py-2">Bueno</SelectItem>
                  <SelectItem value="regular" className="border-b border-gray-200 py-2">Regular</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado && <p className="text-sm text-red-500">{errors.estado}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm block font-bold text-gray-900 mb-1">Color *</Label>
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

          {/* Medidas */}
          {/* <div className="space-y-4">
            <Label className="text-base font-medium">Medidas (cm)</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bust">Pecho</Label>
                <Input
                  id="bust"
                  type="number"
                  value={formData.measurements.bust}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      measurements: { ...prev.measurements, bust: e.target.value },
                    }))
                  }
                  placeholder="92"
                  className={errors.measurements?.bust ? "border-red-500" : ""}
                />
                {errors.measurements?.bust && <p className="text-sm text-red-500">{errors.measurements.bust}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="waist">Cintura</Label>
                <Input
                  id="waist"
                  tipo_publicacion="number"
                  value={formData.measurements.waist}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      measurements: { ...prev.measurements, waist: e.target.value },
                    }))
                  }
                  placeholder="76"
                  className={errors.measurements?.waist ? "border-red-500" : ""}
                />
                {errors.measurements?.waist && <p className="text-sm text-red-500">{errors.measurements.waist}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Largo</Label>
                <Input
                  id="length"
                  tipo_publicacion="number"
                  value={formData.measurements.length}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      measurements: { ...prev.measurements, length: e.target.value },
                    }))
                  }
                  placeholder="110"
                  className={errors.measurements?.length ? "border-red-500" : ""}
                />
                {errors.measurements?.length && <p className="text-sm text-red-500">{errors.measurements.length}</p>}
              </div>
            </div>
          </div> */}

          <Separator />

          {/* Tags */}
          {/* <div className="space-y-4">
            <Label className="text-base font-medium">Etiquetas</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  #{tag}
                  <Button
                    type="button"
                    variant="ghost"
                    talle="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Agregar etiqueta"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                disabled={formData.tags.length >= 10}
              />
              <Button type="button" onClick={addTag} disabled={!newTag.trim() || formData.tags.length >= 10}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">Máximo 10 etiquetas</p>
          </div> */}
        </CardContent>
      </Card>

      {/* Estado de la publicación */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Estado de la publicación</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.status}
            onValueChange={(value: "activa" | "pausada" | "vendida") =>
              setFormData((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activa">Activa</SelectItem>
              <SelectItem value="pausada">Pausada</SelectItem>
              <SelectItem value="vendida">Vendida</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-2">
            {formData.status === "activa" && "La publicación será visible para otros usuarios"}
            {formData.status === "pausada" && "La publicación estará oculta temporalmente"}
            {formData.status === "vendida" && "Marca el producto como vendido"}
          </p>
        </CardContent>
      </Card> */}

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
