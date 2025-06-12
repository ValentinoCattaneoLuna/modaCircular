'use client'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { RiseLoader } from "react-spinners";


type LoaderValidationProps = {
    validacion?: boolean;
    rutaAuth?: string;
    rutaSinAuth?: string;
}

export  function LoaderValidation(
    {
        validacion = false,
        rutaAuth = '',
        rutaSinAuth = ''
    } : LoaderValidationProps) 
    
    {
    const router = useRouter()

    useEffect(() => {
        const token = Cookies.get('token')
        const timer = setTimeout(() => {
            if (validacion) {
                if (token) {
                    router.push(rutaAuth)
                } else {
                    router.push(rutaSinAuth)
                }
            }
        }, 2000)
        return () => clearTimeout(timer);
    }, [router])

    return (

        <div className='flex items-center justify-center flex-col gap-4 w-dvw h-dvh bg-gradient-to-b from-green-50 to-green-100'>

            <div className="sweet-loading">
                <RiseLoader color='#22c55e' />

            </div>

        </div>
    )





}