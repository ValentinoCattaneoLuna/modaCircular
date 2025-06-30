"use client"
import { Header } from "@/components/header"
import { EditProductForm } from "@/components/edit-product-form"
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

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

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const [producto, setProducto] = useState<ProductoBackend>()
  const [usuario, setUsuario] = useState<UsuarioBackend>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login')
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded.id;

      const fetchUserData = async (userId: number) => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL
          const res = await fetch(`${API_URL}/api/usuarios/${userId}`)
          if (!res.ok) throw new Error('Error al cargar datos del usuario')
          const userData: UsuarioBackend = await res.json()
          setUsuario(userData)
        } catch (err) {
          console.error(err)
          setError(true)
        }
      }

      const fetchData = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publicaciones/${params.id}`)
          if (!res.ok) throw new Error('Error al cargar la publicación')
          const data: ProductoBackend = await res.json()

          // Validar que el usuario autenticado sea el dueño
          if (userId != data.id_usuario) {
            router.push('/profile');
            return;
          }

          setProducto(data)
          fetchUserData(data.id_usuario)
        } catch (err) {
          console.error(err)
          setError(true)
        } finally {
          setLoading(false)
        }
      }

      fetchData();
    } catch (err) {
      console.error("Error al decodificar el token:", err);
      router.push('/login');
    }
  }, [params.id, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
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

        {loading ? (
          <p className="text-gray-500">Cargando producto...</p>
        ) : error ? (
          <p className="text-red-500">Error al cargar los datos. Intenta nuevamente.</p>
        ) : producto ? (
          <EditProductForm product={producto} />
        ) : null}
      </main>
    </div>
  )
}
