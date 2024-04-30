import { SignOut } from 'phosphor-react';
import { styled } from "../../styles";
 
export const Container = styled('div', {
})

export const Aside = styled('aside', {
  top: 0,
  position: "fixed",
  height: "100vh",
  background: '$white',
  zIndex: 1070,
  maxWidth: "17%",
  flex: '0 0 17%',
  width: "100%",
  paddingLeft: 0, 
  paddingRight: 0, 
  transition: "visibility 0s, opacity 0.5s linear",
  boxShadow: '0 0.125rem 9.375rem rgba(90,97,105,.1), 0 0.25rem 0.5rem rgba(90,97,105,.12), 0 0.9375rem 1.375rem rgba(90,97,105,.1), 0 0.4375rem 2.1875rem rgba(165,182,201,.1)',
  "&.isClosed": {    
    visibility: "hidden",
    opacity: "0",    
  },
  '@media (max-width:768px)': {
    flex: '0 0 25%',
    maxWidth: "25%",
  },
  '@media (max-width:576px)': {    
    flex: '0 0 100%',
    maxWidth: "100%",
  }
})

export const Main = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  marginLeft: "17%", 
  maxWidth: "83%",
  flex: '0 0 83%',
  width: '100%',
  position: 'relative',  
  padding: 0,
  minHeight: '100vh',
  backgroundColor: '$gray50',
  transition: "visibility 0s, opacity 0.5s linear",
  "&.isClosed": {    
    marginLeft: "0", 
    maxWidth: "100%",
    flex: '0 0 100%',
  },
  '@media (max-width:768px)': {
    marginLeft: "25%",
    flex: '0 0 75%',
    maxWidth: "75%",
  },
  '@media (max-width:576px)': {    
    flex: '0 0 100%',
    maxWidth: "100%",
  }
})

export const Header = styled('header', {
  position: 'sticky',
  top: 0,
  zIndex: 1020,
  background: '$white',
  boxShadow: '0 0.125rem 0.625rem rgba(90,97,105,.12)',
  boxSizing: 'border-box',
})

export const HeaderContent = styled('nav', {
  height: '3.75rem',
  padding: 0,
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
  alignItems: 'stretch',
})

export const LeftNavbar = styled('div', {
  display: 'flex',
  borderLeft: '1px solid #e1e5eb!important',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: 15,
  marginBottom: 0,
  listStyle: 'none',
  marginTop: 0,
  boxSizing: "border-box",
})

export const ButtonHamburguer = styled('a', {  
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  '@media (max-width:576px)': {    
    display: 'none',
    '&.isClosed': {
      display: 'flex',
    }
  }  
})

export const ButtonHamburguerMobile = styled('a', {  
  display: 'none',
  '@media (max-width:576px)': {    
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'absolute',
    top: '1.3rem',
    right: '1rem'
  }  
})

export const RightNavbar = styled('ul', {
  display: 'flex',
  borderLeft: '1px solid #e1e5eb!important',
  flexDirection: 'row',
  paddingLeft: 0,
  marginBottom: 0,
  listStyle: 'none',
  marginTop: 0,
  boxSizing: "border-box",
})

export const NotificationLi = styled('li', {
  position: 'relative',
  borderRight: '1px solid #e1e5eb',
  boxSizing: "border-box",
  display: 'flex',
})

export const NotificationLink = styled('a', {
  minWidth: '3.75rem',
  color: 'rgba(0,0,0,.5)',
  textDecoration: 'none',
  padding: '.625rem 0',  
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const IconNotification = styled('div', {
  position: 'relative',
  boxSizing: "border-box",
  cursor: "pointer",
  display: 'flex',
})

export const SpanNotification = styled('span', {
    position: 'absolute',
    padding: '0.25rem 0.375rem',
    fontSize: '.5rem',
    left: '50%',
    top: '50%',
    color: '$white',
    backgroundColor: '$db2',
    borderRadius: '10rem',
    lineHeight: 1,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'initial',
    display: 'inline-block',
})

export const ContentPerson = styled('div', {
  position: 'relative',
})

export const ComponentPerson = styled('a', {
  cursor: 'pointer',
  minWidth: '3.75rem',
  color: 'rgba(0,0,0,.5)',
  textDecoration: 'none',
  fontSize: '.8125rem',
  fontWeight: '400',
  padding: '0.625rem',
  transition: 'all .25s cubic-bezier(.27,.01,.38,1.06)',
  whiteSpace: 'nowrap',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  display: 'flex',
  alignItems: 'center',
})

export const ImageAvatar = styled('img', {
  maxWidth: '2.5rem',
  marginRight: '0.5rem',
  borderRadius: '50%',
  verticalAlign: 'middle',
  borderStyle: 'none',
})

export const NameUser = styled('span', {
})

export const Department = styled('span', {
  fontSize: '.6rem',
})

export const ContentInfoUser = styled('span', {
  display: 'flex',
  flexDirection: 'column',
  marginRight: 10,
})

export const ContentOptionsPerson = styled('div', {

})


export const AsideLogo = styled('div', {
})

export const NavLogo = styled('nav', {
  height: '3.75rem',
  display: 'flex',
  position: 'relative',
  borderBottom: '1px solid #e1e5eb',
  padding: 0,
  alignItems: 'stretch', 
  justifyContent: 'center',
  '@media (max-width:768px)': {    
    flexWrap: 'nowrap',    
  },
})

export const LinkLogo = styled('a', {
  fontWeight: 500,
  color: '$gray600',
  paddingTop: '0.7rem',
  paddingBottom: '0.7rem',
  marginRight: 0,
  width: '100%',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export const ImageLogotipo = styled('img', {
})

export const AsideContentOptions = styled('div', {

})

export const AsideOptions = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  paddingLeft: 0,
  marginBottom: 0,
  marginTop: 0,
  listStyle: 'none',
})

export const Options = styled('li', {
  whiteSpace: 'nowrap',
  minWidth: '100%',
  maxwidth: '100%',
  overflow: 'hidden',
  maxWidth: '100%',
  textOverflow: 'ellipsis',  
  willChange: 'background-color,box-shadow,color',  
  transition: 'box-shadow .2s ease,color .2s ease,background-color .2s ease',
})

export const LinkOptions = styled('a', {
  borderBottom: 0,
  fontWeight: 400,
  color: '$gray500',
  padding: '0.9375rem 1.5625rem', 
  willChange: 'background-color,box-shadow,color',  
  transition: 'box-shadow .2s ease,color .2s ease,background-color .2s ease',
  fontSize: '.85rem',
  cursor: 'pointer',
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  '&:hover, &.active': {
    boxShadow: 'inset 0.1875rem 0 0 #246776',
    backgroundColor: '$gray50',
    color: '$db2',
  },
  'span': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis', 
  }
})

export const ContentIconOption = styled('div', {
  minWidth: '1.25rem',
  fontSize: '90%',
  textAlign: 'center',
  verticalAlign: 'middle',
  willChange: 'color',    
  transition: 'color .2s ease',
  marginRight: '0.375rem',
  lineHeight: 1,
})

export const AsideContentTitle = styled('div', {
  paddingLeft: 24,
  paddingTop: 15,
  paddingBottom: 15,
  display: 'flex',
  alignItems: 'center',
})

export const AsideTitle = styled('p', {  
  color: '$gray200',
})

export const Content = styled('div', {
  marginBottom: '1rem',
})

export const SignOutLi = styled('li', {
  position: 'relative',
  borderLeft: '1px solid #e1e5eb',
  boxSizing: "border-box",
  display: 'flex',
})

export const SignOutLink = styled('a', {
  minWidth: '3.75rem',
  color: '$red300',
  textDecoration: 'none',
  padding: '.625rem 0',  
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const IconSignOut = styled('div', {
  position: 'relative',
  boxSizing: "border-box",
  cursor: "pointer",
  display: 'flex',
})

export const Footer = styled('div', {
  width: '100%',
  height: '2rem',
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 'auto'
})

export const Text = styled('p', {
  color: '$gray200',    
  fontSize: '0.875rem',   
})