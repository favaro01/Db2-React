import React, {InputHTMLAttributes } from 'react'
import { Content, Input, Label } from './styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  label?: string,
  isRequerid?: boolean,
  id?: string
}

export const ContentInput = ({label, id, isRequerid, ...props}: InputProps ) => {
  return (
    <Content>
      <Label htmlFor={id}>
        {label}
        {isRequerid && <span>*</span> }        
      </Label>
      <Input id={id} name={id} type='text' {...props} />
    </Content>
  )
}