'use client'


import {LoaderValidation} from '@/components/loader-validation';

export default function user() {
  return <LoaderValidation validacion={true} rutaAuth='/feed' rutaSinAuth='/login'/>
  
}