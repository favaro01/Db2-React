import { styled } from "../../styles"
import DefaulImage from "../../assets/bgDefaultButton.png"

export const DefaultB = styled('button', {
  width: '32%',
  fontSize: 14,
  height: 'auto',
  display: 'flex',
  backgroundImage: `url(${DefaulImage.src})`,
  backgroundSize: 'cover',
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
    filter: 'brightness(0.95)'
  },
  '&:disabled': {
    filter: 'brightness(0.6)',
    color: "$gray100",    
    'svg': {
      color: '$gray300 !important',
    },
    'h3': {
      color: '$gray300 !important',
    },
    '&:hover': {
      filter: 'brightness(0.6)'
    },
  }
})

export const Content = styled('div', {  
  display: 'flex',
  gap: 20,
  padding: '58px', 
})

export const Text = styled('p', {
  color: '#36343B',    
  fontSize: '0.875rem',   
})

export const ContentTitles = styled('div', {  
})

export const Title = styled('h3', {
  textAlign: 'left',
  color: '$db2',
  fontSize: '18px',
  fontWeight: '600',
})


export const SubTitle = styled('p', {
  textAlign: 'left',
  fontSize: '0.875rem',
  maxWidth: '75%',
})

