import { withSSRAuth } from "@/utils/withSSRAuth";
import Layout from "../../components/Layout/index.page";
import { setupAPIClient } from "@/services/api";
import * as React from 'react';
import { BoxContent, BoxMenu, ComponentPerson, Container, ContentInfoUser, Department, ImageAvatar, LinkOptions, MenuOptions, NameUser, Options, OptionsPeople } from "./styles";
import Router from "next/router";
import { usePathname } from "next/navigation";
import avatar from '../../assets/avatarDefault.png'
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

type SecurityProps = {
  children: React.ReactNode;
}

export default function GerenciarConta({ children }: SecurityProps) {
  const pathname = usePathname();  
  const { user } = useContext(AuthContext);
  return (
    <Layout>
      <Container>
        <BoxMenu>
          <MenuOptions>
            <ComponentPerson style={{marginBottom: 10 }}>
              <ImageAvatar src={avatar.src} alt="Avatar do usuário" />
              <ContentInfoUser>
                <NameUser>{user?.userAccess?.name ? user?.userAccess?.name : 'Carregando...'}</NameUser>
                <Department>{user?.userAccess?.department ? user?.userAccess?.department : 'Carregando...'}</Department>
              </ContentInfoUser>              
            </ComponentPerson>
            <hr/>
            <Options style={{marginTop: 20 }}>
              <LinkOptions onClick={() => Router.push("/GerenciarConta/Pessoal")} className={pathname === '/GerenciarConta/Pessoal' ? 'active' : ''}>
                <span>Informações pessoais</span>
              </LinkOptions>
            </Options>
            <Options>
              <LinkOptions onClick={() => Router.push("/GerenciarConta/Contato")} className={pathname === '/GerenciarConta/Contato' ? 'active' : ''}>
                <span>Informações para contato</span>
              </LinkOptions>
            </Options>
            <Options>
              <LinkOptions onClick={() => Router.push("/GerenciarConta/Senha")} className={pathname === '/GerenciarConta/Senha' ? 'active' : ''}>
                <span>Alterar a senha</span>
              </LinkOptions>
            </Options>
          </MenuOptions>
        </BoxMenu>
        <BoxContent>
          {children}
        </BoxContent>
      </Container>
    </Layout>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {  
  return {
    props: {}
  }
})