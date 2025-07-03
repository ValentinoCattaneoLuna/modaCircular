'use client'

import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";

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
  apellido_usuario: string
}

interface UsuarioBackend {
  id_usuario: number
  username: string
  avatar: string | null
  telefono: string
  ubicacion: string
}

export default function SavedPage() {
  const router = useRouter();
  const token = Cookies.get('token');
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [savedProducts, setSavedProducts] = useState<ProductoBackend[]>([]);
  const [users, setUsers] = useState<{ [key: number]: UsuarioBackend }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserData = async (userId: number) => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API_URL}/api/usuarios/${userId}`);
        if (!res.ok) throw new Error('Error al cargar datos del usuario');
        const userData: UsuarioBackend = await res.json();
        setUsers((prev) => ({ ...prev, [userId]: userData }));
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    const fetchFavoritos = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API_URL}/api/guardar/guardadas`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data: ProductoBackend[] = res.ok ? await res.json() : [];
        setSavedProducts(data);
        data.forEach((product) => {
          if (!users[product.id_usuario]) {
            fetchUserData(product.id_usuario);
          }
        });
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFavoritos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Publicaciones Guardadas</h1>
          <p className="text-gray-600">Productos que has guardado para ver más tarde</p>
        </div>

        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : savedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedProducts.map((product) => {
              const user = users[product.id_usuario] || {}; // fallback seguro

              return (
                <ProductCard
                  key={product.id_publicacion}
                  product={{
                    id: product.id_publicacion,
                    title: product.titulo,
                    price: product.precio ?? 0,
                    image: product.imagenes,
                    user: {
                      name: `${product.nombre_usuario} ${product.apellido_usuario}`,
                      avatar: user.avatar || "",
                      username: user.username || "",
                      telefono: user.telefono || ""
                    },
                    condition: product.estado,
                    size: product.talle,
                    brand: "",
                    type: product.tipo_publicacion as 'Venta' | 'Donación' | 'Intercambio',
                    category: product.categoria,
                    color: product.color,
                    location: user.ubicacion || "",
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes productos guardados</h3>
            <p className="text-gray-600 mb-6">Explora el feed y guarda los productos que te interesen</p>
            <Link href={'/feed'}>
              <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white cursor-pointer">
                Explorar Productos
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
