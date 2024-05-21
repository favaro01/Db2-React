import { withSSRAuth } from "@/utils/withSSRAuth";
import { Controller, useForm } from "react-hook-form"
import { setupAPIClient } from "@/services/api";
import Configuracoes from "../index.page";
import { ActionsHeader, Container, ContentModal, FooterModal, Header, HeaderModal, Label, Text, TitleBox, ContentReports, Footer } from "./styles";
import { styled, useTheme } from '@mui/material/styles';
import { Table, Button, TableRow, TableHead, TableContainer, TableCell, TableBody, tableCellClasses, Box, IconButton, TableFooter, TablePagination, Modal, Typography, Menu, MenuItem, Input, FormControlLabel, Checkbox, Switch, CircularProgress } from "@mui/material";
import { ArrowLineLeft, ArrowLineRight, CaretLeft, CaretRight, Check, DotsThreeOutlineVertical, Minus, X, XCircle } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { SimpleButton } from "@/components/SimpleButton";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingScreen } from "@/pages/Pagamentos/styles";
import Divider from '@mui/material/Divider';
import * as XLSX from 'xlsx';
import { api } from "@/services/apiClient";

const inputStyle = {
  width: '100%',
  maxWidth: '-webkit-fill-available',
  height: 43,
  padding: '2px 15px',
  borderRadius: 10,
  border: '1px solid #F3F6F9',
  marginTop: 6,
}

type fidcProps = {
  fidcId: number,
  cnpj: string,
  name: string,
  contact: string,
  credorSiengeId: string,
  planoFinanceiroJurosId: number,
  planoFinanceiroTaxaId: number,
  PlanoFinanceiroPrincipalId: number,
  jwt?: string,
  isDeleted: boolean,
  isActive: boolean
  planoFinanceiroJuros?: {
    id: number,
    nome: string,
    codigo: number,
    isDeleted: boolean,
    isActive: boolean
  }
  planoFinanceiroTaxa?: {
    id: number,
    nome: string,
    codigo: number,
    isDeleted: boolean,
    isActive: boolean
  }
  planoFinanceiroPrincipal?: {
    id: number,
    nome: string,
    codigo: number,
    isDeleted: boolean,
    isActive: boolean
  }
}

export default function Titulos() {
  const [loadingAction, setLoadingAction] = useState(false);
  
  const [deTitle, setDeTitle] = useState("");
  const [ateTitle, setAteTitle] = useState("");

  async function handleSaveButtonClick() {  
    let url = '/api/Fidc/GetReportTitlesFidic';
    const params = new URLSearchParams();

    if (deTitle) {
      params.append('StartDate', deTitle);
    }

    if (ateTitle) {
      params.append('EndDate', ateTitle);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }    

    const response = await api.get(url, { responseType: 'arraybuffer' });

    // Process the data with xlsx
    const data = new Uint8Array(response.data);
    const json = JSON.parse(new TextDecoder().decode(data));

    // Map the array to a new array with renamed and reordered keys
    const mappedJson = json.map(obj => ({      
      'N.º do Título': obj.nuTitulo || '',
      'Código de documento': obj.cdDocumento || '',
      'N.º do documento': obj.nuDocumento || '',
      'Data de Emissão': obj.dtEmissao ? new Date(obj.dtEmissao).toLocaleDateString('pt-BR') : '',
      'Data de Vencimento': obj.dtVencimento ? new Date(obj.dtVencimento).toLocaleDateString('pt-BR') : '',
      'Valor Líquido': obj.vlLiquido ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(obj.vlLiquido) : '',
      'Retenção': obj.retencao ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(obj.retencao) : '',
      'Baixa realizada': obj.baixa ? 'Sim' : 'Não',
      'Status': obj.situation || '',
      'Quantidade de parcelas': obj.quantidadeParcela || '',
      'Conta Gerencial': obj.downloadAccounts || '',
      'Observações': obj.obs || '',
      'Id do Credor no Sienge': obj.credorSiengeId || '',
      'Nome do Credor': obj.credorName || '',
      'CNPJ do Credor': obj.credorCnpj || '',
      'Id da Empresa no Sienge': obj.empresaSiengeId || '',
      'Nome da Empresa': obj.empresaName || '',
      'CNPJ da Empresa': obj.empresaCnpj || '',
      'Contrapartida': '>',
      'N.º do Título de contrapartida': obj.nuTituloNewFIDC || '',
      'Código de documento de contrapartida': obj.cdDocumentoNewFIDC || '',      
      'N.º do documento de contrapartida': obj.nuDocumentoNewFIDC || '',      
      'Data de Emissão de contrapartida': obj.dtEmissaoNewFIDC ? new Date(obj.dtEmissaoNewFIDC).toLocaleDateString('pt-BR') : '',
      'Data de Vencimento de contrapartida': obj.dtVencimentoNewFIDC ? new Date(obj.dtVencimentoNewFIDC).toLocaleDateString('pt-BR') : '',
      'Valor Líquido de contrapartida': obj.vlLiquidoNewFIDC ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(obj.vlLiquidoNewFIDC) : '',
      'Taxas': obj.taxasNewFIDC || '',
      'Juros': obj.jurosNewFIDC || '',
      'Pagamento processado': obj.formaPagProcessadoNewFIDC !== null ? (obj.formaPagProcessadoNewFIDC ? 'Sim' : 'Não') : '',
      'Status de contrapartida': obj.situationNewFIDC || '',
      'Quantidade de parcelas ': obj.quantidadeParcelaNewFIDC || '',
      'Conta Gerencial da contrapartida': obj.contasBaixadasNewFIDC || '',
      'Taxa Efetiva': obj.taxaEfetivaNewFIDC || '',
      'Desconto': obj.descontoNewFIDC || '',
      'Valor Antecipado': obj.valorAntecipadoNewFIDC ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(obj.valorAntecipadoNewFIDC) : '',
      'Previsão de pagamento': obj.previsaoPagamentoNewFIDC ? new Date(obj.previsaoPagamentoNewFIDC).toLocaleDateString('pt-BR') : '',
      'Data de Antecipação': obj.dataAntecipacaoNewFIDC ? new Date(obj.dataAntecipacaoNewFIDC).toLocaleDateString('pt-BR') : '',
    }));

    // Convert the mapped array to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(mappedJson);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate download
    XLSX.writeFile(workbook, 'Titulos.xlsx'); 
  }  

  return (
    <>
     { 
        loadingAction &&
        <LoadingScreen> 
          <CircularProgress />       
        </LoadingScreen>
      }
      <Configuracoes>
        <Container>
          <Header>
            <TitleBox>
              <span>Relatório de títulos</span>
            </TitleBox>           
          </Header>        
          <Divider />
          <ContentReports>
            <Label size={"30"} style={{marginRight: "1.5rem"}}>
              <Text>De ?</Text>
              <input style={inputStyle} type="date" value={deTitle} onChange={(e) => setDeTitle(e.target.value)}  />
            </Label>
            <Label size={"30"} style={{marginRight: "auto"}}>
              <Text>Até ?</Text>
              <input style={inputStyle} type="date" value={ateTitle} onChange={(e) => setAteTitle(e.target.value)}  />
            </Label>
            {/* <Label size={"50"}>
              <Text>De</Text>
              <input style={inputStyle} type="date" />
            </Label>
            <Label size={"45"}>
              <Text>De</Text>
              <input style={inputStyle} type="date" />
            </Label> */}
          </ContentReports>    
          <Footer>
            <SimpleButton
              title="Download"
              styleColors="db2"
              onClick={handleSaveButtonClick}
            />
          </Footer>    
        </Container>
        <ToastContainer />
      </Configuracoes>
    </>
  )
}


export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {}
  }
})