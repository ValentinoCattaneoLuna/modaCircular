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
    imagenes: string // Ej: "url1,url2,url3"
    estado: string
    talle: string
    tipo_publicacion: "VENTA" | "DONACION" | "INTERCAMBIO"
    categoria: string
    color: string
    nombre_usuario: string
    apellido_usuario: string
}
export default function FeedPage() {
    const router = useRouter()
    const [products, setProducts] = useState<ProductoBackend[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            router.push('/login')
            return
        }

        const fetchData = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL
                const res = await fetch(`${API_URL}/api/publicaciones`)
                if (!res.ok) throw new Error('Error al cargar publicaciones')
                const data = await res.json()
                setProducts(data)
            } catch (err) {
                console.error(err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router])

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-6">


                <FilterBar />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 ">
                    {loading && <span>Cargando productos...</span>}
                    {error && <span>Error al cargar productos</span>}
                    {!loading && !error && products.length === 0 && <span>Productos no encontrados</span>}
                    {!loading && !error && products.map((product) => (
                        <ProductCard
                            key={product.id_publicacion}
                            product={{
                                id: product.id_publicacion,
                                title: product.titulo,
                                price: product.precio ?? 0,
                                image: product.imagenes.split(',')[0], // Usar primera imagen
                                user: {
                                    name: `${product.nombre_usuario} ${product.apellido_usuario}`,
                                    avatar: '', // opcional
                                    username: product.nombre_usuario.toLowerCase(),
                                },
                                condition: product.estado,
                                size: product.talle,
                                brand: '', // puedes completar esto si tienes marca
                                type: product.tipo_publicacion.toLowerCase() as 'venta' | 'donacion' | 'intercambio',
                                category: product.categoria,
                                color: product.color,
                                location: 'Argentina',
                            }}
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}
