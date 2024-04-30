import { withSSRAuth } from "@/utils/withSSRAuth";
import { useForm } from "react-hook-form"
import Configuracoes from "../../index.page";
import { Container, Header, Label, Text, TitleBox, Content, Footer, SeparatorLine } from "./styles";
import { useEffect, useState } from "react";
import Switch from '@mui/material/Switch';
import { api } from "@/services/apiClient";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SimpleButton } from "@/components/SimpleButton";
import { normalizeCurrency } from "@/Masks/mask";

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const inputStyle = {
  width: '100%',
  maxWidth: '-webkit-fill-available',
  height: 43,
  padding: '2px 15px',
  borderRadius: 10,
  border: '1px solid #F3F6F9',
  marginTop: 6,
}

export default function ConfiguracoesGerais() {
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [documento, setDocumento] = useState("");
  const [departamento, setDepartamento] = useState("");


  async function handleSaveButtonClick() {
    console.log(documento, departamento, minValue, maxValue)
    const updates = [
      api.put(`/api/Fidc/UpdateRange?&MinValue=${Number(minValue)}${maxValue && "&MaxValue=" + Number(maxValue)}`),
      api.put(`/api/Fidc/UpdateDocumentoParametrizacao`, { parameterUpdate: documento }),
      api.put(`/api/Fidc/UpdateDepartamentParametrizacao`, { parameterUpdate: String(departamento) })
    ];

    try {
      await Promise.all(updates);
      toast.success("Todas as configurações foram atualizadas com sucesso.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("Não foi possível atualizar algumas ou todas as configurações.", {
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

  async function fetchConfiguracoesGerais() {
    await api.get(`/api/Fidc/GetRange`)
      .then(response => {
        setMinValue(response.data.minRangeValue);
        setMaxValue(response.data.maxRangeValue);
      })
      .catch(() => {
      })
  }



  async function fechConfiguracaoDocumento() {
    await api.get(`/api/Fidc/GetDocumentosParametrizacao`)
      .then(response => {
        setDocumento(response.data);
      })
      .catch(() => {
      })
      
  }




  async function fetchConfiguracaDepartamento() {
    await api.get(`/api/Fidc/GetDepartamentParametrizacao`)
      .then(response => {
        setDepartamento(response.data);
      })
      .catch(() => {
      })
  }



  useEffect(() => {
    fetchConfiguracoesGerais();
    fetchConfiguracaDepartamento();
    fechConfiguracaoDocumento();
  }, [])




  return (
    <Configuracoes>
      <Container>
        <Header>
          <TitleBox>
            <span>Adianta Cash - Configurações gerais</span>
          </TitleBox>
        </Header>
        <hr />

        <Content>
          <Label>
            <SeparatorLine></SeparatorLine>
            Configurações dos titulos
          </Label>
        </Content>
        <Content>
          <Label>
            <Text>Valor mínimo</Text>
            <input style={inputStyle} value={minValue} onChange={(e) => setMinValue(e.target.value)} />
          </Label>
          <Label>
            <Text>Valor máximo</Text>
            <input style={inputStyle} value={maxValue} onChange={(e) => setMaxValue(e.target.value)} />
          </Label>
        </Content>

        <Content>
          <Label>
            <SeparatorLine></SeparatorLine>
            Configurações de títulos de contrapartida
          </Label>
        </Content>

        <Content>
          <Label>
            <Text>Documento</Text>
            <input style={inputStyle} value={documento} onChange={(e) => setDocumento(e.target.value)} />
          </Label>
          <Label>
            <Text>Departamento</Text>
            <input style={inputStyle} value={departamento} onChange={(e) => setDepartamento(e.target.value)} />
          </Label>
        </Content>


        <Footer>
          <SimpleButton
            title="Salvar"
            styleColors="db2"
            onClick={handleSaveButtonClick}
          />
        </Footer>
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