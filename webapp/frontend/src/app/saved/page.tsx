'use client'

import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SavedPage() {
    const savedProducts = []
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Publicaciones Guardadas</h1>
          <p className="text-gray-600">Productos que has guardado para ver más tarde</p>
        </div>

        {savedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))} */}
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
  )
}