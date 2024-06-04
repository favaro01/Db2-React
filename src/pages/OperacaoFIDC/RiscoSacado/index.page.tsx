import Layout from "../../../components/Layout/index.page";
import * as React from 'react';
import { ActionsHeader, BoxButtons, BoxContent, Container, ContainerMessage, ContentModal, CredoresSearch, CredoresUpdateOrCreate, DivSituation, FooterModal, Header, HeaderModal, Label, ListGlossary, LoadingScreen, RiskWithdrawnExport, Text, TextSituation, Title, TitleBox, WelcomeMessage } from "./styles";
import { DefaultButton } from "@/components/DefaultButton";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { useForm } from "react-hook-form"
import { styled, useTheme } from '@mui/material/styles';
import { Table, Button, TableRow, TableHead, TableContainer, TableCell, TableBody, tableCellClasses, Box, IconButton, TableFooter, TablePagination, Modal, Typography, Menu, MenuItem, Input, FormControlLabel, Checkbox, Switch, Tooltip, CircularProgress } from "@mui/material";
import { ArrowLineLeft, ArrowLineRight, CaretLeft, CaretRight, DotsThreeOutlineVertical, FileText, Minus, X, XCircle } from "phosphor-react";
import { useEffect, useCallback , useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { SimpleButton } from "@/components/SimpleButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from 'react-dropzone';

import checkIcon from '../../../assets/checkIcon.svg'
import pendingIcon from '../../../assets/pendingIcon.svg'
import errorIcon from '../../../assets/errorIcon.svg'
import blockIcon from '../../../assets/blockIcon.svg'
import requestIcon from '../../../assets/requestIcon.svg'
import notProcess from '../../../assets/notProcess.svg'
import notProcessDown from '../../../assets/notProcessDown.svg'

import { AuthContext } from "@/contexts/AuthContext";
import { SystemObjective } from "../../Home/styles";
import { api } from "@/services/apiClient";
import { format, set } from "date-fns";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from "next/router";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { normalizeCnpjNumber, normalizeDecimal } from '../../../Masks/mask'
import error from "next/error";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#D4E9EE',
    color: '#3F4254',
    padding: '12px 16px',
  },
}));

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1100,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  overflowY: 'scroll',
  maxHeight: '90%',
};

const inputStyle = {
  width: '100%',
  maxWidth: '-webkit-fill-available',
  height: 43,
  padding: '2px 15px',
  borderRadius: 10,
  border: '1px solid #F3F6F9',
  marginTop: 6,
}

const CredoresFormSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  company: z.string(),
  creditor: z.string(),
  document: z.string(),
  dateIssue: z.string(),
  dueDate: z.string(),
  dueDays: z.string(),
  retention: z.string(),
  obs: z.string(),
  netValue: z.string(),
  barCode: z.string(),
  typeableLines: z.string(),
  status: z.string(),
});

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <ArrowLineRight size={32} /> : <ArrowLineLeft size={32} />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <CaretRight size={32} /> : <CaretLeft size={32} />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <CaretLeft size={32} /> : <CaretRight size={32} />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <ArrowLineLeft size={32} /> : <ArrowLineRight size={32} />}
      </IconButton>
    </Box>
  );
}

function TablePaginationActionsProcess(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <ArrowLineRight size={32} /> : <ArrowLineLeft size={32} />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <CaretRight size={32} /> : <CaretLeft size={32} />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <CaretLeft size={32} /> : <CaretRight size={32} />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <ArrowLineLeft size={32} /> : <ArrowLineRight size={32} />}
      </IconButton>
    </Box>
  );
}

type companyProps = {
  id: number,
  siengeId: number,
  name: string,
  cnpj: string,
  tradeName: string
}

type documentProps = {
  id: number,
  name: string,
  paymentTypeId: number,
  isDeleted: boolean,
  isActive: boolean,
  paymentTypeName: string,
  siengeId: number
}

type creditorProps = {
  id: number,
  siengeId: number,
  name: string,
  tradeName: string,
  cpf: "",
  cnpj: "",
  supplier: string,
  broker: string,
  employee: string,
  active: boolean,
  stateRegistrationNumber: string,
  stateRegistrationType: string,
  paymentTypeId: number,
  paymentType: null,
  isDeleted: false,
  isActive: true
}

type parcelasProps = {
  id: number,
  codigo_de_barras: string,
  linha_digitavel: string,
  vencimento: string,
  nuTitulo: number,
}

type processDtoProps = {
  titulo: createDataProps,
  parcelas: [parcelasProps],
}

type createDataProps = {
  dataVencimentoValida: boolean,
  quantidadeParcela: number,
  id: number,
  nuTitulo: number,
  cdEmpresa: number,
  cdCredor: number,
  cdDocumento: string,
  nuDocumento: string,
  dtEmissao: string,
  dtVencimento: string,
  vlLiquido: number,
  formaPagProcessado: boolean,
  baixa: boolean,
  situation: string,
  sentToBank: boolean,
  downloadAccounts?: string,
  obs?: string,
  retencao?: number,
  credor: creditorProps,
  empresa?: companyProps,
  conformidade?: string,
  parcelas?: [parcelasProps]
  status?: number,
}

type exportDataProps = {
  codigoErp: number,
  documento: string,
  empresa: string,
  cnpj: string,
  dataDeEmissão: string,
  valorLiquido: number,
  Imposto: number,
  Parcela: number,
  dataVencimento: string,
  fornecedor: string,
  fornecedorCNPJ: string
}

type settingsProps = {
  name: string,
  type: string,
}

type CredoresFormData = z.infer<typeof CredoresFormSchema>

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

type userAccessProps = {
  "accessFirst": boolean,
  "avatarImage": string,
  "cellPhone": string,
  "commercialPhone": string,
  "company": string,
  "department": string,
  "extension": string,
  "name": string,
  "roles": [],
  "userId": number
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

const modelExcelImport = [
  {
    "Fornecedor": "Nome credor",
    "Fornecedor CNPJ": "00.000.000/0001-00",
    "FIDC": "FIDC NOME",
    "FIDC CNPJ": "00.000.000/0001-00",
    "N Documento": "123123",
    "Id do ERP": "101010",
    "Data de Antecipação": "12/12/2024",
    "Previsão de Pagamento": "12/12/2024",
    "Vencimento Original": "03/03/2025",
    "Taxa Efetiva": "0.25",
    "Valor Original": "R$ 1000,00",
    "Desconto": "R$ 1,00",
    "Valor Antecipado": "R$ 10,00",
    "Juros": "R$ 10,00",
    "Taxa": "R$ 10,00",
    "Status": "1",
    "Obs": "Titulo aprovado para antecipação"
  }
]


export default function Pagamentos(props: EnhancedTableProps) {
  const [loadingAction, setLoadingAction] = useState(false);
  //States
  const { onSelectAllClick, numSelected, rowCount } = props;
  const [rows, setRows] = useState<createDataProps[]>([]);
  const [rowView, setRowView] = useState<processDtoProps>();
  const [rowsProcessPayment, setRowsProcessPayment] = useState<processDtoProps[]>([]);
  const { user } = React.useContext(AuthContext);
  const [userFull, setUserFull] = useState<userAccessProps>({} as userAccessProps);
  const [rowTitlePayment, setRowTitlePayment] = useState<createDataProps>();
  const [settings, setSettings] = useState<settingsProps[]>([]);
  const [document, setDocument] = useState<documentProps[]>([]);
  const [open, setOpen] = useState(false);
  const [creditorFound, setCreditorFound] = useState<boolean>();
  const [page, setPage] = useState(0);
  const [pageProcess, setPageProcess] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsPerPageProcess, setRowsPerPageProcess] = useState(10);
  const [anchorElCredores, setAnchorElCredores] = useState<null | HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState(-1);
  const [nameModal, setNameModal] = useState('');
  const [obsCancel, setObsCancel] = useState('');
  const [hasObsCancel, setHasObsCancel] = useState(null);
  const [obsFail, setObsFail] = useState('');
  const [hasObsFail, setHasObsFail] = useState(null);
  const [obsPending, setObsPending] = useState('');
  const [hasObsPending, setHasObsPending] = useState(null);
  const [changeTypeModal, setChangeTypeModal] = useState('');
  const [selectedRows, setSelectedRows] = useState<createDataProps[]>([]);
  const [selected, setSelected] = useState<readonly number[]>([]);
  const isSelected = (id: number) => selected.indexOf(id) !== -1;
  const [selectedFidc, setSelectedFidc] = useState("0");
  const [fidcs, setFidcs] = useState<fidcProps[]>([]);
  const [hasFidc, setHasFidc] = useState(false)

  // Form envio manual 
  const [hasProvider, setHasProvider] = useState(null);
  const [provider, setProvider] = useState('');
  const [hasProviderCnpj, setHasProviderCnpj] = useState(null);
  const [providerCnpj, setProviderCnpj] = useState('');
  const [hasFidcImport, setHasFidcImport] = useState(null);
  const [fidcImport, setFidcImport] = useState('');
  const [hasFidcCnpjImport, setHasFidcCnpjImport] = useState(null);
  const [fidcCnpjImport, setFidcCnpjImport] = useState('');
  const [hasDocumentNumber, setHasDocumentNumber] = useState(null);
  const [documentNumber, setDocumentNumber] = useState('');
  const [hasIdErp, setHasIdErp] = useState(null);
  const [idErp, setIdErp] = useState('');
  const [hasDateAnticipation, setHasDateAnticipation] = useState(null);
  const [dateAnticipation, setDateAnticipation] = useState('');
  const [hasOriginalDueDate, setHasOriginalDueDate] = useState(null);
  const [originalDueDate, setOriginalDueDate] = useState('');
  const [hasEffectiveRate, setHasEffectiveRate] = useState(null);
  const [effectiveRate, setEffectiveRate] = useState('');
  const [hasOriginalValue, setHasOriginalValue] = useState(null);
  const [originalValue, setOriginalValue] = useState('');
  const [hasDiscount, setHasDiscount] = useState(null);
  const [discount, setDiscount] = useState('');  
  const [hasAdvanceValue, setHasAdvanceValue] = useState(null);
  const [advanceValue, setAdvanceValue] = useState('');
  const [hasFees, setHasFees] = useState(null);
  const [fees, setFees] = useState('');
  const [hasRate, setHasRate] = useState(null);
  const [rate, setRate] = useState('');
  const [hasObservation, setHasObservation] = useState(null);
  const [observation, setObservation] = useState('');  
  const [hasPaymentForecast, setHasPaymentForecast] = useState(null);
  const [paymentForecast, setPaymentForecast] = useState('');

  const [exportFile, setExportFile] = useState<exportDataProps[]>([]);

  const [buttonRemoveFilters, setButtonRemoveFilters] = useState(false);
  const [searcDateInitial, setSearcDateInitial] = useState("");
  const [searcDateFinal, setSearcDateFinal] = useState("");
  const [searcBills, setSearcBills] = useState("");
  const [searcEnterprises, setSearcEnterprises] = useState("");
  const [searcCreditors, setSearcCreditors] = useState("");
  const [isFixed, setIsFixed] = useState(false);

  const [searchPayment, setSearchPayment] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDocument, setSearchDocument] = useState("");


  const [payments, setPayments] = useState(false);
  const [paymentsView, setPaymentsView] = useState(false);
  const [paymentsAdd, setPaymentsAdd] = useState(false);
  const [paymentsEdit, setPaymentsEdit] = useState(false);
  const [paymentsDelete, setPaymentsDelete] = useState(false);
  const [paymentsReports, setPaymentsReports] = useState(false);

  const [jsonData, setJsonData] = useState(null);
  const [errorExcel, setErrorExcel] = useState(null);  

  const onDrop = (acceptedFiles) => {
    // Inicializar array de erros
    let errors = [];
    if (acceptedFiles.length > 1) {
      errors.push({ message: `Por favor, selecione apenas um arquivo.` });
      setErrorExcel(errors);             
    }else {
      const file = acceptedFiles[0];
  
      if (file) {
        const reader = new FileReader();
  
        reader.onload = () => {
          const binaryData = reader.result;
          const workbook = XLSX.read(binaryData, { type: 'binary' });
  
          // Assume apenas uma planilha no arquivo
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
  
          // Obter cabeçalho em minúsculas
          const originalHeader = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0]?.map(key => key.toLowerCase());
  
          // Verificar se o cabeçalho é compatível
          const expectedHeader = [
            'fornecedor',
            'fornecedor cnpj',
            'fidc',
            'fidc cnpj',
            'n documento',
            'id do erp',
            'data de antecipação',
            'previsão de pagamento',
            'vencimento original',
            'taxa efetiva',
            'valor original',
            'desconto',
            'valor antecipado',
            'juros',
            'taxa',
            'status',
            'obs'
          ];
  
          const isHeaderCompatible = expectedHeader.every(header => originalHeader?.includes(header));
  
          if (!isHeaderCompatible) {          
            errors.push({ message: `O cabeçalho do arquivo não é compatível com o esperado.` });          
            setErrorExcel(errors);          
          }else{
            // Converter para JSON
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);
  
            // Remover linhas vazias
            const filteredData = data.filter(row =>
              Object.values(row).some(cell => cell !== '' && cell !== null && cell !== undefined)
            );
  
            // Função para converter para camelCase
            const toCamelCase = (str) => {
              return str
                .normalize('NFD') // normalizar a string para a forma de decomposição canônica
                .replace(/[\u0300-\u036f]/g, '') // remover acentos
                .replace(/ç/g, 'c') // substituir ç por c
                .toLowerCase() // converter para minúsculas
                .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase()); // converter para camelCase
            };

            // Mapear cada subarray para um objeto com chaves em camelCase
            const jsonData = filteredData.map((row, rowIndex) => {
              const obj = {};
              let allColumnsHaveValue = true;

              originalHeader?.forEach((key, index) => {
                const camelCaseKey = toCamelCase(key);
                let value = row[index];

                // Verificar se a coluna tem valor
                if (value === '' || value === null || value === undefined) {
                  allColumnsHaveValue = false;
                  // Adicionar informação de erro                  
                  errors.push({ message: `Dado ausente na coluna ${camelCaseKey} na linha ${rowIndex + 1}` });
                } else {
                  // Converter campos específicos para número
                  if (['idDoErp', 'valorOriginal', 'desconto', 'valorAntecipado', 'juros', 'taxa', 'status'].includes(camelCaseKey)) {
                   // Converte value para string e remove 'R$', 'r$', espaços e substitui vírgula por ponto
                   const sanitizedValue = value.toString().replace(/R\$|r\$|\s/g, '').replace(/\.(?!\d)/g, '').replace(',', '.');
                   value = Number(sanitizedValue);
                  }
                  
                  // Converter campos de data de número para data
                  if (['dataDeAntecipacao', 'vencimentoOriginal', 'previsaoDePagamento'].includes(camelCaseKey)) {
                    const excelDate = new Date(1899, 12, value - 1); 
                    const year = excelDate.getFullYear();
                    const month = excelDate.getMonth() + 1;
                    const day = excelDate.getDate();
                    value = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                  }

                  // Converter campos específicos para string
                  if (['nDocumento'].includes(camelCaseKey)) {                                        
                    value = value.toString();
                  }
                  

                }
                obj[camelCaseKey] = value;
              });

              // Se todas as colunas tiverem valor, incluir o objeto no JSON
              if (allColumnsHaveValue) {
                return obj;
              }
            }).filter(Boolean); // Remover elementos nulos ou indefinidos do array

            // Armazenar erros em um estado
            console.log(jsonData)
            setErrorExcel(errors);
            setJsonData(jsonData);
  
            // Enviar para a API
            // axios.post('sua-api-endpoint', jsonData)
            //   .then(response => {
            //     console.log('Dados enviados com sucesso!', response.data);
            //   })
            //   .catch(error => {
            //     console.error('Erro ao enviar dados:', error);
            //   });
          }        
        };
  
        reader.readAsBinaryString(file);
      }
    }

  };
  
  const {acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop, accept: {'text/csv': ['.csv'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']} });

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const emptyRowsProcess = pageProcess > 0 ? Math.max(0, (1 + pageProcess) * rowsPerPageProcess - rowsProcessPayment.length) : 0;
  const { register, handleSubmit, formState, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<CredoresFormData>({
    resolver: zodResolver(CredoresFormSchema)
  });

  const handleOpen = () => setOpen(true)
  
  const handleClose = () => {
    resetInputs();
    if (changeTypeModal === "processPayment") {
      fetchPagamentos();
    }
    setRowsProcessPayment([]);
    setSelectedRows([]);
    setSelected([]);
    setOpen(false);
    restInputsImport();
    setJsonData(null);
  }

  const restInputsImport = () => {
    setHasFidcImport(null);
    setFidcImport('');
    setHasFidcCnpjImport(null);
    setFidcCnpjImport('');
    setHasDateAnticipation(null);
    setDateAnticipation('');
    setHasEffectiveRate(null);
    setEffectiveRate('');
    setHasDiscount(null);
    setDiscount('');
    setHasAdvanceValue(null);
    setAdvanceValue('');
    setHasFees(null);
    setFees('');
    setHasRate(null);
    setRate('');
    setHasObservation(null);
    setObservation('');     
    setHasPaymentForecast(null);
    setPaymentForecast('');        
  }

  const handleChangePageProcess = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPageProcess(newPage);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelectedRows(rows);
      setSelected(newSelected);
      return;
    }
    setSelectedRows([]);
    setSelected([]);
  };

  const handleSelectRow = (event: React.MouseEvent<unknown>, row: createDataProps) => {
    const selectedIndex = selected.indexOf(row.id);
    let newSelected: readonly number[] = [];
    const selectedIndexRow = selectedRows.findIndex((selectedRow) => selectedRow.id === row.id);
    let newSelectedRows: createDataProps[] = [];

    if (selectedIndexRow === -1) {
      // Se o item não estiver presente, adiciona
      newSelectedRows = [...selectedRows, row];
    } else {
      // Se o item estiver presente, remove
      newSelectedRows = [
        ...selectedRows.slice(0, selectedIndexRow),
        ...selectedRows.slice(selectedIndexRow + 1),
      ];
    }

    setSelectedRows(newSelectedRows);

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row.id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangeRowsPerPageProcess = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPageProcess(parseInt(event.target.value, 10));
    setPageProcess(0);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  async function handleSearchUsers() {
    setLoadingAction(true);
    console.log(searcDateInitial, searcDateFinal, searcBills, searcCreditors, searchStatus, searchDocument);
    if (searcDateInitial || searcDateFinal || searcBills || searcEnterprises || searcCreditors || searchStatus || searchDocument) {
      await api.get(`/api/Fidc/SearchTitulos?${searcDateInitial && "&VencimentoInicial=" + searcDateInitial}${searcDateFinal && "&VencimentoFinal=" + searcDateFinal}${searcBills && '&Titulo=' + searcBills}${searcEnterprises && '&Emrpresa=' + searcEnterprises}${searcCreditors && '&Credor=' + searcCreditors}${searchDocument && '&Documento=' + searchDocument}${searchStatus && '&situation=' + searchStatus}`)
        .then(response => {
          setRows(response.data);
          setButtonRemoveFilters(true);
          handleClose();
        })
        .catch(() => {
          toast.error('Não foi encontrado nenhum resultado', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          resetSearchInputs()
        }).finally(() => {
          setLoadingAction(false);
        });
    } else {
      setLoadingAction(false);
      toast.error('É necessário preencher ao menos um campo realizar a busca.', {
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

  function userHasPermission(user: userAccessProps) {
    if (user) {
      if (user.roles) {
        user.roles.modules.map(role => {
          if (role.moduleId === 1) {
            setPayments(true);
            role.permissions.map(permission => {
              if (permission === 1) {
                setPaymentsView(true);
              } else if (permission === 2) {
                setPaymentsAdd(true);
              } else if (permission === 3) {
                setPaymentsEdit(true);
              } else if (permission === 4) {
                setPaymentsDelete(true);
              } else if (permission === 5) {
                setPaymentsReports(true);
              }
            })
          }
        })
      } else {
        setPayments(false);
      }
    }
  }

  const handleCloseCredoresMenu = () => {
    setAnchorElCredores(null);
  };

  function handleDownloadModel(){    
    event.preventDefault();
    const ws = XLSX.utils.json_to_sheet(modelExcelImport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "modeloImportacao.xlsx");
  };

  const handleRedirectCredores = (row: createDataProps, setting: string) => {
    setAnchorElCredores(null);
  };

  const handleOpenOptionsPerson = (index: number, row: createDataProps) => (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCredores(event.currentTarget);
    setOpenIndex(index);
  }

  async function handleOpenModalOrActivateAction(typeModal: 'view' | 'search' | 'importFile' | 'exportFile' | 'modelFile' | 'statusAnticipate' | 'statusCancel' | 'statusFail' | 'statusPending', row?: createDataProps) {
    setLoadingAction(true);
    setChangeTypeModal(typeModal);
    const targetDate = new Date(row?.dtVencimento);
    const currentDate = new Date();
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    if (typeModal === 'view') {
      await api.get(`/api/Fidc/GetTitulo/${row.nuTitulo}`)
        .then(response => {
          console.log(response.data);
          setRowView(response.data);
        })
        .catch(() => {
        }).finally(() => {
          setLoadingAction(false);
        });
      setNameModal('Visualizar')
      reset({
        id: row?.id, title: row?.nuTitulo.toString(), company: row?.empresa.siengeId.toString() + ' - ' + row?.empresa.name, creditor: row?.credor.siengeId.toString() + " - " + row.credor.name, document: row?.cdDocumento + " - " + row?.nuDocumento, dateIssue: format(new Date(row?.dtEmissao), 'dd/MM/yyyy'), dueDate: format(new Date(row?.dtVencimento), 'dd/MM/yyyy'), dueDays: daysDifference.toString(), retention: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row?.retencao),
        netValue: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row?.vlLiquido), status: row?.situation, obs: row?.obs
      });
      setOpen(true);
    } else if (typeModal === 'search') {
      setNameModal('Busca avançada')
      setOpen(true);
      setLoadingAction(false);
    } else if (typeModal === 'importFile') {
      setNameModal('Importar Excel');      
      setOpen(true);     
      setLoadingAction(false);      
    } else if (typeModal === 'exportFile') {
      if (selectedRows.length > 0) {
        setNameModal('Exportar Excel');                            
        setRowsProcessPayment([]);
        setOpen(true);       
        setLoadingAction(false);
      } else {
        setLoadingAction(false);
        toast.warning(`Para realizar a antecipação deve selecionar ao menos um titulo.`, {
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
    } else if (typeModal === 'modelFile') {
      setNameModal('Modelos do excel');                            
      setOpen(true);       
      setLoadingAction(false);                
    } else if (typeModal === 'statusAnticipate') {
      setNameModal('Antecipação');                            
      setOpen(true);       
      setLoadingAction(false);          
      setRowTitlePayment(row);     
      setProvider(row.credor.name); 
      setProviderCnpj(row.credor.cnpj); 
      setDocumentNumber(row.nuDocumento);
      setIdErp(String(row.nuTitulo));
      setOriginalDueDate(format(new Date(row.dtVencimento), 'dd/MM/yyyy'));
      setOriginalValue(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.vlLiquido));
    } else if (typeModal === 'statusCancel') {
      setNameModal('Cancelar Título');                            
      setOpen(true);       
      setLoadingAction(false);     
      setRowTitlePayment(row);                
    } else if (typeModal === 'statusFail') {
      setNameModal('Reprovar Título');                            
      setOpen(true);       
      setLoadingAction(false);    
      setRowTitlePayment(row);                 
    } else if (typeModal === 'statusPending') {
      setNameModal('Título Pendente');                            
      setOpen(true);       
      setLoadingAction(false);    
      setRowTitlePayment(row);                 
    } else {
      setLoadingAction(false);
      console.log('Algo deu errado')
    }
  }

  async function handleGenerateExcel(){   
     if(selectedFidc != "0"){
       setHasFidc(false);
       const processTitles = selectedRows.map((n) => n.nuTitulo.toString());          
       const newArray = processTitles.map(titulo => ({
         titulo,
         fidcId: Number(selectedFidc)
       }));          
       await api.post(`/api/Fidc/ExportTiles`, 
         {
           "parameters": [
            ...newArray
           ]
         }
       )
       .then(response => {        
          setOpen(false);
          setExportFile(response.data);      

          const treatedData = response.data.map((item) => ({
            "razao-sacado": item.empresa,
            "cnpj-sacado": item.cnpj.replace(/[.-\/]/g, ''),
            "razao-fornecedor": item.fornecedor,
            "cnpj-fornecedor": item.fornecedorCNPJ.replace(/[.-\/]/g, ''),
            "nota": item.nuDocumento,
            "valor": item.vlLiquido,
            "data-emissao": format(new Date(item.dtEmissao), 'dd/MM/yyyy'),
            "data-vencimento": format(new Date(item.dtVencimento), 'dd/MM/yyyy'),                        
          }));          

          const ws = XLSX.utils.json_to_sheet(treatedData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
          XLSX.writeFile(wb, "titulos.xlsx");
          toast.success(`Exportação realizada com sucesso.`, {
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
         setOpen(false);
         toast.error(`Ocorreu um erro com a Exportação.`, {
           position: "bottom-right",
           autoClose: 5000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
           theme: "light",
         });
       }).finally(() => {
         fetchPagamentos();
         setLoadingAction(false);
       });
     }else {
       setHasFidc(true)
     }    
  }

  async function handleImportExcel(){    
    console.log(jsonData);
    if(jsonData && acceptedFiles.length == 1 && errorExcel.length <= 0){
      await api.post(`/api/Fidc/ImportTiles`, jsonData)
      .then(response => {
        setOpen(false);
        toast.success(`Importação realizada com sucesso.`, {
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
        setOpen(false);
        toast.error(`Ocorreu um erro com a importação.`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }).finally(() => {
        fetchPagamentos();
        setLoadingAction(false);
      });
    }else {
      toast.error(`Não foi possível realizar a importação.`, {
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

  async function handleCancelObs(){
    await api.put(`/api/Fidc/UpdateObsTitulo/${rowTitlePayment.nuTitulo}`, {ParameterUpdate: obsCancel}).then(response => {
      setOpen(false);
      toast.success(`Título cancelado.`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }).catch(() => {
      setOpen(false);
      toast.error(`Ocorreu um erro ao cancelar o título.`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
  }

  async function handleFailObs(){
    await api.put(`/api/Fidc/UpdateObsTitulo/${rowTitlePayment.nuTitulo}`, {ParameterUpdate: obsFail}).then(response => {
      setOpen(false);
      toast.success(`Título reprovado.`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }).catch(() => {
      setOpen(false);
      toast.error(`Ocorreu um erro ao reprovado o título.`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
  }

  async function handlePendingObs(){
    await api.put(`/api/Fidc/UpdateObsTitulo/${rowTitlePayment.nuTitulo}`, {ParameterUpdate: obsPending}).then(response => {
      setOpen(false);
      toast.success(`Título reprovado.`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }).catch(() => {
      setOpen(false);
      toast.error(`Ocorreu um erro ao reprovado o título.`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
  }

  async function handleChangeStatus(){
    if(changeTypeModal === 'statusCancel'){
      if(obsCancel.length > 0){
        setHasObsCancel(true);    
        await api.put(`/api/Fidc/ChangeStatusTitulo/2`, {
          "titulo": Number(rowTitlePayment.nuTitulo)
        }).then(response => {
          handleCancelObs();
        }).catch(() => {
          setOpen(false);
          toast.error(`Ocorreu um erro ao cancelar o título.`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }).finally(() => {
          fetchPagamentos();
          setLoadingAction(false);
        });
      }else {
        setHasObsCancel(false)            
      }
    }else if(changeTypeModal === 'statusFail'){
      if(obsFail.length > 0){
        setHasObsFail(true);  
        await api.put(`/api/Fidc/ChangeStatusTitulo/3`, {
          "titulo": Number(rowTitlePayment.nuTitulo)
        }).then(response => {
          handleFailObs();
        }).catch(() => {
          setOpen(false);
          toast.error(`Ocorreu um erro ao reprovar o título.`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }).finally(() => {
          fetchPagamentos();
          setLoadingAction(false);
        });
      }else {
        setHasObsFail(false);                
      }
    }else if(changeTypeModal === 'statusPending'){
      if(obsPending.length > 0){
        setHasObsPending(true);
        await api.put(`/api/Fidc/ChangeStatusTitulo/4`, {
          "titulo": Number(rowTitlePayment.nuTitulo)
        }).then(response => {
          handlePendingObs();
        }).catch(() => {
          setOpen(false);
          toast.error(`Ocorreu um erro ao pendente o título.`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }).finally(() => {
          fetchPagamentos();
          setLoadingAction(false);
        });      
      }else {
        setHasObsPending(false);
      }    
    }else if(changeTypeModal === 'statusAnticipate'){     
      var validate = false; 
      if(
          fidcImport.length > 0 && 
          fidcCnpjImport.length > 0 && 
          dateAnticipation.length > 0 && 
          effectiveRate.length > 0 &&           
          discount.length > 0 && 
          paymentForecast.length > 0 &&
          advanceValue.length > 0 && 
          fees.length > 0 && 
          rate.length > 0 &&
          observation.length > 0
        ){
        validate = true;
      } else {
        validate = false;
        if(fidcImport.length > 0){
          setHasFidcImport(true);
        }else{
          setHasFidcImport(false);    
        }
        if(fidcCnpjImport.length > 0){
          setHasFidcCnpjImport(true);
        }else{
          setHasFidcCnpjImport(false);    
        }
        if(dateAnticipation.length > 0){
          setHasDateAnticipation(true);
        }else{
          setHasDateAnticipation(false);    
        }
        if(effectiveRate.length > 0){
          setHasEffectiveRate(true);
        }else{
          setHasEffectiveRate(false);    
        }
        if(discount.length > 0){
          setHasDiscount(true);
        }else{
          setHasDiscount(false);    
        }
        if(advanceValue.length > 0){
          setHasAdvanceValue(true);
        }else{
          setHasAdvanceValue(false);    
        }
        if(fees.length > 0){
          setHasFees(true);
        }else{
          setHasFees(false);    
        }
        if(rate.length > 0){
          setHasRate(true);
        }else{
          setHasRate(false);    
        }
        if(observation.length > 0){
          setHasObservation(true);
        }else{
          setHasObservation(false);    
        }        
        if(paymentForecast.length > 0){
          setHasPaymentForecast(true);
        }else{
          setHasPaymentForecast(false);    
        }   
      }

      if(validate){
        console.log({"fornecedor": provider,
        "fornecedorCnpj": providerCnpj,
        "fidc": fidcImport,
        "fidcCnpj": fidcCnpjImport,
        "nDocumento": documentNumber,
        "idDoErp": Number(idErp),
        "dataDeAntecipacao": dateAnticipation,
        "previsaoDePagamento": paymentForecast,
        "vencimentoOriginal": originalDueDate,
        "taxaEfetiva": effectiveRate,
        "valorOriginal": Number(originalValue),
        "desconto": Number(discount),
        "valorAntecipado": Number(advanceValue),
        "juros": Number(fees),
        "taxa": Number(rate),
        "status": 1,
        "obs": observation})
        await api.post(`/api/Fidc/ImportTiles`, [{
          "fornecedor": provider,
          "fornecedorCnpj": providerCnpj,
          "fidc": fidcImport,
          "fidcCnpj": fidcCnpjImport,
          "nDocumento": documentNumber,
          "idDoErp": Number(idErp),
          "dataDeAntecipacao": dateAnticipation,
          "previsaoDePagamento": paymentForecast,
          "vencimentoOriginal": originalDueDate,
          "taxaEfetiva": effectiveRate,
          "valorOriginal": Number(originalValue),
          "desconto": Number(discount),
          "valorAntecipado": Number(advanceValue),
          "juros": Number(fees),
          "taxa": Number(rate),
          "status": 1,
          "obs": observation
        }]).then(response => {
          setOpen(false);
          toast.success(`Título antecipado com sucesso.`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }).catch(() => {
          setOpen(false);
          toast.error(`Ocorreu um erro ao antecipar o título.`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }).finally(() => {
          fetchPagamentos();
          setLoadingAction(false);
        });
      }
    }
  }

  function resetInputs() {
    reset({ id: 0, title: '', company: '', creditor: "", document: "", dateIssue: "", dueDate: "", dueDays: "", expirationComparison: "", netValue: "", status: "" });
  }

  async function fetchPagamentos() {
    setLoadingAction(true);
    await api.get(`/api/Fidc/GetAllTitulos`)
      .then(response => {
        setRows(response.data);
      })
      .catch(() => {
      }).finally(() => {
        setLoadingAction(false);
      });

    const getSettings = [
      { name: 'Visualizar', type: 'view', },
      { name: 'Buscar', type: 'search', },
      { name: 'Antecipar', type: 'statusAnticipate', },
      { name: 'Cancelar', type: 'statusCancel', },
      { name: 'Reprovar', type: 'statusFail', },
      { name: 'Pendente', type: 'statusPending', },
    ]

    setSettings(getSettings);
  }

  function resetSearchInputs() {
    setSearcBills('')
    setSearcCreditors('')
    setSearcDateFinal('')
    setSearcDateInitial('')
    setSearcEnterprises('')
    setSearchStatus('')
    setSearchPayment('')
    setSearchDocument('')
  }

  function handleRemoveFilters() {
    setButtonRemoveFilters(false);
    resetSearchInputs();
    fetchPagamentos();
  }

  async function fetchGetDocument() {
    setLoadingAction(true);
    await api.get(`/api/Configuracoes/GetTiposDocumentos`)
      .then(response => {
        setDocument(response.data);
      })
      .catch(() => {
      }).finally(() => {
        setLoadingAction(false);
      });
  }

  async function fetchGetFidc() {
    setLoadingAction(true);
    await api.get(`/api/Fidc/GetAllFIDC`)
    .then(response => {
      setFidcs(response.data);
    })
    .catch(() => {      
    }).finally(() => {
      setLoadingAction(false);
    }); 
  }

  useEffect(() => {
    fetchGetFidc()
    fetchPagamentos();
    fetchGetDocument();
  }, [])

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      resetInputs()
    }
  }, [formState, isSubmitSuccessful, reset])

  useEffect(() => {
    setFidcCnpjImport(normalizeCnpjNumber(fidcCnpjImport))
  },[fidcCnpjImport])

  useEffect(() => {
    setEffectiveRate(normalizeDecimal(effectiveRate))
  },[effectiveRate])
  
  useEffect(() => {
    function generalUser() {
      setUserFull(user?.userAccess);
    }


    userHasPermission(user?.userAccess);
    generalUser();
  }, [user])

  return (
    <>
      {
        loadingAction &&
        <LoadingScreen>
          <CircularProgress />
        </LoadingScreen>
      }
      {
        payments ?
          <Layout>
            <Container>
              <BoxButtons>
                <DefaultButton subTitle="clique aqui para realizar uma busca avançada" onClick={() => handleOpenModalOrActivateAction("search")} title="Busca avançada" typeIcon="search" />
                <DefaultButton subTitle="clique aqui para conferir os titulos antecipados" onClick={() => Router.push("/OperacaoFIDC/TitulosAntecipados")} title="Titulos Antecipados" typeIcon="receipt" />
                <DefaultButton subTitle="clique aqui para conferir os modelos completos" onClick={() => handleOpenModalOrActivateAction("modelFile")} title="Modelos do excel" typeIcon="reports" />
              </BoxButtons>
              <BoxContent>
                <Header>
                  <TitleBox>
                    <span>Antecipação de Recebíveis</span>
                  </TitleBox>
                  <ActionsHeader>
                    <GradientButton title="Importar títulos" onClick={() => handleOpenModalOrActivateAction("importFile")} styleColors="db2Gradient" size="auto" />
                    <GradientButton title="Exportar títulos" onClick={() => handleOpenModalOrActivateAction("exportFile")} styleColors="orangeGradient" size="auto" />                    
                    {
                      buttonRemoveFilters && (
                        <GradientButton title="Remover Filtros" onClick={() => handleRemoveFilters()} styleColors="removeGradient" size="auto" />
                      )
                    }
                  </ActionsHeader>
                </Header>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                    <TableHead className="TableHeader">
                      <TableRow>
                        <StyledTableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            indeterminate={selected.length > 0 && selected.length < rows.length}
                            checked={rows.length > 0 && selected.length === rows.length}
                            onChange={handleSelectAllClick}
                            inputProps={{
                              'aria-label': 'select all desserts',
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>Título/Parcela</StyledTableCell>
                        <StyledTableCell>Empresa</StyledTableCell>
                        <StyledTableCell>Credor</StyledTableCell>
                        <StyledTableCell>Documento</StyledTableCell>
                        <StyledTableCell>Emissão</StyledTableCell>
                        <StyledTableCell>Vencimento</StyledTableCell>
                        <StyledTableCell>Retenção</StyledTableCell>
                        <StyledTableCell>Valor Líq.</StyledTableCell>
                        <StyledTableCell align="right">Status</StyledTableCell>
                        <StyledTableCell align="right">Ações</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                      ).map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                onClick={(event) => handleSelectRow(event, row)}
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row?.nuTitulo + '/' + row?.quantidadeParcela}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row?.empresa?.siengeId + ' - ' + row?.empresa?.name}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row?.credor?.siengeId + ' - ' + row?.credor?.name}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.cdDocumento + " - " + row.nuDocumento}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {format(new Date(row?.dtEmissao), 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {
                                format(new Date(row?.dtVencimento), 'dd/MM/yyyy') + " - " + (Math.floor((new Date(row.dtVencimento).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) < 0 ? '(' + Math.floor((new Date(row.dtVencimento).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + ')' : Math.floor((new Date(row.dtVencimento).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) + " dias"
                              }
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row?.retencao)}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row?.vlLiquido)}
                            </TableCell>
                            <TableCell align="right">
                              {
                                (() => {
                                  switch (row.situation) {
                                    case "Antecipado":
                                      return <Tooltip title={row.situation}><img src={checkIcon.src} /></Tooltip>;
                                    case "Cancelado":
                                      return <Tooltip title={row.situation}><img src={errorIcon.src} /></Tooltip>;
                                    case "Reprovado":
                                      return <Tooltip title={row.situation}><img src={blockIcon.src} /></Tooltip>;
                                    case "Pendente":
                                      return <Tooltip title={row.situation}><img src={pendingIcon.src} /></Tooltip>;
                                    case "Solicitado Antecipação":
                                      return <Tooltip title={row.situation}><img src={requestIcon.src} /></Tooltip>;
                                    case "Não processado":
                                      return <Tooltip title={row.situation}><img src={notProcess.src} /></Tooltip>;
                                    case "Não foi possivel baixar o titulo":
                                      return <Tooltip title={row.situation}><img src={notProcessDown.src} /></Tooltip>;                                   
                                    default:
                                      return <DivSituation><TextSituation>{row.situation}</TextSituation></DivSituation>;
                                  }
                                })()
                              }
                            </TableCell>
                            <TableCell align="right">
                              <Button aria-label="edit" style={{ backgroundColor: '#D4E9EE', minWidth: '32px' }} onClick={handleOpenOptionsPerson(index, row)}>
                                <DotsThreeOutlineVertical style={{ color: '#246776' }} size={20} />
                              </Button>
                              <Menu
                                id="menu-appbar"
                                anchorEl={anchorElCredores}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                                }}
                                open={Boolean(anchorElCredores) && index === openIndex}
                                onClose={handleCloseCredoresMenu}
                              >
                                {settings.map((setting) => {
                                  if (setting.type === 'search') {
                                    // Não renderizar "Adicionar" e "Buscar"
                                    return null;
                                  }

                                  // Renderizar sempre os menus que não dependem do status
                                  if (setting.type === 'view') {
                                    return (
                                      <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting.type, row)}>
                                        <Typography textAlign="center">{setting.name}</Typography>
                                      </MenuItem>
                                    );
                                  }
                                  
                                  if(row.situation === "Solicitado Antecipação"){
                                    return (
                                      <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting.type, row)}>
                                        <Typography textAlign="center">{setting.name}</Typography>
                                      </MenuItem>
                                    );
                                  }
                                  // Renderizar null para outros tipos de menu não especificados acima
                                  return null;
                                })}

                              </Menu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>

                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  labelRowsPerPage="Registros por página"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                  style={{ width: '100%', marginLeft: 'auto' }}
                />
                <Modal
                  open={open}
                  onClose={handleClose}
                >
                  <Box sx={style}>
                    <form>
                      <input type="hidden" {...register("id")} />
                      <HeaderModal>
                        <span>{nameModal}</span>
                        <button style={{ backgroundColor: 'transparent', border: 0, lineHeight: 1, cursor: 'pointer', }} onClick={handleClose}>
                          <XCircle style={{ color: "#B1B1B1" }} size={20} />
                        </button>
                      </HeaderModal>
                      <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0, }} />
                      <ContentModal>
                        {
                          changeTypeModal === 'create' || changeTypeModal === 'update' || changeTypeModal === 'view' ? (
                            <CredoresUpdateOrCreate>
                              <Label size={"20"}>
                                <Text>Titulo</Text>
                                <input style={inputStyle} min="0"  {...register("title")} type="number" disabled={true} />
                                {errors.title && (
                                  <span>   {errors.title.message} </span>
                                )}
                              </Label>
                              <Label size={"40"}>
                                <Text>Empresa</Text>
                                <input style={inputStyle} {...register("company")} disabled={true} />
                                {errors.company && (
                                  <span>   {errors.company.message} </span>
                                )}
                              </Label>
                              <Label size={"35"}>
                                <Text>Credor</Text>
                                <input style={inputStyle} {...register("creditor")} disabled={true} />
                                {errors.creditor && (
                                  <span>{errors.creditor.message} </span>
                                )}
                              </Label>
                              <Label size={"35"}>
                                <Text>Documento</Text>
                                <input style={inputStyle} {...register("document")} disabled={true} />
                                {errors.document && (
                                  <span>   {errors.document.message} </span>
                                )}
                              </Label>
                              <Label size={"20"}>
                                <Text>Data de emissão</Text>
                                <input style={inputStyle} {...register("dateIssue")} disabled={true} />
                                {errors.dateIssue && (
                                  <span>   {errors.dateIssue.message} </span>
                                )}
                              </Label>
                              <Label size={"20"}>
                                <Text>Data de Vencimento</Text>
                                <input style={inputStyle} {...register("dueDate")} disabled={true} />
                                {errors.dueDate && (
                                  <span>   {errors.dueDate.message} </span>
                                )}
                              </Label>
                              <Label size={"20"}>
                                <Text>Dias para vencimento</Text>
                                <input style={inputStyle} {...register("dueDays")} disabled={true} />
                                {errors.dueDays && (
                                  <span>   {errors.dueDays.message} </span>
                                )}
                              </Label>
                              <Label size={"25"}>
                                <Text>Retenção</Text>
                                <input style={inputStyle} {...register("retention")} disabled={true} />
                                {errors.retention && (
                                  <span>{errors.retention.message} </span>
                                )}
                              </Label>
                              <Label style={{ marginRight: "auto", marginLeft: "15px" }} size={"25"}>
                                <Text>Valor líquido</Text>
                                <input style={inputStyle} {...register("netValue")} disabled={true} />
                                {errors.netValue && (
                                  <span>   {errors.netValue.message} </span>
                                )}
                              </Label>
                              <Label size={"45"}>
                                <Text>Status</Text>
                                <input style={inputStyle} {...register("status")} disabled={true} />
                                {errors.status && (
                                  <span>   {errors.status.message} </span>
                                )}
                              </Label>
                              <Label size={"100"}>
                                <Text>Observação</Text>
                                <textarea style={inputStyle} {...register("obs")} disabled={true} />
                                {errors.obs && (
                                  <span>{errors.obs.message} </span>
                                )}
                              </Label>

                            </CredoresUpdateOrCreate>
                          ) :
                            (changeTypeModal === 'importFile' ?
                              <CredoresSearch>
                                 <div style={{width: "100%"}}>
                                    <div {...getRootProps()} style={dropzoneStyle}>
                                      <input {...getInputProps()} />
                                      <p>Arraste e solte um arquivo CSV ou XLSX aqui, ou clique para selecionar um arquivo.</p>
                                    </div>

                                    <div>
                                        {jsonData && acceptedFiles.length <= 1 && (                                       
                                          <p style={{marginTop: "2vh"}} >{files}</p>                                                                            
                                        )}
                                        {
                                          errorExcel?.map((error: Error, i: number) => {
                                            return <p style={{color: "#ff0000", marginTop: "2vh"}} key={i}>*{error.message}</p>
                                          })
                                        }    
                                      </div>
                                  </div>
                              </CredoresSearch>
                              : (changeTypeModal === 'exportFile' ? 
                                <>
                                  <RiskWithdrawnExport>
                                    <Label size={"50"}>
                                      <Text>Qual o Fidc que você quer enviar os títulos ?<span style={{ color: "$red500" }}>*</span></Text>

                                      <select style={inputStyle} defaultValue={selectedFidc} onChange={(e) => setSelectedFidc(e.target.value)}>
                                        <option value="0" selected>Selecione o fidc</option>
                                        {
                                          fidcs.map(fidc => {
                                            return <option key={fidc.fidcId} value={fidc.fidcId}>{fidc.name}</option>
                                          })
                                        }
                                      </select>

                                      {hasFidc && (
                                        <span>Este campo é obrigatório</span>
                                      )}
                                    </Label>
                                  </RiskWithdrawnExport>
                                </>
                              :( changeTypeModal === 'modelFile' ? 
                                <>
                                  <RiskWithdrawnExport>                                                 
                                    <GradientButton title="Modelo Importação" onClick={() => handleDownloadModel()} styleColors="db2Gradient" size="30" />                                    
                                    <hr style={{margin: "8px 0 8px"}}/>
                                    <Title>
                                      Glossário
                                    </Title>
                                    <ListGlossary>
                                      <div style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
                                        <img src={checkIcon.src} />
                                        <Text>1 - Antecipado</Text>
                                      </div>
                                      <div style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
                                        <img src={errorIcon.src} />
                                        <Text>2 - Cancelado</Text>
                                      </div>
                                      <div style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
                                        <img src={blockIcon.src} />
                                        <Text>3 - Reprovado </Text>
                                      </div>
                                      <div style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
                                        <img src={pendingIcon.src} />
                                        <Text>4 - Pendente</Text>
                                      </div>
                                    </ListGlossary>
                                  </RiskWithdrawnExport>
                                </>
                                :
                                  (changeTypeModal === 'statusAnticipate' ? 
                                      <> 
                                        <CredoresSearch>
                                          <Label size={"50"}>
                                            <Text>Fornecedor <span>*</span></Text>
                                            <input style={inputStyle} value={provider} disabled onChange={(e) => setProvider(e.target.value)} />
                                            {hasProvider === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"45"}>
                                            <Text>Fornecedor CNPJ <span>*</span></Text>
                                            <input style={inputStyle} value={providerCnpj} disabled onChange={(e) => setProviderCnpj(e.target.value)} />
                                            {hasProviderCnpj === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"50"}>
                                            <Text>FIDC <span>*</span></Text>
                                            <input style={inputStyle} value={fidcImport} onChange={(e) => setFidcImport(e.target.value)} />
                                            {hasFidcImport === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"45"}>
                                            <Text>FIDC CNPJ <span>*</span></Text>
                                            <input style={inputStyle} value={fidcCnpjImport} onChange={(e) => setFidcCnpjImport(e.target.value)} />
                                            {hasFidcCnpjImport === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"50"}>
                                            <Text>N Documento <span>*</span></Text>
                                            <input style={inputStyle} disabled value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />
                                            {hasDocumentNumber === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"45"}>
                                            <Text>Id no ERP <span>*</span></Text>
                                            <input style={inputStyle} disabled value={idErp} onChange={(e) => setIdErp(e.target.value)} />
                                            {hasIdErp === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"50"}>
                                            <Text>Previsão de pagamento <span>*</span></Text>
                                            <input type="date" style={inputStyle} value={paymentForecast} onChange={(e) => setPaymentForecast(e.target.value)} />
                                            {hasPaymentForecast === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"45"}>
                                            <Text>Data de Antecipação <span>*</span></Text>
                                            <input type="date" style={inputStyle} value={dateAnticipation} onChange={(e) => setDateAnticipation(e.target.value)} />
                                            {hasDateAnticipation === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"50"}>
                                            <Text>Vencimento Original <span>*</span></Text>
                                            <input style={inputStyle} disabled value={originalDueDate} onChange={(e) => setOriginalDueDate(e.target.value)} />
                                            {hasOriginalDueDate === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"45"}>
                                            <Text>Taxa Efetiva <span>*</span></Text>
                                            <input style={inputStyle} value={effectiveRate} onChange={(e) => setEffectiveRate(e.target.value)} />
                                            {hasEffectiveRate === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"50"}>
                                            <Text>Valor Original <span>*</span></Text>
                                            <input style={inputStyle} disabled value={originalValue} onChange={(e) => setOriginalValue(e.target.value)} />
                                            {hasOriginalValue === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"45"}>
                                            <Text>Desconto <span>*</span></Text>
                                            <input style={inputStyle} value={discount} onChange={(e) => setDiscount(e.target.value)} />
                                            {hasDiscount === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"50"}>
                                            <Text>Valor Antecipado <span>*</span></Text>
                                            <input style={inputStyle} value={advanceValue} onChange={(e) => setAdvanceValue(e.target.value)} />
                                            {hasAdvanceValue === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"45"}>
                                            <Text>Juros <span>*</span></Text>
                                            <input style={inputStyle} value={fees} onChange={(e) => setFees(e.target.value)} />
                                            {hasFees === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"50"}>
                                            <Text>Taxa <span>*</span></Text>
                                            <input style={inputStyle} value={rate} onChange={(e) => setRate(e.target.value)} />
                                            {hasRate === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                          <Label size={"100"}>
                                            <Text>Observação <span>*</span></Text>
                                            <textarea style={inputStyle} value={observation} onChange={(e) => setObservation(e.target.value)} />
                                            {hasObservation === false && (
                                              <span>Preencha este campo para cancelar.</span>
                                            )}
                                          </Label>
                                        </CredoresSearch>
                                      </>
                                    :
                                    (changeTypeModal === 'statusCancel' ? 
                                        <>
                                          <CredoresSearch>
                                            <Label size={"100"}>
                                              <Text>Motivo do cancelamento <span>*</span></Text>
                                              <textarea style={inputStyle} value={obsCancel} onChange={(e) => setObsCancel(e.target.value)} />
                                              {hasObsCancel === false && (
                                                <span>Preencha este campo para cancelar.</span>
                                              )}
                                            </Label>
                                          </CredoresSearch>
                                        </>
                                      :
                                      (changeTypeModal === 'statusFail' ? 
                                        <>
                                          <CredoresSearch>
                                            <Label size={"100"}>
                                              <Text>Motivo da reprovação <span>*</span></Text>
                                              <textarea style={inputStyle} value={obsFail} onChange={(e) => setObsFail(e.target.value)} />
                                              {hasObsFail === false && (
                                                <span>Preencha este campo para Reprovar.</span>
                                              )}
                                            </Label>
                                          </CredoresSearch>
                                        </>
                                        :
                                        (changeTypeModal === 'statusPending' ? 
                                          <>
                                            <CredoresSearch>
                                              <Label size={"100"}>
                                                <Text>Motivo do pendente <span>*</span></Text>
                                                <textarea style={inputStyle} value={obsPending} onChange={(e) => setObsPending(e.target.value)} />
                                                {hasObsPending === false && (
                                                  <span>Preencha este campo para Pendente.</span>
                                                )}
                                              </Label>
                                            </CredoresSearch>                                          
                                          </>
                                        :
                                          <CredoresSearch>
                                            <Label size={"45"}>
                                              <Text>Vencimento Inicial</Text>
                                              <input type="date" style={inputStyle} disabled={!!searcBills} value={searcDateInitial} onChange={(e) => setSearcDateInitial(e.target.value)} />
                                            </Label>

                                            <Label size={"50"}>
                                              <Text>Vencimento Final</Text>
                                              <input type="date" style={inputStyle} min={searcDateInitial} disabled={!searcDateInitial || !!searcBills} value={searcDateFinal} onChange={(e) => setSearcDateFinal(e.target.value)} />
                                            </Label>

                                            <Label size={"45"}>
                                              <Text>Titulo</Text>
                                              <input style={inputStyle} value={searcBills} onChange={(e) => setSearcBills(e.target.value)} />
                                            </Label>

                                            <Label size={"50"}>
                                              <Text>Empresa</Text>
                                              <input style={inputStyle} disabled={!!searcBills} value={searcEnterprises} onChange={(e) => setSearcEnterprises(e.target.value)} />
                                            </Label>

                                            <Label size={"45"}>
                                              <Text>Credores</Text>
                                              <input style={inputStyle} disabled={!!searcBills} value={searcCreditors} onChange={(e) => setSearcCreditors(e.target.value)} />
                                            </Label>

                                            <Label size={"50"}>
                                              <Text>Documento</Text>
                                              <select style={inputStyle} disabled={!!searcBills} value={searchDocument} onChange={(e) => setSearchDocument(e.target.value)}>
                                                <option value="0" selected>Documento</option>
                                                {
                                                  document.map(document => {
                                                    return <option key={document.name} value={document.name}>{document.name}</option>
                                                  })
                                                }
                                              </select>
                                            </Label>

                                            <Label size={"45"}>
                                              <Text>Status</Text>
                                              <select style={inputStyle} disabled={!!searcBills} value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                                                <option value="">Status</option>
                                                <option value="Todos">Todos</option>
                                                <option value="Antecipado">Antecipado</option>
                                                <option value="Cancelado">Cancelado</option>
                                                <option value="Reprovado">Reprovado</option>
                                                <option value="Pendente">Pendente</option>
                                                <option value="Solicitado Antecipação">Solicitado Antecipação</option>
                                                <option value="Não processado">Não processado</option>
                                                <option value="Não foi possivel baixar o titulo">Não foi possivel baixar o titulo</option>
                                              </select>
                                            </Label>
                                          </CredoresSearch>
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                        }


                      </ContentModal>
                      {
                        (changeTypeModal === 'search' ?
                        <>
                          <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0, }} />
                          <FooterModal>
                            <SimpleButton title="Cancelar" onClick={handleClose} styleColors="gray" />
                            {
                              <SimpleButton
                                title='Buscar'
                                styleColors="db2"
                                onClick={handleSearchUsers}
                                type="button"
                              />
                            }
                          </FooterModal>
                        </> :
                        (changeTypeModal === 'exportFile' ?
                          <>
                            <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0, }} />
                            <FooterModal>
                              <SimpleButton title="Cancelar" onClick={handleClose} styleColors="gray" />
                              {
                                <SimpleButton
                                  title='Gerar arquivos'
                                  styleColors="db2"
                                  onClick={handleGenerateExcel}
                                  type="button"
                                />
                              }
                            </FooterModal>
                          </>
                         : ( changeTypeModal === 'modelFile' ? 
                            <>
                              <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0, }} />
                              <FooterModal>
                                <SimpleButton title="Cancelar" onClick={handleClose} styleColors="gray" />                               
                              </FooterModal>
                            </>
                         : (changeTypeModal === 'statusAnticipate' ? 
                              <>
                                <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0, }} />
                                <FooterModal>
                                  <SimpleButton title="Cancelar" onClick={handleClose} styleColors="gray" />
                                  {
                                    <SimpleButton
                                      title='Antecipar'
                                      styleColors="db2"
                                      onClick={handleChangeStatus}
                                      type="button"
                                    />
                                  }
                                </FooterModal>
                              </>
                            :
                            (changeTypeModal === 'statusCancel' ? 
                                <>
                                 <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0, }} />
                                  <FooterModal>
                                    <SimpleButton title="Cancelar" onClick={handleClose} styleColors="gray" />
                                    {
                                      <SimpleButton
                                        title='Realizar cancelamento'
                                        styleColors="db2"
                                        onClick={handleChangeStatus}
                                        type="button"
                                      />
                                    }
                                  </FooterModal>
                                </>
                              :
                              (changeTypeModal === 'statusFail' ? 
                                  <>
                                    <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0, }} />
                                    <FooterModal>
                                      <SimpleButton title="Cancelar" onClick={handleClose} styleColors="gray" />
                                      {
                                        <SimpleButton
                                          title='Reprovar'
                                          styleColors="db2"
                                          onClick={handleChangeStatus}
                                          type="button"
                                        />
                                      }
                                    </FooterModal>
                                  </>
                                :
                                (changeTypeModal === 'statusPending' ? 
                                  <>
                                    <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0, }} />
                                    <FooterModal>
                                      <SimpleButton title="Cancelar" onClick={handleClose} styleColors="gray" />
                                      {
                                        <SimpleButton
                                          title='Marcar como pendente'
                                          styleColors="db2"
                                          onClick={handleChangeStatus}
                                          type="button"
                                        />
                                      }
                                    </FooterModal>
                                  </>
                                :  (changeTypeModal === 'view' ? 
                                      <></>
                                  :
                                  <>
                                    <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0, }} />
                                    <FooterModal>
                                      <SimpleButton title="Cancelar" onClick={handleClose} styleColors="gray" />
                                      {
                                        <SimpleButton
                                          title='Importar'
                                          styleColors="db2"
                                          onClick={handleImportExcel}
                                          type="button"
                                        />
                                      }
                                    </FooterModal>
                                  </>
                                  )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                      }
                    </form>
                  </Box>
                </Modal>
              </BoxContent>
            </Container>
            <ToastContainer />
          </Layout>
          :
          <Layout>
            <ContainerMessage>
              <WelcomeMessage>Desculpe, você não possui permissão de acesso a este módulo.</WelcomeMessage>
              <SystemObjective>
                Lamentamos informar que você não tem as permissões necessárias para acessar esta página. Caso acredite que deveria ter acesso, por favor, entre em contato com o suporte técnico ou o administrador do sistema para resolvermos essa questão. Agradecemos sua compreensão e paciência.
              </SystemObjective>
            </ContainerMessage>
          </Layout>
      }
    </>
  )
}

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};


export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {}
  }
})
