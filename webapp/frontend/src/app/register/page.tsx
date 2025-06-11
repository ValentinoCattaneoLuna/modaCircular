'use client'

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { useEffect } from "react"


export default function RegisterPage() {

    const router = useRouter()
    const [apiError, setApiError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    //datos que obtenemos del formulario
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    })

    //datos purgados para enviar en el body de la peticion a la api
    const { confirmPassword, acceptTerms, ...dataToSend } = formData

    //validar contraseñas iguales en tiempo real
    useEffect(() => {
        if (
            formData.confirmPassword &&
            formData.password !== formData.confirmPassword
        ) {
            setPasswordError("Las contraseñas no coinciden")
        } else {
            setPasswordError(null)
        }
    }, [formData.password, formData.confirmPassword])


    const handleSubmit = async (e: React.FormEvent) => {
        setApiError(null); // Limpiamos el error anterior
        e.preventDefault()
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${API_URL}/api/auth/register`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                }
            )
            const data = await response.json()

            if (!response.ok) {
                setApiError(data.error || 'Error al registrar usuario');
            } else {
                console.log('Registro exitoso')
                router.push('/login')

            }
        }
        catch (err: any) {
            alert(err.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
            <Card className="w-full max-w-md shadow-xl bg-white border-0">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto">
                        <Image src="/logo.webp" alt="Moda Circular Logo" width={64} height={64} className="w-16 h-16 mx-auto" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-primary-custom">Únete a Moda Circular</CardTitle>
                    <CardDescription className="text-gray-600">
                        Crea tu cuenta y comienza a formar parte del cambio
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre *</Label>
                                <Input
                                    id="nombre"
                                    placeholder="Tu nombre"
                                    className="w-full border-gray-300 focus:border-0 focus:ring-[#22c55e]"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="apellido">Apellido *</Label>
                                <Input
                                    id="apellido"
                                    placeholder="Tu apellido"
                                    className="w-full border-gray-300 focus:border-0 focus:ring-[#22c55e]"
                                    value={formData.apellido}
                                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Nombre de usuario *</Label>
                            <Input
                                id="username"
                                placeholder="usuario"
                                className="w-full border-gray-300 focus:border-0 focus:ring-[#22c55e]"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico *</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                className="w-full border-gray-300 focus:border-0 focus:ring-[#22c55e]"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña *</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pr-10 border-gray-300 focus:border-0 focus:ring-[#22c55e]"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full pr-10 border-gray-300 focus:border-0 focus:ring-[#22c55e]"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                            {passwordError && (
                                <p className="text-sm text-red-500">{passwordError}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="terms"
                                checked={formData.acceptTerms}
                                onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                                className="border-primary-custom data-[state=checked]:bg-primary-custom cursor-pointer"
                            />
                            <Label htmlFor="terms" className="text-sm">
                                Acepto los{" "}
                                <Link href="/terms" className="text-primary-custom hover:underline">
                                    términos y condiciones
                                </Link>{" "}
                                y la{" "}
                                <Link href="/privacy" className="text-primary-custom hover:underline">
                                    política de privacidad
                                </Link>
                            </Label>
                        </div>

                        <Button
                            className="w-full bg-primary-custom hover:bg-primary-custom/90 text-white enabled:cursor-pointer"
                            type="submit"
                            disabled={!formData.acceptTerms || !!(formData.confirmPassword && formData.password !== formData.confirmPassword)}

                        >
                            Crear Cuenta
                        </Button>
                        {apiError && (
                            <p className="text-sm text-red-500">{apiError}</p>
                        )}
                    </form>
                    <div className="text-center">
                        <span className="text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{" "}
                            <Link href="/login" className="text-primary-custom hover:underline font-medium">
                                Inicia Sesión
                            </Link>
                        </span>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}