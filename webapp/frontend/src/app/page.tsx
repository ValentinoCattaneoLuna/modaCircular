'use client'

import {LoaderValidation} from '@/components/loader-validation';


export default function Home() {
  
  
  return <LoaderValidation validacion={true} rutaAuth='/feed' rutaSinAuth='/login'/>
  
  
}