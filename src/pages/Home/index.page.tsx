import { usePathname } from "next/navigation";
import Layout from "../../components/Layout/index.page";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { setupAPIClient } from "@/services/api";
import { destroyCookie } from "nookies";
import { BoxContent, Card, CardContainer, Container, InfoSection, SystemObjective, WelcomeMessage } from "./styles";

export default function Home() {
  const pathname = usePathname();

  return (
    <Layout>
      <Container>
        <WelcomeMessage>Seja bem-vindo(a) ao sistema!</WelcomeMessage>
        <SystemObjective>
          Aqui você pode gerenciar seus projetos, acompanhar métricas e colaborar com sua equipe.
          Use os painéis abaixo para obter informações rápidas ou navegue pelo menu para acessar as funcionalidades detalhadas do sistema.
        </SystemObjective>
        <CardContainer>
          {/*<Card>
            <div className="content">
              <div className="icon-container">📈</div>
              <div className="text-container">
                <p>Créditos Ativos</p>
                <h3>10</h3>
                <div className="variation">+30% última semana</div>
              </div>
            </div>
          </Card>*/}
          
        </CardContainer>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {}
  }
})