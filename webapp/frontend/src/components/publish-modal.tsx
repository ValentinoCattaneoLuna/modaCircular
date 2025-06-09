"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Camera } from "lucide-react"
import Cookies from 'js-cookie'

interface PublishModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PublishModal({ isOpen, onClose }: PublishModalProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tiposPublicacion, setTiposPublicacion] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [talles, setTalles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    publicationType: "",
    category: "",
    size: "",
    title: "",
    description: "",
    price: "",
    condition: "",
    color: "",
  })

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
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).slice(0, 6 - selectedFiles.length);
      setSelectedFiles(prev => [...prev, ...newFiles]);

      // Crear URLs de previsualización
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    // Revocar URL de memoria
    URL.revokeObjectURL(previewUrls[index]);

    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validaciones básicas
    if (!formData.publicationType || !formData.category || !formData.size ||
      !formData.title || !formData.condition || selectedFiles.length === 0) {
      alert('Por favor complete todos los campos obligatorios');
      setIsSubmitting(false);
      return;
    }

    if (formData.publicationType === "1" && !formData.price) {
      alert('Por favor ingrese un precio para la venta');
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();

    // Agregar datos del formulario
    formDataToSend.append('id_tipo_publicacion', formData.publicationType);
    formDataToSend.append('id_categoria', formData.category);
    formDataToSend.append('id_talle', formData.size);
    formDataToSend.append('titulo', formData.title);
    formDataToSend.append('descripcion', formData.description);
    formDataToSend.append('precio', formData.price);
    formDataToSend.append('estado', formData.condition);
    formDataToSend.append('color', formData.color);

    // Agregar archivos
    selectedFiles.forEach((file, index) => {
      formDataToSend.append('imagenes', file);
      if (index === 0) {
        formDataToSend.append('es_principal', 'true');
      }
    });

    try {
      const token = Cookies.get('token');
      const res = await fetch(`${API_URL}/api/publicaciones`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al publicar el producto');
      }

      const data = await res.json();
      console.log("Publicación creada:", data);
      onClose();
      // Resetear formulario después de enviar
      setFormData({
        publicationType: "",
        category: "",
        size: "",
        title: "",
        description: "",
        price: "",
        condition: "",
        color: "",
      });
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (err) {
      console.error("Error al publicar:", err);
      alert(err instanceof Error ? err.message : 'Hubo un error al publicar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Limpiar URLs de memoria al desmontar
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

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
              required
            >
              <SelectTrigger className="bg-white cursor-pointer">
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

          {/* Subida de imágenes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Imágenes del producto *</Label>
            <div className="grid grid-cols-3 gap-3">
              {previewUrls.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
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
              {previewUrls.length < 6 && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-48 aspect-square border-dashed border-2 border-primary-custom/30 hover:border-primary-custom hover:bg-primary-custom/5"
                    onClick={handleImageUpload}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Camera className="w-8 h-8 text-primary-custom" />
                      <span className="text-sm text-primary-custom font-medium">Agregar foto</span>
                    </div>
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                </>
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

          {/* Campos agrupados */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })} 
                required
              >
                <SelectTrigger className="bg-white cursor-pointer">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categorias.map((cat: any) => (
                    <SelectItem
                      key={cat.id_categoria}
                      value={String(cat.id_categoria)}
                      
                      className="bg-white hover:bg-green-50 cursor-pointer"
                    >
                      {cat.categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Talles *</Label>
              <Select
                value={formData.size}
                onValueChange={(value) => setFormData({ ...formData, size: value })}
                required
              >
                <SelectTrigger className="bg-white cursor-pointer">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Estado *</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
                required
              >
                <SelectTrigger className="bg-white hover:cursor-pointer">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="bg-white ">
                  <SelectItem value="Nuevo" className="bg-white hover:bg-green-50 cursor-pointer">Nuevo</SelectItem>
                  <SelectItem value="Como nuevo" className="bg-white hover:bg-green-50 cursor-pointer">Como nuevo</SelectItem>
                  <SelectItem value="Bueno" className="bg-white hover:bg-green-50 cursor-pointer">Bueno</SelectItem>
                  <SelectItem value="Detalles" className="bg-white hover:bg-green-50 cursor-pointer">Detalles</SelectItem>
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

          {/* Precio (solo para venta) */}
          {formData.publicationType === "1" && (
            <div className="space-y-2">
              <Label htmlFor="price">Precio *</Label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <Input
                  id="price"
                  type="number"
                  placeholder="20000"
                  className="pl-8"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              className="bg-red-600 text-white cursor-pointer transition-all hover:scale-110 focus:scale-90"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary-custom hover:bg-primary-custom/90 text-white cursor-pointer transition-all hover:scale-110 focus:scale-90"
              onClick={() => {
                // Esto recarga la página una vez que el formulario termina de enviarse
                if (!isSubmitting) {
                  return;
                }
                // Recargar la página cuando se termine el submit
                setTimeout(() => {
                  window.location.reload();
                }, 500); // Un pequeño retraso para esperar el cambio de estado
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publicando..." : "Publicar Producto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}