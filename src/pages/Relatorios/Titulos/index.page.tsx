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
      'Nome': obj.fidcName,
      'CNPJ': obj.cnpjFidc,
      'Valor': new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(obj.contractValue),
      'Valor de ultrapassagem': new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(obj.amountAllowedExceed),
      'Saldo Pendente': new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(obj.outstandingBalance),
      'Saldo Restante': new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(obj.remainingBalance),      
    }));

    // Convert the mapped array to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(mappedJson);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate download
    XLSX.writeFile(workbook, 'saldos.xlsx'); 
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