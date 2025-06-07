'use client'

import type React from "react"
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      else {
        Cookies.set('token', data.token, {
          expires: 7,
          secure: true,
          sameSite: 'Lax',
        });
        router.push('/feed');
      }

    } catch (err: any) {
      alert(err.message);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4 ">
      <Card className="w-full max-w-md shadow-xl bg-white border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <Image src="/logo.webp" alt="Moda Circular Logo" width={64} height={64} className="w-16 h-16 mx-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary-custom">Bienvenido de vuelta</CardTitle>
          <CardDescription className="text-gray-800">Inicia sesión en tu cuenta de Moda Circular</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="w-full  border-gray-300 focus:border-0 focus:ring-[#22c55e]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pr-10  border-gray-300 focus:border-0 focus:ring-[#22c55e]"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-primary-custom hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button className="w-full bg-primary-custom hover:bg-primary-custom/90 cursor-pointer text-white" type="submit">
              Iniciar Sesión
            </Button>

          </form>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-primary-custom hover:underline font-medium">
                Regístrate
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
