import { styled } from "../../styles"

export const SimpleButtonS = styled('button', {
  width: '100%',
  fontSize: 14,
  height: 45,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 5,  
  marginBottom: 10,
  marginTop: 6,
  padding: '2px 15px',
  border: 0,
  cursor: 'pointer',
  variants: {
    styleColors: {
      db2:{
        backgroundColor: "$db2",
        color: "$white",
      },
      gray: {
        backgroundColor: "$gray50",
        color: "$gray500",
      }
    }
  },
  '&:hover': {
    filter: 'brightness(0.8)'
  },
  '&:disabled': {
    backgroundColor: "$gray400",
    color: "$gray100",
    '&:hover': {
      filter: 'brightness(1)'
    },
  }
})