"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Edit, Save, X, MapPin, Phone, Calendar } from "lucide-react"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation"
import { jwtDecode } from 'jwt-decode';
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api'


interface User {
  id_usuario: number,
  nombre: string,
  apellido: string,
  mail: string,
  username: string,
  nacimiento: string,
  telefono: string | null,
  ubicacion: string | null,
  avatar: string,
  bio: string,
  joinDate: string
}

interface AboutMeTabProps {
  user: User
  isOwnProfile: boolean
}

export function AboutMeTab({ user, isOwnProfile }: AboutMeTabProps) {
  const inputRef = useRef<google.maps.places.SearchBox | null>(null)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    bio: user.bio,
    ubicacion: user.ubicacion,
    nacimiento: user.nacimiento,
    telefono: user.telefono,
  })

  const [errors, setErrors] = useState({
    bio: '',
    ubicacion: '',
    nacimiento: '',
    telefono: '',
  })

const handleSave = async () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = Cookies.get('token');

  if (!token) {
    console.error("No hay token de autenticación");
    return;
  }

  const decoded: any = jwtDecode(token);
  const userId = decoded.id;

  // Limpiar los datos antes de enviar
  const cleanData = {
    bio: editData.bio?.trim() || null,
    ubicacion: editData.ubicacion?.trim() || null,
    nacimiento: editData.nacimiento || null,
    telefono: editData.telefono?.trim() || null,
  };

  try {
    const response = await fetch(`${API_URL}/api/usuarios/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cleanData),
    });

    if (!response.ok) throw new Error("Error al guardar los cambios");

    console.log("Cambios guardados correctamente");
    setIsEditing(false);
  } catch (error) {
    console.error("Error al guardar:", error);
  }
};

  const handleCancel = () => {
    setEditData({
      bio: user.bio,
      ubicacion: user.ubicacion,
      nacimiento: user.nacimiento,
      telefono: user.telefono,
    })
    setErrors({
      bio: '',
      ubicacion: '',
      nacimiento: '',
      telefono: '',
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

  const handleOnPlacesChanged = () => {
    const places = inputRef.current?.getPlaces()

  }


  return (
    <div className="space-y-6">
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{isOwnProfile ? "Mi información" : "Información personal"}</CardTitle>
          {isOwnProfile && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave} className="bg-primary-custom cursor-pointer">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel} className="border-gray-300 cursor-pointer hover:bg-red-500 hover:text-white">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="border-gray-300 cursor-pointer hover:bg-gray-300 ">
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
            <Label className="text-sm font-bold text-gray-900">Biografía</Label>
            {isEditing ? (
              <>
                <Textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  placeholder="Cuéntanos sobre ti..."
                  className="min-h-[100px]"
                />
                {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
              </>
            ) : (
              <p className="text-gray-600 leading-relaxed">{user.bio}</p>
            )}
          </div>

          {/* Fecha de nacimiento */}
          {isOwnProfile && (
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha de nacimiento
              </Label>
              {isEditing ? (
                <>
                  <Input
                    type="date"
                    value={editData.nacimiento}
                    onChange={(e) => setEditData({ ...editData, nacimiento: e.target.value })}
                    placeholder="yyyy-mm-dd"
                  />
                  {errors.nacimiento && <p className="text-sm text-red-500">{errors.nacimiento}</p>}
                </>
              ) : (
                <p className="text-gray-600">{formatJoinDate(user.nacimiento)}</p>
              )}
            </div>
          )}

          {/* Ubicación */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Ubicación
            </Label>
            {isEditing ? (
              <>
                {isLoaded &&
                  <StandaloneSearchBox
                    onLoad={(ref) => {
                      inputRef.current = ref
                    }}
                    onPlacesChanged={handleOnPlacesChanged}
                  >
                    <Input
                      value={editData.ubicacion || ""}
                      onChange={(e) => setEditData({ ...editData, ubicacion: e.target.value })}
                      placeholder="Ciudad, País"
                    />
                  </StandaloneSearchBox>}
                {errors.ubicacion && <p className="text-sm text-red-500">{errors.ubicacion}</p>}
              </>
            ) : (
              <p className="text-gray-600">{user.ubicacion}</p>
            )}
          </div>

          {/* Teléfono */}

          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Teléfono
            </Label>
            {isEditing ? (
              <>
                <Input
                  type="tel"
                  value={editData.telefono || ""}
                  onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
                  placeholder="+54 9 11 1234 5678"
                />
                {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
              </>
            ) : (
              <p className="text-gray-600">{user.telefono}</p>
            )}
          </div>


          {/* Fecha de registro */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-900 flex items-center gap-2">
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
