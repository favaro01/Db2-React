import { withSSRAuth } from "@/utils/withSSRAuth";
import Layout from "../../components/Layout/index.page";
import { setupAPIClient } from "@/services/api";
import * as React from 'react';
import { BoxContent, BoxMenu, Container, LinkOptions, MenuOptions, Options } from "./styles";
import Router from "next/router";
import { usePathname } from "next/navigation";
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, } from "@mui/material";
import { CaretDown, CaretUp } from "phosphor-react";


type SecurityProps = {
  children: React.ReactNode;
}
export default function Relatorios({ children }: SecurityProps) {
  const pathname = usePathname();
  const routeOpenPayments = pathname === "/Configuracoes/FormasPagamento/Credores" ? true : (pathname === "/Configuracoes/FormasPagamento/CodigosBanco" ? true : (pathname === "/Configuracoes/FormasPagamento/ConfiguracoesGerais" ? true : (pathname === "/Configuracoes/FormasPagamento/Documentos" ? true : (pathname === "/Configuracoes/FormasPagamento/NumerosFormasPagamentos" ? true : false))))
  const routeOpenFidc = pathname === "/Configuracoes/OperacaoFidc/Credores" ? true : (pathname === "/Configuracoes/OperacaoFidc/Documentos" ? true : (pathname === "/Configuracoes/OperacaoFidc/Empresas" ? true : false))
  const [open, setOpen] = React.useState(routeOpenPayments);
  const [openFidc, setOpenFidc] = React.useState(routeOpenFidc);

  const handleClick = () => {
    setOpen(!open);
    setOpenFidc(false);
  };

  const handleClickFidc = () => {
    setOpenFidc(!openFidc);
    setOpen(false);
  };

  return (
    <Layout>
      <Container>
        <BoxMenu>
          <MenuOptions>           
            {/* <Options>
              <LinkOptions onClick={handleClick} className={pathname === '/Relatorios' ? 'active' : ''}>
                <span>Agiliza Pag</span> {open ? <CaretUp size={20} /> : <CaretDown size={20} />}
              </LinkOptions>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 6 }}>
                    <ListItemText onClick={() => Router.push('/Configuracoes/FormasPagamento/ConfiguracoesGerais')} primary="Configurações gerais" />
                  </ListItemButton>
                  <ListItemButton onClick={() => Router.push('/Configuracoes/FormasPagamento/NumerosFormasPagamentos')} sx={{ pl: 6 }}>
                    <ListItemText primary="Formas de Pagamento Padrão" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 6 }}>
                    <ListItemText onClick={() => Router.push('/Configuracoes/FormasPagamento/Credores')} primary="Personalizar por Credores" />
                  </ListItemButton>
                  <ListItemButton onClick={() => Router.push('/Configuracoes/FormasPagamento/CodigosBanco')} sx={{ pl: 6 }}>
                    <ListItemText primary="Bancos Usados" />
                  </ListItemButton>
                  <ListItemButton onClick={() => Router.push('/Configuracoes/FormasPagamento/Documentos')} sx={{ pl: 6 }}>
                    <ListItemText primary="Documentos Válidos" />
                  </ListItemButton>
                </List>
              </Collapse>
            </Options> */}
            <Options>
              <LinkOptions onClick={handleClickFidc} className={pathname === '/Configuracoes' ? 'active' : ''}>
                <span>Adianta Cash</span> {openFidc ? <CaretUp size={20} /> : <CaretDown size={20} />}
              </LinkOptions>
              <Collapse in={openFidc} timeout="auto" unmountOnExit>
                <List component="divx" disablePadding>                
                  <ListItemButton onClick={() => Router.push('/Relatorios/Saldo')} sx={{ pl: 6 }}>
                    <ListItemText primary="Saldo" />
                  </ListItemButton>
                  <ListItemButton onClick={() => Router.push('/Relatorios/Titulos')} sx={{ pl: 6 }}>
                    <ListItemText primary="Titulos" />
                  </ListItemButton>
                  {/* <ListItemButton onClick={() => Router.push('/Configuracoes/FormasPagamento/Documentos')} sx={{ pl: 6 }}>                   
                    <ListItemText primary="Tipos de documentos" />
                  </ListItemButton>
                  <ListItemButton onClick={() => Router.push('/Configuracoes/FormasPagamento/NumerosFormasPagamentos')} sx={{ pl: 6 }}>                   
                    <ListItemText primary="Nº Formas de pagamentos" />
                  </ListItemButton> */}
                </List>
              </Collapse>
              {/* <LinkOptions onClick={() => Router.push('/Configuracoes/OperacaoFidc')} className={pathname === '/Seguranca/GruposUsuarios' ? 'active' : ''}>
                <span>Operação FIDC</span>
              </LinkOptions> */}
            </Options>
            {/* <Options>
              <LinkOptions className={pathname === '/Seguranca/Usuarios' ? 'active' : ''}>
                <span>Conciliação</span>
              </LinkOptions>
            </Options> */}
          </MenuOptions>
        </BoxMenu>
        <BoxContent isChildren={children ? true : false}>
          {children ? children : <p>Selecione o menu</p>}
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