import { FormEvent, ReactNode, useContext, useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import {
  Aside,
  Container,
  Content,
  Header,
  HeaderContent,
  IconNotification,
  Main,
  NotificationLi,
  NotificationLink,
  SpanNotification,
  RightNavbar,
  ContentPerson,
  ComponentPerson,
  ImageAvatar,
  NameUser,
  Department,
  ContentInfoUser,
  AsideLogo,
  AsideOptions,
  LinkLogo,
  NavLogo,
  ImageLogotipo,
  AsideTitle,
  AsideContentTitle,
  AsideContentOptions,
  Options,
  LinkOptions,
  ContentIconOption,
  SignOutLink,
  IconSignOut,
  SignOutLi,
  Footer,
  Text,
  LeftNavbar,
  ButtonHamburguer,
  ButtonHamburguerMobile,
} from "./styles";
import Menu from '@mui/material/Menu';
import { Bell, CaretDown, Lock, Gear, House, Bank, ArrowsCounterClockwise, Money, SignOut, List } from "phosphor-react";
import { MenuItem, Typography } from "@mui/material";
import Router from "next/router";
import { AuthContext, signOut } from "@/contexts/AuthContext";
import logoImg from '../../assets/Logo_DB2tech.png'
import avatar from '../../assets/avatarDefault.png'

const settings = ['Gerenciar Usuário'];
const barMenu = [
  {
    'TypeOptions': 1,
    'NameTypeOptions': "Definições",
    "NameMenu": "Segurança" ,
    "UrlPage": "Seguranca",
    "icon": <Lock size={20} />,
  },
  {
    'TypeOptions': 1,
    'NameTypeOptions': "Definições",
    "NameMenu": "Configurações" ,
    "UrlPage": "Configuracoes",
    "icon": <Gear size={20} />,
  },
  {
    'TypeOptions': 2,
    'NameTypeOptions': "Setor integrado",
    "NameMenu": "Home" ,
    "UrlPage": "Home",
    "icon": <House size={20} />,
  },
  {
    'TypeOptions': 2,
    'NameTypeOptions': "Setor integrado",
    "NameMenu": "Adianta Cash" ,
    "UrlPage": "OperacaoFIDC",
    "icon": <Bank size={20} />
  },
  {
    'TypeOptions': 2,
    'NameTypeOptions': "Setor integrado",
    "NameMenu": "Agiliza Pag" ,
    "UrlPage": "Pagamentos",
    "icon": <Money size={20} />
  },
  {
    'TypeOptions': 2,
    'NameTypeOptions': "Setor integrado",
    "NameMenu": "Conciliação" ,
    "UrlPage": "Conciliacao",
    "icon": <ArrowsCounterClockwise size={20} />
  }
]

type LayoutProps = {
  children: ReactNode;
}

type userAccessProps = {
  "accessFirst": boolean,
  "avatarImage": string,
  "cellPhone": string,
  "commercialPhone":string,
  "company":string,
  "department":string,
  "extension":string,
  "name":string,
  "roles": [], 
  "userId": number
}

export default function Layout({children}:LayoutProps) {
  const { user } = useContext(AuthContext);  
  const [userFull, setUserFull] = useState<userAccessProps>({} as userAccessProps);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(true);
  const pathname = usePathname();  
  let pathnameActive = pathname.match(/[a-zA-Z]+/g)[0];

  const [opFidc, setOpFidc] = useState(false);
  const [opFidcView, setOpFidcView] = useState(false);
  const [opFidcAdd, setOpFidcAdd] = useState(false);
  const [opFidcEdit, setOpFidcEdit] = useState(false);
  const [opFidcDelete, setOpFidcDelete] = useState(false);
  const [opFidcReports, setOpFidcReports] = useState(false);

  const [payments, setPayments] = useState(false);
  const [paymentsView, setPaymentsView] = useState(false);
  const [paymentsAdd, setPaymentsAdd] = useState(false);
  const [paymentsEdit, setPaymentsEdit] = useState(false);
  const [paymentsDelete, setPaymentsDelete] = useState(false);
  const [paymentsReports, setPaymentsReports] = useState(false);
  
  const [security, setSecurity] = useState(false);
  const [securityView, setSecurityView] = useState(false);
  const [securityAdd, setSecurityAdd] = useState(false);
  const [securityEdit, setSecurityEdit] = useState(false);
  const [securityDelete, setSecurityDelete] = useState(false);
  const [securityReports, setSecurityReports] = useState(false);

  const [settingsPermission, setSettings] = useState(false);
  const [settingsView, setSettingsView] = useState(false);
  const [settingsAdd, setSettingsAdd] = useState(false);
  const [settingsEdit, setSettingsEdit] = useState(false);
  const [settingsDelete, setSettingsDelete] = useState(false);
  const [settingsReports, setSettingsReports] = useState(false);

  const [conciliation, setConciliation] = useState(false);
  const [conciliationView, setConciliationView] = useState(false);
  const [conciliationAdd, setConciliationAdd] = useState(false);
  const [conciliationEdit, setConciliationEdit] = useState(false);
  const [conciliationDelete, setConciliationDelete] = useState(false);
  const [conciliationReports, setConciliationReports] = useState(false);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleRedirectUser = () => {
    Router.push('/GerenciarConta/Pessoal')
    setAnchorElUser(null);
  };

  function handleOpenOptionsPerson(event: React.MouseEvent<HTMLElement>) {
    setAnchorElUser(event.currentTarget);
  }

  function userHasPermission(user:userAccessProps){    
    if(user){
      if(user.roles){
        user.roles.modules.map(role => {             
            if(role.moduleId === 1){
              setPayments(true);
              role.permissions.map(permission => {              
                if(permission === 1){                
                  setPaymentsView(true);
                } else if(permission === 2){
                  setPaymentsAdd(true);
                } else if(permission === 3){
                  setPaymentsEdit(true);
                } else if(permission === 4){
                  setPaymentsDelete(true);
                } else if(permission === 5){
                  setPaymentsReports(true);
                }                                   
              })
            }
            if(role.moduleId === 2){
              setOpFidc(true);
              role.permissions.map(permission => {
                if(permission === 1){
                  setOpFidcView(true);
                } else if(permission === 2){
                  setOpFidcAdd(true);
                } else if(permission === 3){
                  setOpFidcEdit(true);
                } else if(permission === 4){
                  setOpFidcDelete(true);
                } else if(permission === 5){
                  setOpFidcReports(true);
                }                                   
              })
            }
            if(role.moduleId === 3){
              role.permissions.map(permission => {
                setConciliation(true);
                if(permission === 1){
                  setConciliationView(true);
                } else if(permission === 2){
                  setConciliationAdd(true);
                } else if(permission === 3){
                  setConciliationEdit(true);
                } else if(permission === 4){
                  setConciliationDelete(true);
                } else if(permission === 5){
                  setConciliationReports(true);
                }                                   
              })
            }
            if(role.moduleId === 4){
              setSettings(true);
              role.permissions.map(permission => {
                if(permission === 1){
                  setSettingsView(true);
                } else if(permission === 2){
                  setSettingsAdd(true);
                } else if(permission === 3){
                  setSettingsEdit(true);
                } else if(permission === 4){
                  setSettingsDelete(true);
                } else if(permission === 5){
                  setSettingsReports(true);
                }                                   
              })
            }         
            if(role.moduleId === 5){
              setSecurity(true);
              role.permissions.map(permission => {
                if(permission === 1){
                  setSecurityView(true);
                } else if(permission === 2){
                  setSecurityAdd(true);
                } else if(permission === 3){
                  setSecurityEdit(true);
                } else if(permission === 4){
                  setSecurityDelete(true);
                } else if(permission === 5){
                  setSecurityReports(true);
                }                                   
              })
            }                   
         })
      }
    }
  }
  
  useEffect(() => {
    function generalUser(){      
      setUserFull(user?.userAccess);
    }
    
    
    userHasPermission(user?.userAccess);
    generalUser();
  }, [user])
  

  return (
    <Container>
      <Aside className={open ? "isOpen" : "isClosed"}>
        <AsideLogo>
          <NavLogo>
            <LinkLogo onClick={() => Router.push('/Home')} style={{cursor: 'pointer'}}>
              <ImageLogotipo src={logoImg.src} style={{width: 'auto', maxHeight: '100%'}} alt="Logo DB2"/>
            </LinkLogo>
          </NavLogo>
          <ButtonHamburguerMobile className="menuHamburguer" onClick={() => setOpen(!open)}>
            <List size={20} />            
          </ButtonHamburguerMobile>
        </AsideLogo>
        <AsideContentOptions>        
          {
            
            security === true || settingsPermission === true ?
              <>
                <AsideContentTitle>
                  <AsideTitle>
                    Definições
                  </AsideTitle>
                </AsideContentTitle>
                <AsideOptions >
                  {barMenu.map(menu => {
                    return menu.TypeOptions === 1 &&
                      <Options key={menu.UrlPage}>
                        <LinkOptions style={menu.UrlPage === 'Seguranca' ? (security === false ? {display: 'none'} : {}) : (settingsPermission === false ? {display: 'none'} : {})} onClick={() => Router.push(menu.UrlPage === 'Seguranca' ? "/"+menu.UrlPage+'/Departamentos' : "/"+menu.UrlPage)} className={pathnameActive === menu.UrlPage ? 'active' : ''}>
                          <ContentIconOption>
                            {menu.icon}
                          </ContentIconOption>
                          <span>{menu.NameMenu}</span>
                        </LinkOptions>
                      </Options>
                  })}
                </AsideOptions>
              </> :
              <></>
          }

          <AsideContentTitle>
            <AsideTitle>
              Setor Integrado
            </AsideTitle>
          </AsideContentTitle>
          <AsideOptions>
            {barMenu.map(menu => {
              return menu.TypeOptions === 2 &&
                <Options key={menu.UrlPage}>
                  <LinkOptions onClick={() => Router.push("/"+menu.UrlPage)} className={pathnameActive === menu.UrlPage ? 'active' : ''}>
                    <ContentIconOption>
                      {menu.icon}
                    </ContentIconOption>
                    <span>{menu.NameMenu}</span>
                  </LinkOptions>
                </Options>
            })}
          </AsideOptions>
        </AsideContentOptions>
      </Aside>
      <Main className={open ? "isOpen" : "isClosed"}>
        <Header>
          <HeaderContent>
            <LeftNavbar>
              <ButtonHamburguer className={open ? "isOpen" : "isClosed"} onClick={() => setOpen(!open)}>
                <List size={20} />            
              </ButtonHamburguer>
            </LeftNavbar>
            <RightNavbar>
              <NotificationLi style={{display:'none'}}>
                <NotificationLink>
                  <IconNotification>
                    <Bell size={24} />
                    <SpanNotification>
                      0
                    </SpanNotification>
                  </IconNotification>
                </NotificationLink>
              </NotificationLi>
              <ContentPerson>
                <ComponentPerson onClick={handleOpenOptionsPerson}>
                  <ImageAvatar src={avatar.src} alt="Avatar do usuário" />
                  <ContentInfoUser>
                    <NameUser>{userFull ? userFull.name : "Usuário"}</NameUser>
                    <Department>{userFull ? userFull.department : "Departamento" }</Department>
                  </ContentInfoUser>
                  <CaretDown size={18} />
                </ComponentPerson>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleRedirectUser}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </ContentPerson>
              <SignOutLi>
                <SignOutLink onClick={() => signOut()}>
                  <IconSignOut>
                    <SignOut size={24} />
                  </IconSignOut>
                </SignOutLink>
              </SignOutLi>
            </RightNavbar>
          </HeaderContent>
        </Header>
        <Content>
          {children}
        </Content>
        <Footer>
          <Text>DB2 Tech</Text>
        </Footer>
      </Main>
    </Container>
  )
}
