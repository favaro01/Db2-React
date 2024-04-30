import React, { ButtonHTMLAttributes } from "react";
import { SimpleButton } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {  
  styleColors: 'db2Gradient' | 'orangeGradient' | 'removeGradient';
  title: string;
  size: 'auto' | 'titleBox' | 'small' | 'medium' | 'large' | 'full' | '5' | '10' | '15' | '20' | '25' | '30' | '35' | '40' | '45' | '50' | '55' | '60' | '65' | '70' | '75' | '80' | '85' | '90' | '95' | '100';
};

export const GradientButton = ({title, styleColors, size, ...props}: ButtonProps) => {
  return <SimpleButton {...props} styleColors={styleColors} size={size}>{title}</SimpleButton>
};
 