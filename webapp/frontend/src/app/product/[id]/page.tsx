'use client'
import { Header } from "@/components/header"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductActions } from "@/components/product-actions"
import { SellerInfo } from "@/components/seller-info"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { LoaderValidation } from '@/components/loader-validation';
import { Toaster } from 'sonner';
import { useState, useEffect } from "react"
import { useRouter,useParams } from 'next/navigation'
import Cookies from 'js-cookie'
// interface ProductPageProps {
//   params: {
//     id: string
//   }
// }
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
    ubicacion: string 
    joinDate: string
}



export default function ProductPage(/*{ params }: ProductPageProps*/) {
    const { id } = useParams() as { id: string }
    const router = useRouter()
    const [producto, setProducto] = useState<ProductoBackend>()
    const [usuario, setUsuario] = useState<UsuarioBackend>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [imagenes, setImagenes] = useState<string[]>([])

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            router.push('/login')
            return
        }

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
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publicaciones/${id}`)
                if (!res.ok) throw new Error('Error al cargar la publicación')
                const data: ProductoBackend = await res.json()
                setProducto(data)

                // Ahora sí pedimos más datos del usuario (si los necesitas)
                fetchUserData(data.id_usuario)
            } catch (err) {
                console.error(err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router, id])

    // Set imagenes una vez que producto se haya cargado
    useEffect(() => {
       if (producto) {
        setImagenes(producto.imagenes.toString().split(',').map(img => img.trim()) || [])
    }
    }, [producto])

    if (loading) {
        return (
            <LoaderValidation validacion={true} rutaAuth='/feed' rutaSinAuth='/login' />
        )
    }

    if (error) {
        return <div>Error al cargar los datos.</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Toaster position="top-right"/>

            <main className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/feed">Inicio</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{producto?.titulo}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
                    {/* Galería de imágenes */}
                    <div className="lg:col-span-2 ">
                        {producto ? <ProductGallery product={producto} images={imagenes} title={producto.titulo} /> : <div>Cargando galería...</div>}
                    </div>

                    {/* Información del producto y acciones */}
                    <div className="space-y-6 ">
                        {producto ? (
                            <>
                                <ProductInfo product={producto}  />
                                <ProductActions user={usuario!!} product={producto} />
                                <SellerInfo
                                    seller={usuario ? {
                                        id_usuario: usuario.id_usuario,
                                        username: usuario.username,
                                        avatar: usuario.avatar,
                                        telefono: usuario.telefono,
                                        nombre: producto?.nombre_usuario || '',
                                        apellido: producto?.apellido_usuario || '',
                                        ubicacion: usuario.ubicacion || '',
                                        joinDate: usuario.joinDate || ''
                                    } : {
                                        id_usuario: 0,
                                        username: '',
                                        avatar: null,
                                        telefono: '',
                                        nombre: '',
                                        apellido: '',
                                        ubicacion: '',
                                        joinDate: ''
                                    }}
                                />

                            </>
                        ) : (
                            <div>Cargando información del producto...</div>
                        )}
                    </div>
                </div>

                {/* Productos relacionados */}
                {/* <div className="mt-12">
                    <RelatedProducts currentProductId={mockProduct.id} category={mockProduct.details.category} />
                </div> */}
            </main>
        </div>
    )
}
