import { globalCss } from ".";

export const globalStyles = globalCss({
  '*': {
    margin: 0, 
    padding: 0, 
    '&::-webkit-scrollbar' : {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#e4e4e4',
      borderRadius: '100px'
    },    
    '&::-webkit-scrollbar-thumb': {      
      backgroundColor: '#A9A9B2',
      borderRadius: '100px',
    }
  },

  body: {
    '-webkit-font-smoothing': 'antialiased',
  },

  'body, input, textarea, button': {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',   
    '&:focus': {
      outline: 'none',
    }
  },
  // '@bp4': {
  //   "html": { 
  //     fontSize: '56.25%', 
  //   }
  // },
  // '@bp5': {
  //   "html": { 
  //     fontSize: '60%', 
  //   }
  // }
})