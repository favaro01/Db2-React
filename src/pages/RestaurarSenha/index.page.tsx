import { useState } from "react"
import Image from "next/image"
import Router from 'next/router'

import { Container, ContentForm, ContentLogin, ContentLogo, ForgotPassword } from './styles'
import { ContentInput } from "../../components/ContentInput"
import { SimpleButton } from "../../components/SimpleButton"

import logoImg from '../../assets/Logo_DB2.svg'

export default function RestaurarSenha(){
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  function handleBack() {
    Router.push('/')
  }

  function handleSignIn() {
    setLoading(true);
    try {
      alert("E-mail " + email)   

    } catch (error) {
      
    }finally{
      setLoading(false);
    }
  }

  return (
    <Container>
      <ContentLogin>
        <ContentLogo>
          <Image src={logoImg}  style={{width: '100%', height: '100%'}} alt="db2" />
        </ContentLogo>
        <ContentForm>
          <ContentInput id="email" isRequerid label="E-mail" placeholder="email@email.com.br" onChange={(e) => setEmail(e.target.value)} value={email} />          
          <SimpleButton styleColors="db2" onClick={handleSignIn} title="Recuperar"/>
          <ForgotPassword onClick={handleBack}>Voltar</ForgotPassword>
        </ContentForm>
      </ContentLogin>
    </Container>
  )
} 
