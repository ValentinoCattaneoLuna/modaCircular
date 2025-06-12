'use client'

import { Header } from "@/components/header"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileTabs } from "@/components/profile-tabs"
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import {Toaster} from 'sonner'
interface UserProfilePageProps {
  params: {
    username: string
  }
}

interface IUsuario {
  id_usuario: number
  nombre: string
  apellido: string
  mail: string
  username: string
  nacimiento: string
  telefono: string | null
  ubicacion: string | null
  avatar: string
  bio: string
  joinDate: string
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const router = useRouter()
  const [user, setUser] = useState<IUsuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/login')
      return
    }

    const fetchUserData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${API_URL}/api/usuarios/username/${params.username}`)
        if (!res.ok) throw new Error('Error al cargar datos del usuario')
        const userData: IUsuario = await res.json()
        setUser(userData)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [params.username, router])

  if (loading) return <div>Cargando...</div>
  if (error || !user) return <div>Error al cargar el perfil.</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Toaster position="top-right"/>
        <ProfileHeader user={user} isOwnProfile={false} />
        <ProfileTabs user={user} isOwnProfile={false} />
      </main>
    </div>
  )
}
