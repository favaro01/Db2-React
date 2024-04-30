import React, { InputHTMLAttributes } from 'react'
import { CleanInput } from './styles'

export const Input = ({...props}:InputHTMLAttributes<HTMLInputElement> ) => {
  return (  
    <div>
      <CleanInput {...props} />
    </div>
  )
}