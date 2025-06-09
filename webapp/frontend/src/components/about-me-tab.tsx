"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Edit, Save, X, MapPin, Mail, Phone, Calendar, Star } from "lucide-react"

interface User {
  id_usuario: number ,
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

interface AboutMeTabProps {
  user: User
  isOwnProfile: boolean
}

export function AboutMeTab({ user, isOwnProfile }: AboutMeTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    bio: user.bio,
    ubicacion: user.ubicacion,
    mail: user.mail,
    telefono: user.telefono,
  })

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    console.log("Guardando cambios:", editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      bio: user.bio,
      ubicacion: user.ubicacion,
      mail: user.mail,
      telefono: user.telefono,
    })
    setIsEditing(false)
  }

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Información personal */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{isOwnProfile ? "Mi información" : "Información personal"}</CardTitle>
          {isOwnProfile && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave} className="bg-primary-custom hover:bg-primary-custom/90">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bio */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Biografía</Label>
            {isEditing ? (
              <Textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Cuéntanos sobre ti..."
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">{user.bio}</p>
            )}
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Ubicación
            </Label>
            {isEditing ? (
              <Input
                value={editData.ubicacion}
                onChange={(e) => setEditData({ ...editData, ubicacion: e.target.value })}
                placeholder="Ciudad, País"
              />
            ) : (
              <p className="text-gray-600">{user.ubicacion}</p>
            )}
          </div>

          {/* Email (solo perfil propio) */}
          {isOwnProfile && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Correo electrónico
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editData.mail}
                  onChange={(e) => setEditData({ ...editData, mail: e.target.value })}
                  placeholder="tu@email.com"
                />
              ) : (
                <p className="text-gray-600">{user.mail}</p>
              )}
            </div>
          )}

          {/* Teléfono (solo perfil propio) */}
          {isOwnProfile && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono
              </Label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={editData.telefono}
                  onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
                  placeholder="+34 600 000 000"
                />
              ) : (
                <p className="text-gray-600">{user.telefono}</p>
              )}
            </div>
          )}

          {/* Fecha de registro */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Miembro desde
            </Label>
            <p className="text-gray-600">{formatJoinDate(user.joinDate)}</p>
          </div>
        </CardContent>
      </Card>


    </div>
  )
}
