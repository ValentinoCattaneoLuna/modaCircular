'use client'

import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'



export default function feedPage() {
    const router = useRouter()

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            router.push('/login')
        }
    }, [router])

    return (
        <h1 className="text-cyan-700">feed</h1>)
}