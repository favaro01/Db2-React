import { styled } from "../../styles"
import bgLogin from "../../assets/bg_login.svg"

export const Container = styled('div', {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${bgLogin.src})`,
    backgroundSize: 'cover', 
    backgroundRepeat: 'no-repeat',
})

export const ContentLogin = styled('div', {
  width: 415,
  height: 505,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  background: 'white',
  boxShadow: '0px 0px 30px 0px rgba(0,0,0,0.1)',
  borderRadius: 10,
  padding: 42,
})

export const ContentLogo = styled('div', {
  width: '100%',
  height: '40%',
  padding: 10,
})

export const ContentForm = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: 10,
})

export const ForgotPassword = styled('a', {        
  color: '$gray200',
  cursor: 'pointer',
  marginLeft: 'auto',
  marginRight: 'auto',
  fontSize: 13, 
  '&:hover': {
    filter: 'brightness(0.8)'
  }
})


