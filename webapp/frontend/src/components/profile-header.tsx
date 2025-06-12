"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Star, Calendar, MapPin, Edit, Share2 } from "lucide-react"
import {toast} from 'sonner'
interface User {


  id_usuario: number,
  nombre: string,
  apellido: string,
  mail: string,
  username: string,
  telefono: string | null,
  ubicacion: string | null,
  avatar: string
  bio: string
  joinDate: string

}

interface ProfileHeaderProps {
  user: User
  isOwnProfile: boolean
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long" })
  }

  const handleContact = () => {
    if (!user.telefono) {
      toast.error('El usuario no tiene un numero de telefono vinculado', {
        duration: 2000,
        style: { background: '#e7000b', color: "#fff" }
      })
      return
    }
    // Aquí iría la lógica para abrir WhatsApp o chat
    const message = `¡Hola ${user.nombre}! Te escribo desde Moda Circular.`
    const whatsappUrl = `https://wa.me/${user.telefono.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Card className="mb-6 border-0 bg-white shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar y info básica */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 ">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.nombre} />
              <AvatarFallback className="text-2xl font-bold bg-primary-custom text-white">
                {user.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>


          </div>

          {/* Información del perfil */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.nombre} {user.apellido}</h1>
                <p className="text-lg text-gray-600">@{user.username}</p>

                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.ubicacion}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Desde {formatJoinDate(user.joinDate)}</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <>

                    <Button variant="outline" size="sm" className="border-2 border-gray-200 bg-white hover:bg-gray-300 cursor-pointer font-bold text-gray-900"
                    //onClick={} //implementar funcion para guardar en el portapapeles la window.location.href
                    >
                      <Share2 className="w-4 h-4 mr-2 text-black" />
                      Compartir
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleContact}
                      className="bg-primary-custom hover:bg-primary-custom/90 text-white cursor-pointer transition-all hover:scale-105 focus:scale-95"
                      size="sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contactar
                    </Button>

                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-700 leading-relaxed">{user.bio}</p>


          </div>
        </div>
      </CardContent>
    </Card>
  )
}
