"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Heart, Flag } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {useFavorito} from "@/hooks/useToggleFavorito "

interface ProductActionsProps {
  product: {
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
}

export function ProductActions({ product }: ProductActionsProps) {
  const { isFavorito, toggleFavorito, loading } = useFavorito(product.id_publicacion);
  const [message, setMessage] = useState("")
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)

  // const handleContact = () => {
  //   const defaultMessage = `¡Hola ${product.user.name}! Me interesa tu producto "${product.title}". ¿Podríamos hablar sobre él?`
  //   const finalMessage = message || defaultMessage
  //   const whatsappUrl = `https://wa.me/${product.user.phone?.replace(/\s/g, "")}?text=${encodeURIComponent(finalMessage)}`
  //   window.open(whatsappUrl, "_blank")
  //   setIsMessageModalOpen(false)
  //   setMessage("")
  // }


  return (
    <Card className="border-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
      <CardContent className="p-6 space-y-4">
        {/* Botón principal según el tipo */}
        <Button
          // onClick={handleContact}
          className="w-full bg-primary-custom hover:bg-primary-custom/90 text-white text-lg py-3 cursor-pointer"
          size="lg"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Contactar
        </Button>

        {/* Botones secundarios */}
        <div className="grid grid-cols-2 gap-3 ">
          <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full cursor-pointer ">
                <MessageCircle className="w-4 h-4 mr-2" />
                Enviar mensaje
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Enviar mensaje a {product.nombre_usuario}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 ">
                <div>
                  <Label htmlFor="message">Tu mensaje</Label>
                  <Textarea
                    id="message"
                    //placeholder={`¡Hola ${product.user.name}! Me interesa tu producto "${product.title}". ¿Podríamos hablar sobre él?`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] mt-2 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsMessageModalOpen(false)}
                    className="bg-red-600 text-white cursor-pointer transition-all hover:scale-110 focus:scale-90">
                    Cancelar
                  </Button>
                  <Button 
                  //onClick={handleContact} 
                  className="bg-primary-custom hover:bg-primary-custom/90 text-white cursor-pointer transition-all hover:scale-110 focus:scale-90">
                    Enviar por WhatsApp
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
                onClick={toggleFavorito} disabled={loading}
            className={` cursor-pointer w-full ${isFavorito ? "text-red-500 border-red-500" : ""}`}
          >
            <Heart className={`w-4 h-4 mr-2 ${isFavorito ? "fill-current" : ""}`} />
            {isFavorito ? "Guardado" : "Guardar"}
          </Button>
        </div>


      </CardContent>
    </Card>
  )
}
