import { Header } from "@/components/header"
import { EditProductForm } from "@/components/edit-product-form"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface EditProductPageProps {
  params: {
    id: string
  }
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
const mockProduct: ProductoBackend = {
  id_publicacion: 1,   
    titulo: "Camiseta de Algodón Orgánico",
    precio: 25.99,
    imagenes: "https://acdn-us.mitiendanube.com/stores/005/656/704/products/025a-gris-copia-5a9b83ad521386e50d17363694476424-1024-1024.jpg,https://acdn-us.mitiendanube.com/stores/003/588/275/products/diseno-sin-titulo-58-166bb07cee4f4d95d417037929367079-1024-1024.jpg",
    estado: "Nuevo",
    talle: "M",
    tipo_publicacion: "Venta",
    categoria: "Ropa",
    descripcion: "Camiseta de algodón orgánico, suave y cómoda.",
    color: "Blanco",    
    id_usuario: 1,
    nombre_usuario: "Juan",
    apellido_usuario: "Pérez",
    fecha_publicacion: "2023-10-01T12:00:00Z",
}
const mockUser: UsuarioBackend = {
  id_usuario: 1,
    username: "juanperez",
    avatar: "https://example.com/avatar.jpg",
    telefono: "123456789",
    nombre: "Juan",
    apellido: "Pérez",
}



export default function EditProductPage({ params }: EditProductPageProps) {
  // En una aplicación real, aquí verificarías que el usuario es el propietario del producto

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/feed">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/profile">Mi perfil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/product/${params.id}`}>Producto</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Editar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar producto</h1>
          <p className="text-gray-600">Modifica la información de tu producto</p>
        </div>

        <EditProductForm product={mockProduct} />
      </main>
    </div>
  )
}