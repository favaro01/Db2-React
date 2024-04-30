import Image from "next/image"
import Router from 'next/router'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext';
import { Container, ContentForm, ContentLogin, ContentLogo, ForgotPassword } from './styles'
import { ContentInput } from "../../components/ContentInput"
import { SimpleButton } from "../../components/SimpleButton"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logoImg from '../../assets/Logo_DB2.svg'
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import { withSSRGuest } from "@/utils/withSSRGuest";

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useContext(AuthContext)

  function handleChangePassword() {
    Router.push('/RestaurarSenha')
  }

  async function handleSubmit(event: FormEvent) {
    setLoading(true)
    event.preventDefault();
    try {
      Router.push('/Home')
      const data = {
        email: login,
        password,
      }

      await signIn(data);
      setTimeout(() => {
        setLoading(false)
      }, 4000);
    } catch (error) {
      toast.error(`Não foi possível realizar o login, verifique seu nome de usuário ou senha.`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });     
    }
    
  }

  return (
    <Container>
      <ContentLogin>
        <ContentLogo>
          <Image src={logoImg}  style={{width: '100%', height: '100%'}} alt="db2" />
        </ContentLogo>
        <ContentForm onSubmit={handleSubmit}>
          <ContentInput id="user" isRequerid label="Usuários" placeholder="email@email.com.br" onChange={(e) => setLogin(e.target.value)} value={login} />
          <ContentInput id="password" isRequerid label="Senha" type="password" placeholder="senha" onChange={(e) => setPassword(e.target.value)} value={password} />
          <SimpleButton styleColors="db2" disabled={!login ? true : (password ? false : (!loading ? false : true)) } type="submit" title="Entrar"/>
          <ForgotPassword onClick={handleChangePassword}>Esqueceu sua senha?</ForgotPassword>
        </ContentForm>
      </ContentLogin>
      <ToastContainer />
    </Container>
  )
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
});