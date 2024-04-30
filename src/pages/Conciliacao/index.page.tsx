import { withSSRAuth } from "@/utils/withSSRAuth";
import Layout from "../../components/Layout/index.page";
import { usePathname } from 'next/navigation';
import { setupAPIClient } from "@/services/api";
import { Container, SystemObjective, WelcomeMessage } from "./styles";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

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

export default function Conciliacao() {
  const pathname = usePathname()
  const { user } = useContext(AuthContext);  
  const [userFull, setUserFull] = useState<userAccessProps>({} as userAccessProps);

  const [conciliation, setConciliation] = useState(false);
  const [conciliationView, setConciliationView] = useState(false);
  const [conciliationAdd, setConciliationAdd] = useState(false);
  const [conciliationEdit, setConciliationEdit] = useState(false);
  const [conciliationDelete, setConciliationDelete] = useState(false);
  const [conciliationReports, setConciliationReports] = useState(false);

  function userHasPermission(user:userAccessProps){    
    if(user){
      user.roles.modules.map(role => {                      
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
                            
       })
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
    conciliation ?
      <Layout>
         <Container>
            <WelcomeMessage>Desculpe, Esta Página Está em Desenvolvimento.</WelcomeMessage>
            <SystemObjective>
              Lamentamos informar que esta página está atualmente em desenvolvimento e, por isso, não está disponível no momento. Estamos trabalhando diligentemente para aprimorar nossa plataforma e em breve liberaremos o acesso a esta funcionalidade.
            </SystemObjective>
          </Container>
      </Layout> 
    :
    <Layout>
      <Container>
        <WelcomeMessage>Desculpe, você não possui permissão de acesso a este módulo.</WelcomeMessage>
        <SystemObjective>
            Lamentamos informar que você não tem as permissões necessárias para acessar esta página. Caso acredite que deveria ter acesso, por favor, entre em contato com o suporte técnico ou o administrador do sistema para resolvermos essa questão. Agradecemos sua compreensão e paciência.
        </SystemObjective>
      </Container>
    </Layout> 
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {  
  return {
    props: {}
  }
})