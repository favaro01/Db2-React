import React, { ButtonHTMLAttributes } from "react";
import { SimpleButtonS } from './styles';
import CircularProgress from '@mui/material/CircularProgress';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {  
  styleColors: 'db2' | 'gray';
  title: string;
  loading?: boolean;
};

export const SimpleButton = ({title, styleColors, loading = false, ...props}: ButtonProps) => {
  return(
    <>
      <SimpleButtonS {...props} styleColors={styleColors}>
        {loading === true ? 
          <CircularProgress />        
        : title}
      </SimpleButtonS>
    </>
  )
};
 