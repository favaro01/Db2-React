import { styled } from "../../styles"

export const SimpleButton = styled('button', {
  width: '100%',
  fontSize: 14,
  height: 40,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 5,  
  marginBottom: 10,
  marginTop: 6,
  padding: '2px 15px',
  border: 0,
  cursor: 'pointer',
  fontSze: '1rem',
  variants: {
    styleColors: {
      db2Gradient:{        
        background: 'linear-gradient(43deg, #246776 42.06%, rgba(36, 103, 118, 0.64) 131.63%)',
        color: '$white',
      },
      orangeGradient: {        
        background: 'linear-gradient(43deg, #D36704 6.09%, rgba(195, 143, 82, 0.64) 95.66%)',
        color: '$white',
      },
      removeGradient: {        
        background: 'linear-gradient(43deg, #F00 6.09%, rgba(195, 82, 82, 0.64) 95.66%);',
        color: '$white',
      }
    },
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
    }
  },
  '&:hover': {
    filter: 'brightness(0.8)'
  }
})