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
    precio: number
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
    precio: product.precio.toString(),
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
      } else if (precio > 10000) {
        newErrors.precio = "El precio no puede exceder €10,000"
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
      <Card>
        <CardHeader>
          <CardTitle>Información básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tipo de publicación */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de publicación *</Label>
            <Select
              value={formData.tipo_publicacion}
              onValueChange={(value: "Venta" | "Donación" | "Intercambio") =>
                setFormData((prev) => ({ ...prev, tipo_publicacion: value, precio: value === "Venta" ? prev.precio : "0" }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="venta">Vender</SelectItem>
                <SelectItem value="donacion">Regalar</SelectItem>
                <SelectItem value="intercambio">Intercambiar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
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
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Describe tu prenda: estado, detalles, historia..."
              className={`min-h-[120px] ${errors.descripcion ? "border-red-500" : ""}`}
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
              <Label htmlFor="precio">Precio (€) *</Label>
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
      <Card>
        <CardHeader>
          <CardTitle>Imágenes del producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
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
              <Button
                type="button"
                variant="outline"
                className="aspect-square border-dashed border-2 border-primary-custom/30 hover:border-primary-custom hover:bg-primary-custom/5"
                onClick={handleImageUpload}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Camera className="w-6 h-6 text-primary-custom" />
                  <span className="text-xs text-primary-custom font-medium">Agregar</span>
                </div>
              </Button>
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
      <Card>
        <CardHeader>
          <CardTitle>Detalles del producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, categoria: value }))}
              >
                <SelectTrigger className={errors.categoria ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vestidos">Vestidos</SelectItem>
                  <SelectItem value="camisetas">Camisetas</SelectItem>
                  <SelectItem value="pantalones">Pantalones</SelectItem>
                  <SelectItem value="chaquetas">Chaquetas</SelectItem>
                  <SelectItem value="zapatos">Zapatos</SelectItem>
                  <SelectItem value="accesorios">Accesorios</SelectItem>
                  <SelectItem value="bolsos">Bolsos</SelectItem>
                </SelectContent>
              </Select>
              {errors.categoria && <p className="text-sm text-red-500">{errors.categoria}</p>}
            </div>

            <div className="space-y-2">
              <Label>Talla *</Label>
              <Select
                value={formData.talle}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, talle: value }))}
              >
                <SelectTrigger className={errors.talle ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="s">S</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="l">L</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                  <SelectItem value="xxl">XXL</SelectItem>
                  <SelectItem value="unica">Talla única</SelectItem>
                </SelectContent>
              </Select>
              {errors.talle && <p className="text-sm text-red-500">{errors.talle}</p>}
            </div>

            <div className="space-y-2">
              <Label>Estado *</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, estado: value }))}
              >
                <SelectTrigger className={errors.estado ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nuevo">Nuevo con etiquetas</SelectItem>
                  <SelectItem value="como-nuevo">Como nuevo</SelectItem>
                  <SelectItem value="muy-bueno">Muy bueno</SelectItem>
                  <SelectItem value="bueno">Bueno</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado && <p className="text-sm text-red-500">{errors.estado}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color *</Label>
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
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handlePreview} disabled={isLoading}>
            <Eye className="w-4 h-4 mr-2" />
            Vista previa
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-primary-custom hover:bg-primary-custom/90" disabled={isLoading}>
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
