import { styled } from "../../../styles"

export const Container = styled('form', {
  display: 'flex',
  flexDirection: 'column',
})

export const Header = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: ' 0 22px 0 22px',
  minHeight: '4rem',
  'span': {  
    fontSize: 20,
    color: '$gray500',
  }
})

export const TitleBox = styled('div', {
})

export const Content = styled('div', {
  display: 'flex',
  gap: 20,
  padding: ' 22px',
})

export const ContentImage = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

export const ContentForm = styled('div', {
  display: 'flex',  
  width: '100%',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
})

export const DivImage = styled('div', {
  position: 'relative',
})

export const ImageAvatar = styled('img', {
  width: '7.5rem',
  height: '7.5rem',
  marginRight: '0.5rem',
  borderRadius: '50%',
  verticalAlign: 'middle',
  borderStyle: 'none',
  marginTop: 10,
  objectFit: 'cover',
})

export const ButtonInput = styled('div', {
  cursor: "pointer", 
  backgroundColor: '#fff', 
  position: 'absolute', 
  top: 0, 
  right: 0, 
  boxShadow: '0px 0px 30px 0px rgba(0,0,0,0.1)', 
  minWidth: '25px', 
  height: '25px', 
  borderRadius: '50%',
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})


export const Footer = styled('div', {
  display: 'flex',
  gap: 20,
  padding: '16px 32px',
})

export const Text = styled('p', {
  color: '#36343B',    
  fontSize: '0.875rem',   
})

export const Label = styled('label', {
  marginBottom: '1rem',
  variants: {   
    size: {
      auto: {
        width: "auto",
      },
      titleBox: {
        width: "15%",
      },
      small:{
        width: "25%",
      },
      medium: {
        width: "50%",
      },
      large: {
        width: "75%",
      },
      full: {
        width: "100%",
      },
      5: {
        width: "5%",
      },
      10: {
        width: "10%",
      },
      15:{
        width: "15%",
      },
      20: {
        width: "20%",
      },
      25: {
        width: "25%",
      },
      30: {
        width: "30%",
      },
      35: {
        width: "35%",
      },
      40: {
        width: "40%",
      },
      45:{
        width: "45%",
      },
      50: {
        width: "50%",
      },
      55: {
        width: "55%",
      },
      60: {
        width: "60%",
      },
      65: {
        width: "65%",
      },
      70: {
        width: "70%",
      },
      75:{
        width: "75%",
      },
      80: {
        width: "80%",
      },
      85: {
        width: "85%",
      },
      90: {
        width: "90%",
      },
      95: {
        width: "95%",
      },
      100: {
        width: "100%",
      }      
    }, 
  },
  'select': {
    fontSize: '0.875rem',
    '&:focus-visible': {
      outline: '0px',
    },
    '&:disabled': {
      backgroundColor: "#FAFAFA",
      color: "#989898",
      opacity: 1,
    }
  },
  'option': {
    fontSize: '0.875rem',
    lineHeight: '0.875rem'
  },
  'span': {
    fontSize: '0.65rem',
    color: '$red900'
  }
})
