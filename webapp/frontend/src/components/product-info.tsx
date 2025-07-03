"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Gift, ArrowRightLeft, Eye, Calendar, Ruler } from "lucide-react"

interface ProductInfoProps {
  product: {
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
}

export function ProductInfo({ product }: ProductInfoProps) {
  const getTypeIcon = () => {
    switch (product.tipo_publicacion) {
      case "Donación":
        return <Gift className="w-4 h-4" />
      case "Intercambio":
        return <ArrowRightLeft className="w-4 h-4" />
      default:
        return null
    }
  }

  const getTypeColor = () => {
    switch (product.tipo_publicacion) {
      case "Donación":
        return "bg-blue-100 text-blue-800"
      case "Intercambio":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const getTypeText = () => {
    switch (product.tipo_publicacion) {
      case "Donación":
        return "Gratis"
      case "Intercambio":
        return "Intercambio"
      default:
        return "Venta"
    }
  }

const formatDate = (dateString: string) => {
  const [day, month, year] = dateString.split("/").map(Number);
  const date = new Date(year, month - 1, day); 
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};


  return (
    <div className="space-y-6 ">
      {/* Información principal */}
      <Card className="border-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 ">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">{product.titulo}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`flex items-center gap-1 ${getTypeColor()}`}>
                  {getTypeIcon()}
                  <span>{getTypeText()}</span>
                </Badge>
                {/* <div className="flex items-center text-sm text-gray-500">
                  <Eye className="w-4 h-4 mr-1" />
                  {product.views} visualizaciones
                </div> */}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-custom">
                {product.tipo_publicacion === "Venta"
                  ? `$${product.precio}`
                  : product.tipo_publicacion === "Donación"
                    ? "Gratis"
                    : "Intercambio"}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed wrap-break-word ">{product.descripcion}</p>

          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            Publicado el {formatDate(product.fecha_publicacion)}
          </div>
        </CardContent>
      </Card>

      {/* Detalles del producto */}
      <Card className="border-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Detalles del producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-bold text-gray-900">Estado:</span>
              <p className="text-gray-700">{product.estado}</p>
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900">Talla:</span>
              <p className="text-gray-700">{product.talle}</p>
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900">Color:</span>
              <p className="text-gray-700">{product.color}</p>
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900">Categoría:</span>
              <p className="text-gray-700">{product.categoria}</p>
            </div>
          </div>

          <Separator />

        </CardContent>
      </Card>
    </div>
  )
}
