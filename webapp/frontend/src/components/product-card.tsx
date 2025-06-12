"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, MapPin, Gift, ArrowRightLeft } from "lucide-react"

interface Product {
  id: number
  title: string
  price: number
  image: string
  user: {
    name: string
    avatar: string
    username: string
    telefono: string
  }
  condition: string
  size: string
  brand: string
  type: "Venta" | "Donación" | "Intercambio"
  category: string
  color: string
  location: string
}

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  const handleContact = () => {
    if (!product.user.telefono) {
      toast.error('El usuario no tiene un numero de telefono vinculado',{
        duration:2000,
        style:{background:'#e7000b', color:"#fff"}
      })

    } else {
      const message = `¡Hola ${product.user.name} ! Te escribo desde Moda Circular por tu publicación de: ${product.title}..`
      const whatsappUrl = `https://wa.me/${product.user.telefono.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    }
  }




  const getTypeIcon = () => {
    switch (product.type) {
      case "Donación":
        return <Gift className="w-3 h-3" />
      case "Intercambio":
        return <ArrowRightLeft className="w-3 h-3" />
      default:
        return null
    }
  }

  const getTypeColor = () => {
    switch (product.type) {
      case "Donación":
        return "bg-blue-100 text-blue-800"
      case "Intercambio":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const getTypeText = () => {
    switch (product.type) {
      case "Donación":
        return "Gratis"
      case "Intercambio":
        return "Intercambio"
      default:
        return `$${product.price}`
    }
  }

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="flex gap-4 p-4">
            {/* Image */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <Link href={`/product/${product.id}`}>
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-2 right-2 rounded-full ${isLiked ? "text-red-500" : "text-white"
                  } hover:bg-white/20`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-primary-custom transition-colors cursor-pointer">
                    {product.title}
                  </h3>
                </Link>
                <span className="text-lg font-bold text-primary-custom ml-4">{getTypeText()}</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={`flex items-center gap-1 ${getTypeColor()}`}>
                  {getTypeIcon()}
                  <span className="text-xs">
                    {product.type === "Donación" ? "Gratis" : product.type === "Intercambio" ? "Intercambio" : "Venta"}
                  </span>
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {product.condition}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>{product.brand}</span>
                  <span>Talla {product.size}</span>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{product.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href={`/user/username/${product.user.username}`}>
                  <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 ">
                    <Avatar className="w-6 h-6 ">
                      <AvatarImage src={product.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{product.user.username[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">@{product.user.username}</span>
                  </div>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary-custom border-primary-custom hover:bg-primary-custom hover:text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Contactar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Return existing grid view
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-0">
      <CardContent className="p-0">

        <div className="relative">
          <Link href={`/product/${product.id}`}>
            <img
              src={product.image?.split(",")[0] || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-64 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Tipo de publicación */}
          <Badge className={`absolute top-3 left-3 flex items-center gap-1 ${getTypeColor()}`}>
            {getTypeIcon()}
            <span className="text-xs font-medium">
              {product.type === "Donación" ? "Gratis" : product.type === "Intercambio" ? "Intercambio" : "Venta"}
            </span>
          </Badge>

          {/* Botón de favorito */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 rounded-full bg-white/80 backdrop-blur-sm ${isLiked ? "text-red-500" : "text-gray-600"
              } hover:bg-white hover:scale-110 transition-all`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="p-4 space-y-3 bg-white ">
          {/* Usuario y precio */}

          <div className="flex items-center justify-between">
            <Link href={`/user/username/${product.user.username}`}>
              <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={product.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{product.user.username[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 font-medium">@{product.user.username}</span>
              </div>
            </Link>
            <span className="text-lg font-bold text-primary-custom">{getTypeText()}</span>
          </div>

          {/* Título */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-primary-custom transition-colors cursor-pointer line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {/* Detalles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Talla {product.size}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Badge variant="outline" className="text-xs">
                {product.condition}
              </Badge>
              <div className="flex items-center text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="text-xs">{product.location}</span>
              </div>
            </div>
          </div>
          {/* Botón de contacto */}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-primary-custom border-primary-custom hover:bg-primary-custom hover:text-white transition-colors cursor-pointer"
            onClick={handleContact}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contactar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
