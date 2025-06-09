"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Upload, Heart, User, Home, MessageCircle, Bell } from "lucide-react"
import { PublishModal } from "./publish-modal"

export function Header() {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)

  return (
    <>
      <header className="flex justify-center sticky top-0 z-50 shadow-lg bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/feed" className="flex items-center space-x-3">
            <Image src="/logo.webp" alt="Moda Circular Logo" width={40} height={40} className="w-10 h-10" />
            <span className="font-bold text-xl text-primary-custom">Moda Circular</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/feed"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-custom transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Inicio</span>
            </Link>
            <Link
              href="/saved"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-custom transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>Guardados</span>
            </Link>
            <Link
              href="/chats"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-custom transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chats</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/search">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary-custom">
                <Search className="w-5 h-5" />
              </Button>
            </Link>

            
            {/* <Link href="/notifications">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary-custom relative">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </Link> */}

            <Button
              onClick={() => setIsPublishModalOpen(true)}
              className="bg-primary-custom hover:bg-primary-custom/90 text-white transition-colors"
              size="sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Publicar
            </Button>

            <Link href="/profile">
              <Avatar className="w-9 h-9 cursor-pointer border-2 border-transparent hover:border-primary-custom transition-colors">
                <AvatarImage src="/placeholder.svg?height=36&width=36" />
                <AvatarFallback className="bg-primary-custom text-white">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t bg-white">
          <div className="flex items-center justify-around py-2">
            <Link href="/feed" className="flex flex-col items-center space-y-1 p-2">
              <Home className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-600">Inicio</span>
            </Link>
            <Link href="/saved" className="flex flex-col items-center space-y-1 p-2">
              <Heart className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-600">Guardados</span>
            </Link>
            <Button
              onClick={() => setIsPublishModalOpen(true)}
              className="flex flex-col items-center space-y-1 p-2 bg-primary-custom text-white rounded-lg"
              variant="ghost"
            >
              <Upload className="w-5 h-5" />
              <span className="text-xs">Publicar</span>
            </Button>
            <Link href="/chats" className="flex flex-col items-center space-y-1 p-2">
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-600">Chats</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center space-y-1 p-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-600">Perfil</span>
            </Link>
          </div>
        </div>
      </header>

      <PublishModal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)} />
    </>
  )
}
