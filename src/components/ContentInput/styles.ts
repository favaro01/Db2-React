import { styled } from "../../styles"

export const Content = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 20,
})

export const Label = styled('label', {
  fontSize: '13px',
  span: {
    color: "$red900"
  },
})

export const Input = styled('input', {
  maxWidth: '100%',
  height: 43,
  padding: '2px 15px',
  borderRadius: 10, 
  border: 0,
  background: "$gray50",
  marginTop: 6,
})