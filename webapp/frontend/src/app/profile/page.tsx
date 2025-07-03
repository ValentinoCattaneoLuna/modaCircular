'use client'

import { Header } from "@/components/header"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileTabs } from "@/components/profile-tabs"
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

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

export default function ProfilePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<{ [key: string]: IUsuario }>({})
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const token = Cookies.get('token')

    if (!token) {
      router.push('/login')
      return
    }

    try {
      const decoded: any = jwtDecode(token)
      const id = decoded.id
      setUserId(id)

      const fetchUserData = async (userId: string) => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL
          const res = await fetch(`${API_URL}/api/usuarios/${userId}`)
          if (!res.ok) throw new Error('Error al cargar datos del usuario')
          const userData: IUsuario = await res.json()

          setCurrentUser((prevUsers) => ({ ...prevUsers, [userId]: userData }))
        } catch (err) {
          console.error(err)
          setError(true)
        } finally {
          setLoading(false)
        }
      }

      if (id) fetchUserData(id)
    } catch (err) {
      console.error("Token inválido", err)
      setError(true)
      setLoading(false)
    }
  }, [router])

  const user = userId ? currentUser[userId] : null

  if (loading) return <div>Cargando...</div>
  if (error || !user) return <div>Error al cargar el perfil.</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <ProfileHeader user={user} isOwnProfile={true} />
        <ProfileTabs user={user} isOwnProfile={true} />
      </main>
    </div>
  )
}
