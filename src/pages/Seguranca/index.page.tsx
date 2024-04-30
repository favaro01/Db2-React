import { withSSRAuth } from "@/utils/withSSRAuth";
import Layout from "../../components/Layout/index.page";
import { setupAPIClient } from "@/services/api";
import * as React from 'react';
import { BoxContent, BoxMenu, Container, LinkOptions, MenuOptions, Options } from "./styles";
import Router from "next/router";
import { usePathname } from "next/navigation";

type SecurityProps = {
  children: React.ReactNode;
}

export default function Seguranca({ children }: SecurityProps) {
  const pathname = usePathname();  
  return (
    <Layout>
      <Container>
        <BoxMenu>
          <MenuOptions>
            <Options>
              <LinkOptions onClick={() => Router.push("/Seguranca/Departamentos")} className={pathname === '/Seguranca/Departamentos' ? 'active' : ''}>
                <span>Departamentos</span>
              </LinkOptions>
            </Options>
            {/* <Options>
              <LinkOptions onClick={() => Router.push("/Seguranca/GruposUsuarios")} className={pathname === '/Seguranca/GruposUsuarios' ? 'active' : ''}>
                <span>Grupo de Usuários</span>
              </LinkOptions>
            </Options> */}
            <Options>
              <LinkOptions onClick={() => Router.push("/Seguranca/Usuarios")} className={pathname === '/Seguranca/Usuarios' ? 'active' : ''}>
                <span>Usuários</span>
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