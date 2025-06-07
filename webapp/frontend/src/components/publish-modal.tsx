"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Camera } from "lucide-react"

interface PublishModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PublishModal({ isOpen, onClose }: PublishModalProps) {
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    publicationType: "", // id_tipo_publicacion
    category: "",         // id_categoria
    size: "",             // id_talle
    title: "",
    description: "",
    price: "",
    condition: "",        // estado
    color: "",
  })

  const handleImageUpload = () => {
    const newImage = `/placeholder.svg?height=200&width=200&text=Imagen${images.length + 1}`
    setImages([...images, newImage])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const body = {
      id_tipo_publicacion: Number(formData.publicationType),
      id_categoria: Number(formData.category),
      id_talle: Number(formData.size),
      titulo: formData.title,
      descripcion: formData.description,
      precio: Number(formData.price),
      estado: formData.condition,
      color: formData.color,
      imagenes: images.map((url, index) => ({
        url,
        es_principal: index === 0,
      })),
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/publicaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Error al publicar el producto")
      console.log("Producto publicado correctamente")
      onClose()
    } catch (err) {
      console.error(err)
      alert("Hubo un error al publicar el producto.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary-custom">Publicar Producto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de publicación */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de publicación *</Label>
            <Select
              value={formData.publicationType}
              onValueChange={(value) => setFormData({ ...formData, publicationType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="¿Qué quieres hacer con tu prenda?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Vender</SelectItem>
                <SelectItem value="2">Regalar</SelectItem>
                <SelectItem value="3">Intercambiar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Imágenes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Imágenes del producto *</Label>
            <div className="grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Producto ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {images.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  className="aspect-square border-dashed border-2 border-primary-custom/30 hover:border-primary-custom hover:bg-primary-custom/5"
                  onClick={handleImageUpload}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Camera className="w-6 h-6 text-primary-custom" />
                    <span className="text-xs text-primary-custom font-medium">Agregar foto</span>
                  </div>
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500">Agrega hasta 6 fotos. La primera será la principal.</p>
          </div>

          {/* Información básica */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Ej: Buzo Rojo Nike"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe tu prenda: estado, detalles, historia..."
                className="min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Vestidos</SelectItem>
                  <SelectItem value="2">Camisetas</SelectItem>
                  <SelectItem value="3">Pantalones</SelectItem>
                  <SelectItem value="4">Chaquetas</SelectItem>
                  <SelectItem value="5">Zapatos</SelectItem>
                  <SelectItem value="6">Accesorios</SelectItem>
                  <SelectItem value="7">Bolsos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Talla *</Label>
              <Select
                value={formData.size}
                onValueChange={(value) => setFormData({ ...formData, size: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">XS</SelectItem>
                  <SelectItem value="2">S</SelectItem>
                  <SelectItem value="3">M</SelectItem>
                  <SelectItem value="4">L</SelectItem>
                  <SelectItem value="5">XL</SelectItem>
                  <SelectItem value="6">XXL</SelectItem>
                  <SelectItem value="7">Talla única</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Estado *</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nuevo con etiquetas">Nuevo con etiquetas</SelectItem>
                  <SelectItem value="Como nuevo">Como nuevo</SelectItem>
                  <SelectItem value="Muy bueno">Muy bueno</SelectItem>
                  <SelectItem value="Bueno">Bueno</SelectItem>
                  <SelectItem value="Detalles">Detalles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                placeholder="Ej: Rojo"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
          </div>

          {/* Precio (solo si es venta) */}
          {formData.publicationType === "1" && (
            <div className="space-y-2">
              <Label htmlFor="price">Precio *</Label>
              <Input
                id="price"
                type="number"
                placeholder="20000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary-custom hover:bg-primary-custom/90 text-white">
              Publicar Producto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
