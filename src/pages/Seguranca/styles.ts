import { styled } from "../../styles"
import bgLogin from "../../assets/bg_login.svg"

export const Container = styled('div', {
  marginTop: '60px',
  marginRight: '35px',
  marginLeft: '35px',
  height: 'auto',
  display: 'flex',
  justifyContent: 'space-between',
  gap: 40,
  '@bp4': {
    flexDirection: 'column',
  }
})

export const BoxMenu = styled('div', {
  width: 350,
  minHeight: 400,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  boxShadow: '0px 0px 30px 0px rgba(0,0,0,0.1)',
  borderRadius: 10,
  padding: '25px 22px',
  '@bp4': {
    flexDirection: 'row',
    width: 'auto',
    minHeight: 'auto',
  }

})

export const MenuOptions = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  paddingLeft: 0,
  marginBottom: 0,
  marginTop: 0,
  listStyle: 'none',
  '@bp4': {
    flexDirection: 'row',    
    flexWrap: 'wrap',
    width: '100%',
  }
})

export const Options = styled('li', {
  whiteSpace: 'nowrap',
  minWidth: '100%',
  maxWidth: '100%',
  marginBottom: '15px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',  
  willChange: 'background-color,box-shadow,color',  
  transition: 'box-shadow .2s ease,color .2s ease,background-color .2s ease',
  '@bp4': {
    marginTop: '10px',
    marginBottom: '10px',
    flexDirection: 'row',    
    flexWrap: 'wrap',
    minWidth: 'auto',
    maxWidth: 'auto',
  }
})

export const LinkOptions = styled('a', {
  borderBottom: 0,
  fontWeight: 400,
  color: '$gray500',
  padding: '0.9375rem 1.5625rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',  
  willChange: 'background-color,box-shadow,color',  
  transition: 'box-shadow .2s ease,color .2s ease,background-color .2s ease',
  fontSize: '1rem',
  cursor: 'pointer',
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  '&:hover, &.active': {  
    borderRadius: '5px',
    backgroundColor: '$gray50',
    color: '$db2',
  }
})

export const BoxContent = styled('div', {
  flex: 1,
  minHeight: 300,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  boxShadow: '0px 0px 30px 0px rgba(0,0,0,0.1)',
  borderRadius: 10,  
})
