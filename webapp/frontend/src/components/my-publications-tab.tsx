"use client"
import Cookies from "js-cookie"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Eye, MoreHorizontal, Gift, ArrowRightLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { PublishModal } from "./publish-modal"
import Swal from "sweetalert2"
import { jwtDecode } from "jwt-decode"
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

interface ProductoBackend {
  id_publicacion: number
  titulo: string
  precio: number
  imagenes: string
  estado: string
  talle: string
  tipo_publicacion: "Venta" | "Donación" | "Intercambio"
  categoria: string
  color: string
  id_usuario: number
  nombre_usuario: string
  apellido_usuario: string,
  publicatedAt: string
}
interface MyPublicationsTabProps {
  user: User
  isOwnProfile: boolean
}



export function MyPublicationsTab({ user, isOwnProfile }: MyPublicationsTabProps) {
  const [filter, setFilter] = useState("todas")
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [products, setProducts] = useState<ProductoBackend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const token = Cookies.get('token')
  const decoded: any = jwtDecode(token!!);
  const userId = decoded.id;



  useEffect(() => {

    // Función para obtener publicaciones
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publicaciones`)
        if (!res.ok) throw new Error('Error al cargar publicaciones')
        const data: ProductoBackend[] = await res.json()

        setProducts(data.filter(pub => pub.id_usuario === user.id_usuario))

        // Después de obtener las publicaciones, hacemos la solicitud para cada usuario
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])


  const filteredPublications = products.filter((pub) => {
    if (filter === "todas") return true
    if (filter === "Venta") return pub.tipo_publicacion === "Venta"
    if (filter === "Donación") return pub.tipo_publicacion === "Donación"
    if (filter === "Intercambio") return pub.tipo_publicacion === "Intercambio"
    return true
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Donación":
        return <Gift className="w-3 h-3" />
      case "Intercambio":
        return <ArrowRightLeft className="w-3 h-3" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Donación":
        return "bg-blue-100 text-blue-800"
      case "Intercambio":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  async function handleEliminarPublicacion(id_publicacion: number) {

    try {
      // Mostrar la alerta de confirmación
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!"
      });

      // Si el usuario confirma, hacer la solicitud DELETE
      if (result.isConfirmed) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publicaciones/${id_publicacion}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Error al eliminar publicación');

        // Mostrar un mensaje de éxito
        Swal.fire({
          title: "¡Eliminado!",
          text: "Tu publicación ha sido eliminada.",
          icon: "success"
        });
      }

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al intentar eliminar la publicación.",
        icon: "error"
      });
    }


  };
  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] bg-white border-0 shadow-lg cursor-pointer">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent className="bg-white border-0 shadow-lg">
              <SelectItem className="cursor-pointer hover:bg-green-50" value="todas">Todas las publicaciones</SelectItem>
              <SelectItem className="cursor-pointer hover:bg-green-50" value="Venta">Venta</SelectItem>
              <SelectItem className="cursor-pointer hover:bg-green-50" value="Donación">Donación</SelectItem>
              <SelectItem className="cursor-pointer hover:bg-green-50" value="Intercambio">Intercambio</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-800">
            {filteredPublications.length} de {filteredPublications.length} publicaciones
          </span>
        </div>

        {isOwnProfile && (
          <Button onClick={() => setIsPublishModalOpen(true)}
            className="bg-primary-custom hover:bg-primary-custom/90 text-white transition-colors cursor-pointer"
            size="sm">Nueva publicación</Button>
        )}
      </div>

      {/* Grid de publicaciones */}
      {filteredPublications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublications.map((publication) => (
            <Card key={publication.id_publicacion} className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="relative">
                  <Link href={`/product/${publication.id_publicacion}`}>
                    <img
                      src={publication.imagenes.toString().split(",")[0] || "/placeholder.svg"}
                      alt={publication.titulo}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    <Badge className={`flex items-center gap-1 ${getTypeColor(publication.tipo_publicacion)}`}>
                      {getTypeIcon(publication.tipo_publicacion)}
                      <span className="text-xs">
                        {publication.tipo_publicacion === "Donación"
                          ? "Gratis"
                          : publication.tipo_publicacion === "Intercambio"
                            ? "Intercambio"
                            : "Venta"}
                      </span>
                    </Badge>
                    {/* <Badge className={getStatusColor(publication.status)}>
                      {publication.status === "activa"
                        ? "Activa"
                        : publication.status === "vendida"
                          ? "Vendida"
                          : "Pausada"}
                    </Badge> */}
                  </div>

                  {/* Menú de acciones (solo perfil propio) */}
                  {isOwnProfile && (
                    <div className="absolute top-2 right-2 ">
                      <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-sm hover:bg-white cursor-pointer">
                            <MoreHorizontal className="w-4 h-4 " />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem className="cursor-pointer hover:bg-green-50">
                            <Link href={`/product/${publication.id_publicacion}`}>
                              <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4 mr-2" />Ver publicación
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="cursor-pointer hover:bg-green-50">
                            <Link href={`/product/${publication.id_publicacion}/edit`}>
                              <div className="flex items-center gap-2">
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 cursor-pointer hover:bg-green-50"
                            onClick={() => {
                              handleEliminarPublicacion(publication.id_publicacion)
                            }}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  {/* Título y precio */}
                  <div className="flex items-start justify-between">
                    <Link href={`/product/${publication.id_publicacion}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-primary-custom transition-colors cursor-pointer line-clamp-2">
                        {publication.titulo}
                      </h3>
                    </Link>
                    <span className="text-lg font-bold text-primary-custom ml-2">
                      {publication.tipo_publicacion === "Venta"
                        ? `$${publication.precio}`
                        : publication.tipo_publicacion === "Donación"
                          ? "Gratis"
                          : "Intercambio"}
                    </span>
                  </div>

                  {/* Detalles */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Talla {publication.talle}</span>
                    <span>{publication.estado}</span>
                  </div>

                  {/* Fecha */}
                  <div className="text-xs text-gray-400">Publicado el {formatDate(publication.publicatedAt)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Gift className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isOwnProfile ? "No tienes publicaciones" : "No hay publicaciones"}
          </h3>
          <p className="text-gray-600 mb-6">
            {isOwnProfile
              ? "¡Comienza a publicar tus prendas y únete a la moda circular!"
              : "Este usuario aún no ha publicado ninguna prenda."}
          </p>
          {isOwnProfile && (
            <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white cursor-pointer"
              onClick={() => setIsPublishModalOpen(true)}>

              Crear primera publicación
            </Button>
          )}
        </div>
      )}
      <PublishModal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)} />
    </div>

  )
}
