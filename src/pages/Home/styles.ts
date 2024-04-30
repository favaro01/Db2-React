import { styled } from "../../styles"
import bgLogin from "../../assets/bg_login.svg"

export const Container = styled('div', {
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


export const BoxContent = styled('div', {
  width: '80%',
  minHeight: 300,
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  boxShadow: '0px 0px 30px 0px rgba(0,0,0,0.1)',
  borderRadius: 10,
  padding: '20px',
});

export const SystemObjective = styled('p', {
  fontSize: '16px',
  color: '#666',
  marginBottom: '20px',
  maxWidth: '800px',
  textAlign: 'center',
});

export const InfoSection = styled('div', {
  marginTop: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
});


export const CardContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  justifyContent: 'center',
});

export const Card = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start', // Alinhamento à esquerda para o ícone
  justifyContent: 'center',
  width: '250px', // Ajuste conforme necessário
  backgroundColor: 'white',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  padding: '1.5rem',
  position: 'relative',
  gap: '0.5rem',

  '& .icon-container': {
    display: 'flex',

    alignItems: 'center',
    justifyContent: 'center',
    background: '#E0F2FE',
    borderRadius: '10px',
    width: '50px',
    height: '50px',
    marginBottom: '1rem', // Distância entre o ícone e o texto do título
  },

  '& .info': {
    width: '100%', // Ocupar a largura total do card
    textAlign: 'left', // Alinhamento do texto à esquerda
  },

  '& p': {
    fontSize: '1rem',
    color: '#333',
    margin: '0',
  },

  '& h3': {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0.25rem 0', // Espaço vertical para o número
  },

  '& .variation': {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#4CAF50',
    width: '100%',
    textAlign: 'center',
    padding: '0.5rem 0',
    background: '#F0FDF4',
    position: 'absolute',
    bottom: '0',
    left: '0',
  },
});

export const WelcomeMessage = styled('h2', {
  fontSize: '24px',
  color: '#333',
  marginBottom: '6px',
});