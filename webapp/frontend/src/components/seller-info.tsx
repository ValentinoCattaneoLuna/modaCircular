"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Calendar, Clock, Shield, MessageCircle } from "lucide-react"
import Link from "next/link"

interface SellerInfoProps {
  seller: {
    id_usuario: number
    username: string
    avatar: string | null
    telefono: string
    nombre: string
    apellido: string
  }
}

export function SellerInfo({ seller }: SellerInfoProps) {
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long" })
  }

  return (
    <Card className="border-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
      <CardHeader>
        <CardTitle className="text-lg">Información del vendedor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Perfil del vendedor */}
        <div className="flex items-start gap-4">
          <Link href={`/user/${seller.username}`}>
            <Avatar className="w-16 h-16 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.nombre} />
              <AvatarFallback className="text-lg font-bold bg-primary-custom text-white">
                {seller.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/user/${seller.username}`}>
                <h3 className="font-semibold text-lg hover:text-primary-custom transition-colors cursor-pointer">
                  {seller.nombre}
                </h3>
              </Link>
            </div>

            <Link href={`/user/${seller.username}`}>
              <p className="text-gray-600 hover:text-primary-custom transition-colors cursor-pointer">
                @{seller.username}
              </p>
            </Link>

            {/* Rating */}
            {/* <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{seller.rating}</span>
              <span className="text-sm text-gray-500">({seller.reviews} reseñas)</span>
            </div> */}
          </div>
        </div>

        {/* Información adicional */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{/*seller.ubicacion*/ "Argentina"}</span>
          </div>

          {/* <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Miembro desde {formatJoinDate(seller.joinDate)}</span>
          </div> */}

        </div>

        {/* Botones de acción */}
        <div className="space-y-2 pt-2">
          <Link href={`/user/username/${seller.username}`}>
            <Button variant="outline" className="w-full cursor-pointer">
              Ver perfil completo
            </Button>
          </Link>

          <Button variant="ghost" className="w-full text-primary-custom hover:bg-primary-custom/10">
            <MessageCircle className="w-4 h-4 mr-2" />
            Ver más productos de {seller.nombre}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
