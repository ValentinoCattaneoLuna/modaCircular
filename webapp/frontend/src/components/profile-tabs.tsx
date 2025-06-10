"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AboutMeTab } from "@/components/about-me-tab"
import { MyPublicationsTab } from "@/components/my-publications-tab"
import { Grid3X3, User } from "lucide-react"

interface ProfileUser {
  id_usuario: number,
  nombre: string,
  apellido: string,
  mail: string,
  username: string,
  nacimiento: string,
  telefono: string | null,
  ubicacion: string | null,
  avatar: string
  bio: string
  joinDate: string
}

interface ProfileTabsProps {
  user: ProfileUser
  isOwnProfile: boolean
}

export function ProfileTabs({ user, isOwnProfile }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="publications" className="w-full ">
      <TabsList className="grid gap-8 w-full grid-cols-2 mb-6 ;">
        <TabsTrigger value="publications" className="flex items-center gap-2 bg-white shadow-lg cursor-pointer hover:scale-105 focus:scale-95" >
          <Grid3X3 className="w-4 h-4" />
          {isOwnProfile ? "Mis publicaciones" : "Publicaciones"}
        </TabsTrigger>
        <TabsTrigger value="about" className="flex items-center gap-2 bg-white shadow-lg cursor-pointer hover:scale-105 focus:scale-95">
          <User className="w-4 h-4" />
          {isOwnProfile ? "Sobre mí" : "Acerca de"}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="publications" >
        <MyPublicationsTab user={user} isOwnProfile={isOwnProfile} />
      </TabsContent>

      <TabsContent value="about">
        <AboutMeTab user={user} isOwnProfile={isOwnProfile} />
      </TabsContent>
    </Tabs>
  )
}
