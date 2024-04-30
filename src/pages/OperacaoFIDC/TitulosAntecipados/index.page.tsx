import Layout from "../../../components/Layout/index.page";
import * as React from 'react';
import { ActionsHeader, BoxButtons, BoxContent, Container, ContainerMessage, ContentModal, CredoresSearch, CredoresUpdateOrCreate, FooterModal, Header, HeaderModal, Label, LoadingScreen, Text, TitleBox, WelcomeMessage } from "./styles";
import { DefaultButton } from "@/components/DefaultButton";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { useForm } from "react-hook-form"
import { setupAPIClient } from "@/services/api";
import { styled, useTheme } from '@mui/material/styles';
import { Table, Button, TableRow, TableHead, TableContainer, TableCell, TableBody, tableCellClasses, Box, IconButton, TableFooter, TablePagination, Modal, Typography, Menu, MenuItem, Input, FormControlLabel, Checkbox, Switch, Tooltip, CircularProgress } from "@mui/material";
import { ArrowLineLeft, ArrowLineRight, CaretLeft, CaretRight, DotsThreeOutlineVertical, Minus, X, XCircle } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { SimpleButton } from "@/components/SimpleButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from 'react-select';

import checkIcon from '../../../assets/checkIcon.svg'
import pendingIcon from '../../../assets/pendingIcon.svg'
import errorIcon from '../../../assets/errorIcon.svg'
import blockIcon from '../../../assets/blockIcon.svg'
import requestIcon from '../../../assets/requestIcon.svg'
import notProcess from '../../../assets/notProcess.svg'
import downIcon from '../../../assets/downIcon.svg'

import { Title } from "@/components/DefaultButton/styles";
import { AuthContext } from "@/contexts/AuthContext";
import { SystemObjective } from "../../Home/styles";
import { api } from "@/services/apiClient";
import { format } from "date-fns";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from "next/router";

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

const buttonStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '5px',
  padding: '2px 5px',
  border: '0px',
  cursor: 'pointer',
  background: 'transparent'
}

const CredoresFormSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  tituloFIDCId: z.string(),
  empresaCompleta: z.string(),
  credorOriginal: z.string(),
  creditor: z.string(),
  document: z.string(),
  dateIssue: z.string(),
  dueDate: z.string(),
  dueDays: z.string(),
  netValue: z.string(),
  vlLiquido: z.string(),
  taxas: z.string(),
  juros: z.string(),
  taxaEfetiva: z.string(),
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


type createDataProps = {
  id?: number;
  nuTitulo?: number;
  cdDocumento?: string;
  nuDocumento?: string;
  dtEmissao?: string;
  dtVencimento?: string;
  vlLiquido?: number;
  taxas?: number;
  juros?: number;
  taxaEfetiva?: number;
  tituloFIDCId?: number;
  nuTituloFidc?: number;
  situation?: string;
  empresaCompleta?: {
    id?: number;
    siengeId?: number;
    name?: string;
    cnpj?: string;
    tradeName?: string;
  };
  credor?: {
    id?: number;
    credorSiengeId?: number;
    name?: string;
    tradeName?: string;
    cpf?: string;
    cnpj?: string;
    supplier?: string;
    broker?: string;
    employee?: string;
    stateRegistrationNumber?: string;
    stateRegistrationType?: string;
    situacaoDocumento?: boolean;
    isDeleted?: boolean;
    isActive?: boolean;
  };
  credorOriginal?: {
    id?: number;
    siengeId?: number;
    name?: string;
    tradeName: string;
    cpf?: string;
    cnpj?: string;
    supplier?: string;
    broker?: string;
    employee?: string;
    stateRegistrationNumber?: string;
    stateRegistrationType?: string;
    situacaoDocumento?: boolean;
    isDeleted?: boolean;
    isActive?: boolean;
  };
};


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

export default function Pagamentos(props: EnhancedTableProps) {
  const [loadingAction, setLoadingAction] = useState(false);
  //States
  const { onSelectAllClick, numSelected, rowCount } = props;
  const [rows, setRows] = useState<createDataProps[]>([]);
  const [rowView, setRowView] = useState<processDtoProps>();
  const [rowsProcessPayment, setRowsProcessPayment] = useState<processDtoProps[]>([]);
  const { user } = React.useContext(AuthContext);
  const [userFull, setUserFull] = useState<userAccessProps>({} as userAccessProps);
  const [formatPayment, setFormatPayment] = useState<createDataProps>();
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
  const [changeTypeModal, setChangeTypeModal] = useState('');
  const [selectedRows, setSelectedRows] = useState<createDataProps[]>([]);
  const [selected, setSelected] = useState<readonly number[]>([]);
  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const [buttonRemoveFilters, setButtonRemoveFilters] = useState(false);
  const [searcDateInitial, setSearcDateInitial] = useState("");
  const [searcDateFinal, setSearcDateFinal] = useState("");
  const [searcBills, setSearcBills] = useState("");
  const [searcEnterprises, setSearcEnterprises] = useState(null);
  const [searcCreditors, setSearcCreditors] = useState(null);
  const [searcFidc, setSearcFidc] = useState("");
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


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const emptyRowsProcess = pageProcess > 0 ? Math.max(0, (1 + pageProcess) * rowsPerPageProcess - rowsProcessPayment.length) : 0;
  const { register, handleSubmit, formState, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<CredoresFormData>({
    resolver: zodResolver(CredoresFormSchema)
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetInputs();
    if (changeTypeModal === "processPayment") {
      fetchPagamentos();
    }
    setRowsProcessPayment([]);
    setSelectedRows([]);
    setSelected([]);
    setOpen(false);
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
    console.log(searcEnterprises, searcFidc, searcCreditors, searcBills, searcDateInitial, searcDateFinal, searchStatus, searchDocument, searchPayment)
    setLoadingAction(true);
    if (searcDateInitial || searcDateFinal || searcBills || searcEnterprises || searcCreditors || searchStatus || searchDocument || searcFidc) {
      await api.get(`/api/Fidc/SearchNewTitlesFidc?${searcDateInitial && "&VencimentoInicial=" + searcDateInitial}${searcDateFinal && "&VencimentoFinal=" + searcDateFinal}${searcBills && '&Titulo=' + searcBills}${searcEnterprises && '&Empresa='+searcEnterprises}${searcCreditors && '&Credor=' + searcCreditors}${searchDocument && '&Documento=' + searchDocument}${searchStatus && '&Status=' + searchStatus}${searcFidc && '&Fidc=' + searcFidc}`)
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

  const handleRedirectCredores = (row: createDataProps, setting: string) => {
    setAnchorElCredores(null);
  };

  const handleOpenOptionsPerson = (index: number, row: createDataProps) => (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCredores(event.currentTarget);
    setOpenIndex(index);
  }

  async function handleOpenModalOrActivateAction(typeModal: 'view' | 'create' | 'update' | 'search' | 'disable' | 'delete' | 'reactivate' | 'restore' | 'processPayment', row?: createDataProps) {
    setLoadingAction(true);
    setChangeTypeModal(typeModal);
    const targetDate = new Date(row?.dtVencimento);
    const currentDate = new Date();
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    if (typeModal === 'view') {
      await api.get(`/api/Fidc/SearchNewTitlesFidc?Titulo=${row.nuTitulo}`)
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
        id: row?.id, tituloFIDCId: row?.tituloFIDCId.toString(), creditor: row?.credor.credorSiengeId.toString() + " - " + row.credor.name, title: row?.nuTitulo.toString(), empresaCompleta: row?.empresaCompleta.siengeId.toString() + ' - ' + row?.empresaCompleta.name, credorOriginal: row?.credorOriginal.siengeId.toString() + " - " + row.credorOriginal.name, document: row?.cdDocumento + " - " + row?.nuDocumento, dateIssue: format(new Date(row?.dtEmissao), 'dd/MM/yyyy'), dueDate: format(new Date(row?.dtVencimento), 'dd/MM/yyyy'), dueDays: daysDifference.toString(),
        vlLiquido: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row?.vlLiquido), taxas: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row?.taxas), juros: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row?.juros), taxaEfetiva: row?.taxaEfetiva,
      });
      setOpen(true);
    } else if (typeModal === 'search') {
      setNameModal('Busca avançada')
      setOpen(true);
      setLoadingAction(false);
    } else if (typeModal === 'processPayment') {
      if (selectedRows.length > 0) {
        setNameModal('Pagamentos processados');
        setRowsProcessPayment([]);
        setOpen(true);
        const processTitles = selectedRows.map((n) => n.nuTitulo.toString());
        console.log(processTitles);
        await api.post(`/api/Pagamento/ProcessarPagamento`, processTitles)
          .then(response => {
            setRowsProcessPayment(response.data);
          })
          .catch(() => {
            setOpen(false);
            toast.error(`Ocorreu um erro com a solicitação de antecipação.`, {
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
    } else {
      setLoadingAction(false);
      console.log('Algo deu errado')
    }
  }

  function resetInputs() {
    reset({ id: 0, title: '', company: '', creditor: "", document: "", dateIssue: "", dueDate: "", dueDays: "",  netValue: "", status: "" });
  }

  async function fetchPagamentos() {
    setLoadingAction(true);
    await api.get(`/api/Fidc/GetAllNewTitlesFidc`)
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

  useEffect(() => {
    fetchPagamentos();
    fetchGetDocument();
  }, [])

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      resetInputs()
    }
  }, [formState, isSubmitSuccessful, reset])

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
                <DefaultButton subTitle="clique aqui para conferir dashboard's" disabled onClick={() => handleOpenModalOrActivateAction("create")} title="Dashboard" typeIcon="add" />
                <DefaultButton subTitle="clique aqui para conferir relatórios completos" disabled title="Relatórios" typeIcon="reports" />
              </BoxButtons>
              <BoxContent>
                <Header>
                  <TitleBox>
                    <button onClick={() => Router.push("/OperacaoFIDC")} style={buttonStyle}><CaretLeft size={20} /></button>
                    <span>Titulos Antecipados</span>
                  </TitleBox>
                  <ActionsHeader>
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
                        <StyledTableCell>Título Original</StyledTableCell>
                        <StyledTableCell>Credor Original</StyledTableCell>
                        <StyledTableCell>Título Fidc</StyledTableCell>
                        <StyledTableCell>Fidc</StyledTableCell>
                        <StyledTableCell>Empresa</StyledTableCell>
                        <StyledTableCell>Documento</StyledTableCell>
                        <StyledTableCell>Vencimento</StyledTableCell>
                        <StyledTableCell>Valor Líq.</StyledTableCell>
                        <StyledTableCell>Taxas</StyledTableCell>
                        <StyledTableCell>Juros</StyledTableCell>
                        <StyledTableCell>Taxa Efetiva</StyledTableCell>
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

                            <TableCell component="th" scope="row">
                              {row?.nuTituloFidc}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row?.credorOriginal?.siengeId + ' - ' + row?.credorOriginal?.name}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row?.nuTitulo}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row?.credor?.credorSiengeId + ' - ' + row?.credor?.name}
                            </TableCell>

                            <TableCell component="th" scope="row">
                              {row?.empresaCompleta?.siengeId + ' - ' + row?.empresaCompleta?.name}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.cdDocumento + " - " + row.nuDocumento}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {
                                format(new Date(row?.dtVencimento), 'dd/MM/yyyy') + " - " + (Math.floor((new Date(row.dtVencimento).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) < 0 ? '(' + Math.floor((new Date(row.dtVencimento).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + ')' : Math.floor((new Date(row.dtVencimento).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) + " dias"
                              }
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row?.vlLiquido)}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row?.taxas)}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row?.juros)}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row?.taxaEfetiva}
                            </TableCell>
                            <TableCell align="right">
                              {
                                (() => {
                                  switch (row.situation) {
                                    case "Aguardando baixa":
                                      return <Tooltip title={row.situation}><img src={pendingIcon.src} /></Tooltip>;
                                    case "Aguardando Pagamento":
                                      return <Tooltip title={row.situation}><img src={requestIcon.src} /></Tooltip>;
                                    case "Não foi possivel baixar o titulo":
                                      return <Tooltip title={row.situation}><img src={blockIcon.src} /></Tooltip>;
                                    case "Processo concluido":
                                      return <Tooltip title={row.situation}><img src={checkIcon.src} /></Tooltip>;
                                    case "Não foi possível realizar a movimentação bancaria":
                                      return <Tooltip title={row.situation}><img src={errorIcon.src} /></Tooltip>;
                                    case "Baixado":
                                      return <Tooltip title={row.situation}><img src={downIcon.src} /></Tooltip>;                                    
                                    default:
                                      return <Tooltip title={row.situation}><img src={pendingIcon.src} /></Tooltip>;
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
                                <Text>Titulo Original</Text>
                                <input style={inputStyle} min="0"  {...register("tituloFIDCId")} type="number" disabled={true} />
                                {errors.tituloFIDCId && (
                                  <span>   {errors.tituloFIDCId.message} </span>
                                )}
                              </Label>
                              <Label size={"35"}>
                                <Text>FIDC</Text>
                                <input style={inputStyle} {...register("creditor")} disabled={true} />
                                {errors.creditor && (
                                  <span>{errors.creditor.message} </span>
                                )}
                              </Label>
                              <Label size={"20"}>
                                <Text>Titulo Fidc</Text>
                                <input style={inputStyle} min="0"  {...register("title")} type="number" disabled={true} />
                                {errors.title && (
                                  <span>   {errors.title.message} </span>
                                )}
                              </Label>
                              <Label size={"35"}>
                                <Text>Credor Original</Text>
                                <input style={inputStyle} {...register("credorOriginal")} disabled={true} />
                                {errors.credorOriginal && (
                                  <span>{errors.credorOriginal.message} </span>
                                )}
                              </Label>
                              <Label size={"40"}>
                                <Text>Empresa</Text>
                                <input style={inputStyle} {...register("empresaCompleta")} disabled={true} />
                                {errors.empresaCompleta && (
                                  <span>   {errors.empresaCompleta.message} </span>
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
                              <Label style={{ marginRight: "auto", marginLeft: "15px" }} size={"25"}>
                                <Text>Valor líquido</Text>
                                <input style={inputStyle} {...register("vlLiquido")} disabled={true} />
                                {errors.vlLiquido && (
                                  <span>   {errors.vlLiquido.message} </span>
                                )}
                              </Label>
                              <Label size={"20"}>
                                <Text>Taxas</Text>
                                <input style={inputStyle} {...register("taxas")} disabled={true} />
                                {errors.taxas && (
                                  <span>   {errors.taxas.message} </span>
                                )}
                              </Label>
                              <Label size={"20"}>
                                <Text>Taxas</Text>
                                <input style={inputStyle} {...register("taxas")} disabled={true} />
                                {errors.taxas && (
                                  <span>   {errors.taxas.message} </span>
                                )}
                              </Label>
                              <Label size={"20"}>
                                <Text>Juros</Text>
                                <input style={inputStyle} {...register("juros")} disabled={true} />
                                {errors.juros && (
                                  <span>   {errors.juros.message} </span>
                                )}
                              </Label>
                              <Label size={"45"}>
                                <Text>Taxa Efetiva</Text>
                                <input style={inputStyle} {...register("taxaEfetiva")} disabled={true} />
                                {errors.status && (
                                  <span>   {errors.taxaEfetiva.message} </span>
                                )}
                              </Label>

                            </CredoresUpdateOrCreate>
                          ) :
                            (changeTypeModal === 'processPayment' ?
                              <>
                                <TableContainer>
                                  <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                                    <TableHead className="TableHeader">
                                      <TableRow>
                                        <StyledTableCell>Título/Parcela</StyledTableCell>
                                        <StyledTableCell>Empresa</StyledTableCell>
                                        <StyledTableCell>Credor</StyledTableCell>
                                        <StyledTableCell>Vencimento</StyledTableCell>
                                        <StyledTableCell>Valor Líq.</StyledTableCell>
                                        <StyledTableCell>Parcelas integradas</StyledTableCell>
                                        <StyledTableCell align="right">Status</StyledTableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {(rowsPerPageProcess > 0
                                        ? rowsProcessPayment.slice(pageProcess * rowsPerPageProcess, pageProcess * rowsPerPageProcess + rowsPerPageProcess)
                                        : rowsProcessPayment
                                      ).map((row, index) => {
                                        return (
                                          <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.titulo.id}
                                            sx={{ cursor: 'pointer' }}
                                          >
                                            <TableCell component="th" scope="row">
                                              {row.titulo.nuTitulo + '/' + row.titulo.quantidadeParcela}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                              {row?.titulo?.empresa?.siengeId + ' - ' + row?.titulo?.empresa?.name}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                              {row?.titulo?.credor?.siengeId + ' - ' + row?.titulo?.credor?.name}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                              {
                                                format(new Date(row?.titulo?.dtVencimento), 'dd/MM/yyyy') + " - " + Math.floor((new Date(row?.titulo?.dtVencimento).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) + " dias"
                                              }
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row?.titulo.vlLiquido)}
                                            </TableCell>
                                            <TableCell align="right">
                                              {
                                                row && row?.parcelas?.length === row?.titulo?.quantidadeParcela ?
                                                  "Integradas" : "Não integradas"
                                              }
                                            </TableCell>
                                            <TableCell align="right">
                                              {
                                                (() => {
                                                  switch (row?.titulo?.situation) {
                                                    case "Aguardando baixa":
                                                      return <Tooltip title={row?.titulo?.situation}><img src={pendingIcon.src} /></Tooltip>;
                                                    case "Aguardando Pagamento":
                                                      return <Tooltip title={row?.titulo?.situation}><img src={requestIcon.src} /></Tooltip>;
                                                    case "Informações de pagamento não integradas":
                                                      return <Tooltip title={row?.titulo?.situation}><img src={errorIcon.src} /></Tooltip>;
                                                    case "Pendente processamento ou não processado":
                                                      return <Tooltip title={row?.titulo?.situation}><img src={pendingIcon.src} /></Tooltip>;
                                                    default:
                                                      return <Tooltip title={row?.titulo?.situation}><img src={pendingIcon.src} /></Tooltip>;
                                                  }
                                                })()
                                              }
                                            </TableCell>
                                          </TableRow>
                                        )
                                      })}
                                      {emptyRowsProcess > 0 && (
                                        <TableRow style={{ height: 53 * emptyRowsProcess }}>
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
                                  count={rowsProcessPayment.length}
                                  rowsPerPage={rowsPerPageProcess}
                                  page={pageProcess}
                                  labelRowsPerPage="Registros por página"
                                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                                  onPageChange={handleChangePageProcess}
                                  onRowsPerPageChange={handleChangeRowsPerPageProcess}
                                  ActionsComponent={TablePaginationActionsProcess}
                                  style={{ width: '100%', marginLeft: 'auto' }}
                                />
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
                                  <Text>Fidc</Text>
                                  <input style={inputStyle} disabled={!!searcBills} value={searcFidc} onChange={(e) => setSearcFidc(e.target.value)} />
                                </Label>

                                {/* <Label size={"50"}>
                                  <Text>Credor</Text>
                                  <Select styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                    menuPosition={isFixed ? 'fixed' : 'absolute'}
                                    defaultValue={searcCreditors}
                                    onChange={setSearcCreditors}
                                    options={options}
                                  />
                                </Label> */}

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
                                    <option value="Aguardando baixa">Aguardando baixa</option>
                                    <option value="Aguardando Pagamento">Aguardando Pagamento</option>
                                    <option value="Não foi possivel baixar o titulo">Não foi possivel baixar o titulo</option>
                                    <option value="Processo concluido">Processo concluido</option>
                                    <option value="Não foi possível realizar a movimentação bancaria">Não foi possível realizar a movimentação bancaria</option>
                                    <option value="Baixado">Baixado</option>
                                  </select>
                                </Label>
                              </CredoresSearch>
                            )
                        }


                      </ContentModal>
                      {
                        changeTypeModal === 'search' &&
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
                        </>
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


export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {}
  }
})
