'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { FilterBar } from "@/components/filter-bar"

interface ProductoBackend {
    id_publicacion: number
    titulo: string
    precio: number
    imagenes:string
    estado: string
    talle: string
    tipo_publicacion: "Venta" | "Donación" | "Intercambio"
    categoria: string
    color: string
    id_usuario: number
    nombre_usuario: string
    apellido_usuario: string
}

interface UsuarioBackend {
    id_usuario: number
    username: string
    avatar: string | null
    telefono: string
}

export default function FeedPage() {
    const router = useRouter()
    const [products, setProducts] = useState<ProductoBackend[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [users, setUsers] = useState<{ [key: number]: UsuarioBackend }>({}) // Mapa de usuarios por ID

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            router.push('/login')
            return
        }

        // Función para obtener datos de usuario
        const fetchUserData = async (userId: number) => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL
                const res = await fetch(`${API_URL}/api/usuarios/${userId}`)
                if (!res.ok) throw new Error('Error al cargar datos del usuario')
                const userData: UsuarioBackend = await res.json()
                setUsers((prevUsers) => ({ ...prevUsers, [userId]: userData })) // Almacena la información del usuario en el estado
            } catch (err) {
                console.error(err)
                setError(true)
            }
        }

        // Función para obtener publicaciones
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publicaciones`)
                if (!res.ok) throw new Error('Error al cargar publicaciones')
                const data = await res.json()
                
                setProducts(data)
                
                // Después de obtener las publicaciones, hacemos la solicitud para cada usuario
                data.forEach((product: ProductoBackend) => {
                    if (!users[product.id_usuario]) {
                        fetchUserData(product.id_usuario)
                    }
                })

            } catch (err) {
                console.error(err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router, users])

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-6">
                <FilterBar />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 ">
                    {loading && <span>Cargando productos...</span>}
                    {error && <span>Error al cargar productos</span>}
                    {!loading && !error && products.length === 0 && <span>Productos no encontrados</span>}
                    {!loading && !error && products.map((product) => {
                        const user = users[product.id_usuario] || {} // Obtener datos del usuario (si están disponibles)
                        return (
                            <ProductCard
                                key={product.id_publicacion}
                                product={{
                                    id: product.id_publicacion,
                                    title: product.titulo,
                                    price: product.precio ?? 0,
                                    image: product.imagenes, // Usar la primera imagen
                                    user: {
                                        name: `${product.nombre_usuario} ${product.apellido_usuario}`,
                                        avatar: user.avatar || '', // Usar avatar si está disponible
                                        username: user.username || '', // Usar username del usuario
                                        telefono:  user.telefono || ""   // Usar telefono si está disponible
                                    },
                                    condition: product.estado,
                                    size: product.talle,
                                    brand: '', // Si tienes información sobre la marca, puedes agregarla aquí
                                    type: product.tipo_publicacion as 'Venta' | 'Donación' | 'Intercambio',
                                    category: product.categoria,
                                    color: product.color,
                                    location: 'Argentina',
                                }}
                            />
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
