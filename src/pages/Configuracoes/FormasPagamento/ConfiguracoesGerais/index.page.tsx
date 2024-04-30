import { withSSRAuth } from "@/utils/withSSRAuth";
import { useForm } from "react-hook-form"
import Configuracoes from "../../index.page";
import { Container, Header, Label, Text, TitleBox, Content } from "./styles";
import { useEffect, useState } from "react";
import Switch from '@mui/material/Switch';
import { api } from "@/services/apiClient";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function ConfiguracoesGerais() {           
    const [checked, setChecked] = useState(false);
 
    async function handleActionConfiguracoesGerais() {
      setChecked(!checked)
      const changeChecked = !checked;
      await api.put(`/api/Configuracoes/AtualizaProcessamentoAutomatico/${changeChecked}`)
      .then(response => {        
        toast.success(`Processamento automático atualizado`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });  
      })
      .catch(() => {        
        toast.error(`Não foi possível atualizar o processamento automático`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });  
      }) 
    } 

    async function fetchConfiguracoesGerais() {      
      await api.get(`/api/Configuracoes/GetProcessamentoAutomatico`)
      .then(response => {      
        setChecked(response.data);
      })
      .catch(() => {        
      })    
    }     

    useEffect(() => {
 
     fetchConfiguracoesGerais();
    }, [])     
   
  return (
    <Configuracoes> 
      <Container>
        <Header>
          <TitleBox>
            <span>Configurações gerais</span>
          </TitleBox>        
        </Header>    
        <hr/>    
        <Content>          
          <Label>
            <Text>Processamento Automático</Text>            
            <Switch {...label} checked={checked} onChange={handleActionConfiguracoesGerais} />
          </Label>
        </Content>
      </Container>
      <ToastContainer />
    </Configuracoes>
  )
}


export const getServerSideProps = withSSRAuth(async (ctx) => {  
  return {
    props: {}
  }
})