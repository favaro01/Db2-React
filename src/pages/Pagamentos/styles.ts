import { styled } from "../../styles"
import bgLogin from "../../assets/bg_login.svg"

export const Container = styled('div', {
  marginTop: '60px',
  marginRight: '35px',
  marginLeft: '35px',
  height: 'auto',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  gap: 40,  
})

export const LoadingScreen = styled('div', {
  position: 'absolute',
  top: 0,
  zIndex: 999999999,
  background: "rgba(0, 0, 0, 0.7)",
  width: '100vw',
  height: '100vh',
  display: 'flex',  
  justifyContent: 'center',
  alignItems: 'center',
})

export const ContainerMessage = styled('div', {
  marginTop: '60px',
  marginRight: '35px',
  marginLeft: '35px',
  height: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 40,
});

export const WelcomeMessage = styled('h2', {
  fontSize: '24px',
  color: '#333',
  marginBottom: '6px',
});

export const BoxButtons = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
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
  variants: {
    isChildren: {
      false: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        'p': {
          color: '$gray400',
        }

      },
    }
  },
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

export const ActionsHeader = styled('div', {
  display: 'flex',
  justifyContent: 'right',
  gap: 10,
  flex: 1,
})

export const HeaderModal = styled('div', {
  padding: '16px 32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const ContentModal = styled('div', {
})

export const CredoresUpdateOrCreate = styled('div', {
  padding: '16px 32px',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
})

export const CredoresSearch = styled('div', {
  padding: '16px 32px',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
})

export const FooterModal = styled('div', {
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
