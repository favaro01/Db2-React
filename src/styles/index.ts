import { createStitches } from "@stitches/react";

export const {
  config, 
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme, 
  createTheme
} =  createStitches({
  theme: {
    colors: {
      white: '#FFF',

      gray900: '#121214',
      gray800: '#202024',
      gray600: '#323238',
      gray500: '#3a3a3a',
      gray400: '#7c7c8a',
      gray300: '#c4c4cc',
      gray200: '#a9a9b2',
      gray100: '#e1e1e6',
      gray50: '#F3F6F9',

      red900: '#FF0000',
      red300: '#f64e60',
      red200: '#FF6B6B',
      red100: '#cd5c5c',
      
      orange300: '#ff6347',

      green900: '#009922',
      green500: '#7CFC00',
      green300: '#98FB98',

      yellow900: '#FFD700',
      yellow200: '#f0e68c',

      salmon: '#ffcbcb',

      blue: '#87CEEB',

      db2: '#246776',      
      db2Light: '#9bbac2',      
    }
  },
  media: {
    bp1: '(max-width: 600px)',
    bp2: '(max-width: 768px)',
    bp3: '(max-width: 1024px)',
    bp4: '(max-width: 1200px)',    
  },
  
})

