'use client'

import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { RiseLoader } from "react-spinners";


export default function Home() {

  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        router.push('/feed')
      } else {
        router.push('/login')
      }
    }, 2000)
    const token = Cookies.get('token')
    return () => clearTimeout(timer);
  }, [router])

  return (  
    <div className='flex items-center justify-center flex-col gap-4 w-dvw h-dvh bg-gradient-to-b from-green-50 to-green-100'>

 <div className="sweet-loading">
      <RiseLoader color='#22c55e'/>

    </div>

    </div>
)
}