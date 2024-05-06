import { withSSRAuth } from "@/utils/withSSRAuth";
import { Controller, useForm } from "react-hook-form"
import { setupAPIClient } from "@/services/api";
import Configuracoes from "../../index.page";
import { ActionsHeader, Container, ContentModal, FooterModal, Header, HeaderModal, Label, Text, TitleBox, FidcUpdateOrCreate, SwitchLabel } from "./styles";
import { styled, useTheme } from '@mui/material/styles';
import { Table, Button, TableRow, TableHead, TableContainer, TableCell, TableBody, tableCellClasses, Box, IconButton, TableFooter, TablePagination, Modal, Typography, Menu, MenuItem, Input, FormControlLabel, Checkbox, Switch } from "@mui/material";
import { ArrowLineLeft, ArrowLineRight, CaretLeft, CaretRight, Check, DotsThreeOutlineVertical, Minus, Rows, X, XCircle } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { SimpleButton } from "@/components/SimpleButton";
import { ZodString, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/services/apiClient";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { normalizeCurrency } from "@/Masks/mask";

const label = { inputProps: { 'aria-label': 'Permitir valor de ultrapassagem ?' } };

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

const FidcFormSchema = z.object({
  fidcId: z.coerce.number(),
  name: z.string().min(1, { message: "Preencha o campo corretamente" }),
  cnpj: z.string().min(1, { message: "Preencha o campo corretamente" }),
  contact: z.string().min(1, { message: "Preencha o campo corretamente" }),
  credorSiengeId: z.string().min(1, { message: "Preencha o campo corretamente" }),
  planoFinanceiroJurosIdFormat: z.string(),
  planoFinanceiroTaxaIdFormat: z.string(),
  PlanoFinanceiroPrincipalIdFormat: z.string().min(1, { message: "Preencha o campo corretamente" }),
  limitValue: z.string().min(1, { message: "Preencha o campo corretamente" }),
  limitValueAcceptable: z.string().min(1, { message: "Preencha o campo corretamente" }),
  permitirUltrapassagem: z.boolean(),
  file: z.any().optional().refine(value => value instanceof FileList && value.length > 0 && value[0].type === 'application/pdf', {
    message: 'Selecione um arquivo PDF',
  }),
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

type planoFinanceiroProps = {
  id: number,
  nome: string,
  codigo: number,
  isDeleted: boolean,
  isActive: boolean
}

type createDataProps = {
  fidcId: number,
  cnpj: string,
  name: string,
  contact: string,
  credorSiengeId: string,
  planoFinanceiroJurosId: number,
  planoFinanceiroTaxaId: number,
  PlanoFinanceiroPrincipalId: number,
  limitValue?: number,
  canExceedLimit?: boolean,
  maxExceededValue?: number,
  fidcDocuments?: {
    id?: number,
    name?: string,
    base64?: string,
    type?: string
  },
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

type settingsProps = {
  name: string,
  type: string,
}

type FidcFormData = z.infer<typeof FidcFormSchema>

export default function Fidc() {
  const [loadingAction, setLoadingAction] = useState(false);
  //States
  const [rows, setRows] = useState<createDataProps[]>([]);
  const [settings, setSettings] = useState<settingsProps[]>([]);
  const [planoFinanceiro, setPlanoFinanceiro] = useState<planoFinanceiroProps[]>([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorElFidc, setAnchorElFidc] = useState<null | HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState(-1);
  const [nameModal, setNameModal] = useState('');
  const [changeTypeModal, setChangeTypeModal] = useState('');
  const [buttonRemoveFilters, setButtonRemoveFilters] = useState(false);
  const [checked, setChecked] = useState(false);
  const [base64, setBase64] = useState(null);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const { register, handleSubmit, formState, watch, control, setValue, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<FidcFormData>({
    resolver: zodResolver(FidcFormSchema)
  });

  const limitWatchValue = watch("limitValue");
  const limitWatchValueAcceptable = watch("limitValueAcceptable");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {    
        setBase64(reader.result);
        console.log(reader.result);
      };
  
      reader.readAsDataURL(file);
    }
  };

  //Functions 
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetInputs();
    setOpen(false);
  }
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleCloseFidcMenu = () => {
    setAnchorElFidc(null);
  };

  const handleRedirectFidc = (row: createDataProps, setting: string) => {
    setAnchorElFidc(null);
  };

  const handleOpenOptionsPerson = (index: number, row: createDataProps) => (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElFidc(event.currentTarget);
    setOpenIndex(index);
  }

  const handleOvertakingPermission = (event) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    setValue('permitirUltrapassagem', newChecked);
  };

  function handleOpenModalOrActivateAction(typeModal: 'view' | 'create' | 'update' | 'disable' | 'delete' | 'reactivate' | 'restore', row?: createDataProps) {
    setChangeTypeModal(typeModal);
    if (typeModal === 'create') {
      setNameModal('Adicionar')
      setOpen(true);
    } else if (typeModal === 'view') {
      console.log(row.PlanoFinanceiroPrincipalId)
      setNameModal('Visualizar')
      reset({ fidcId: row?.fidcId, name: row?.name, cnpj: row?.cnpj, file: row?.fidcDocuments.base64, limitValue: String(row.limitValue), limitValueAcceptable: String(row.maxExceededValue) , permitirUltrapassagem: row.canExceedLimit ,credorSiengeId: row?.credorSiengeId, contact: row?.contact, planoFinanceiroJurosIdFormat: String(row?.planoFinanceiroJuros?.id <= 0 || row?.planoFinanceiroJuros?.id === null || isNaN(row?.planoFinanceiroJuros?.id) ? 0 : row?.planoFinanceiroJuros?.id), planoFinanceiroTaxaIdFormat: String(row?.planoFinanceiroTaxa?.id <= 0 || isNaN(row?.planoFinanceiroTaxa?.id) ? 0 : row?.planoFinanceiroTaxa?.id), PlanoFinanceiroPrincipalIdFormat: String(row?.planoFinanceiroPrincipal.id) });
      setOpen(true);
    } else if (typeModal === 'update') {
      setNameModal('Editar')
      reset({ fidcId: row?.fidcId, name: row?.name, cnpj: row?.cnpj, file: row?.fidcDocuments.base64, limitValue: String(row.limitValue), limitValueAcceptable: String(row.maxExceededValue) , permitirUltrapassagem: row.canExceedLimit ,credorSiengeId: row?.credorSiengeId, contact: row?.contact, planoFinanceiroJurosIdFormat: String(row?.planoFinanceiroJuros?.id <= 0 || row?.planoFinanceiroJuros?.id === null || isNaN(row?.planoFinanceiroJuros?.id) ? 0 : row?.planoFinanceiroJuros?.id), planoFinanceiroTaxaIdFormat: String(row?.planoFinanceiroTaxa?.id <= 0 || isNaN(row?.planoFinanceiroTaxa?.id) ? 0 : row?.planoFinanceiroTaxa?.id), PlanoFinanceiroPrincipalIdFormat: String(row?.planoFinanceiroPrincipal.id) });
      setOpen(true);
    } else if (typeModal === 'delete') {
      api.put(`/api/Fidc/UpdateFIDC/4`, {
        fidcId: row?.fidcId,
        name: "",
        cnpj: "",
        contact: "",
        jwt: "",
        credorSiengeId: row.credorSiengeId,
        planoFinanceiroJurosId: row.planoFinanceiroJurosId,
        planoFinanceiroTaxaId: row.planoFinanceiroTaxaId,
        PlanoFinanceiroPrincipalId: row.PlanoFinanceiroPrincipalId,
        limitValue: row.limitValue,
        canExceedLimit: row.canExceedLimit,
        maxExceededValue: row.maxExceededValue,
        fidcDocuments: row?.fidcDocuments.base64,
        isDeleted: true,
        isActive: false,
      })
        .then((response) => {
          toast.success(`Fidc excluído com sucesso`, {
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
          toast.error(`Não foi possível excluir o fidc, tente novamente mais tarde.`, {
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
          fetchFidc();
        })
      handleCloseFidcMenu();
    } else if (typeModal === 'disable' || typeModal === 'restore') {
      api.put(`/api/Fidc/UpdateFIDC/3`, {
        fidcId: row?.fidcId,
        name: "",
        cnpj: "",
        jwt: "",
        credorSiengeId: row.credorSiengeId,
        planoFinanceiroJurosId: row.planoFinanceiroJurosId,
        planoFinanceiroTaxaId: row.planoFinanceiroTaxaId,
        PlanoFinanceiroPrincipalId: row.PlanoFinanceiroPrincipalId,
        contact: "",
        limitValue: row.limitValue,
        canExceedLimit: row.canExceedLimit,
        maxExceededValue: row.maxExceededValue,
        fidcDocuments: row?.fidcDocuments.base64,
        isDeleted: false,
        isActive: false,
      })
        .then((response) => {
          toast.success(`Fidc ${typeModal === 'disable' ? 'desativado' : 'restaurado'} com sucesso`, {
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
          console.log(row?.fidcId)
          toast.error(`Fidc ${typeModal === 'disable' ? 'desativar' : 'restaurar'} o tipo de documento, tente novamente mais tarde.`, {
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
          fetchFidc();
        })
      handleCloseFidcMenu();
    } else if (typeModal === 'reactivate') {
      api.put(`/api/Fidc/UpdateFIDC/2`, {
        fidcId: row?.fidcId,
        name: "",
        cnpj: "",
        jwt: "",
        credorSiengeId: row.credorSiengeId,
        planoFinanceiroJurosId: row.planoFinanceiroJurosId,
        planoFinanceiroTaxaId: row.planoFinanceiroTaxaId,
        PlanoFinanceiroPrincipalId: row.PlanoFinanceiroPrincipalId,
        limitValue: row.limitValue,
        canExceedLimit: row.canExceedLimit,
        maxExceededValue: row.maxExceededValue,
        fidcDocuments: row?.fidcDocuments.base64,
        contact: "",
        isDeleted: false,
        isActive: true,
      })
        .then((response) => {
          toast.success(`Fidc habilitado com sucesso`, {
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
          toast.error(`Não foi possível habilitar o Fidc, tente novamente mais tarde.`, {
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
          fetchFidc();
        })
      handleCloseFidcMenu();
    } else {
      console.log('Algo deu errado')
    }
  }

  async function handleActionFidc(data: FidcFormData) {
    const { fidcId, name, cnpj, credorSiengeId, jwt, contact, planoFinanceiroJurosIdFormat, planoFinanceiroTaxaIdFormat, PlanoFinanceiroPrincipalIdFormat, file, limitValue, limitValueAcceptable, permitirUltrapassagem } = data;
    if (changeTypeModal === 'create') {
      await api.post(`/api/Fidc/CreateFIDC`, {
        name,
        cnpj,
        contact,
        credorSiengeId,
        planoFinanceiroJurosId: Number(planoFinanceiroJurosIdFormat),
        planoFinanceiroTaxaId: Number(planoFinanceiroTaxaIdFormat),
        PlanoFinanceiroPrincipalId: Number(PlanoFinanceiroPrincipalIdFormat),
        limitValue: limitValue,
        canExceedLimit: permitirUltrapassagem,
        maxExceededValue: limitValueAcceptable,
        fidcDocuments: file,
        jwt: "",
        isDeleted: false,
        isActive: true,
      })
        .then(() => {
          fetchFidc();
          toast.success(`Fidc ${name} adicionado com sucesso`, {
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
        .catch((err) => {
          toast.error(`Não foi possÍvel adicionar o FIDC`, {
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
      handleClose();
    } else if (changeTypeModal === 'update') {
      console.log(fidcId, Number(credorSiengeId), cnpj, name, contact, planoFinanceiroJurosIdFormat, Number(planoFinanceiroTaxaIdFormat), Number(PlanoFinanceiroPrincipalIdFormat), jwt)
      await api.put(`/api/Fidc/UpdateFIDC/1`, {
        fidcId: fidcId,
        credorSiengeId: Number(credorSiengeId),
        cnpj,
        name,
        contact,
        planoFinanceiroJurosId: Number(planoFinanceiroJurosIdFormat),
        planoFinanceiroTaxaId: Number(planoFinanceiroTaxaIdFormat),
        planoFinanceiroPrincipalId: Number(PlanoFinanceiroPrincipalIdFormat),
        limitValue: limitValue,
        canExceedLimit: permitirUltrapassagem,
        maxExceededValue: limitValueAcceptable,
        fidcDocuments: file,
        jwt: "",
        isActive: true,
        isDeleted: true
      })
        .then(() => {
          fetchFidc();
          toast.success(`Fidc ${name} editado com sucesso.`, {
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
        .catch((err) => {
          toast.error(`Não foi possÍvel editar fidc`, {
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
      handleClose()
    }
  }

  function resetInputs() {
    reset({ fidcId: 0, name: '' });
  }

  async function fetchFidc() {
    await api.get(`/api/Fidc/GetAllFIDC`)
      .then(response => {
        console.log(response.data)
        setRows(response.data);
      })
      .catch(() => {
      })    
  }


  function handleRemoveFilters() {
    setButtonRemoveFilters(false);
    fetchFidc();
  }

  async function fetchGetPlanoFinanceiro() {
    setLoadingAction(true);
    await api.get(`/api/Fidc/GetPlanos`)
      .then(response => {
        setPlanoFinanceiro(response.data);
      })
      .catch(() => {
      }).finally(() => {
        setLoadingAction(false);
      });
  }


  useEffect(() => {
    fetchFidc();
    const getSettings = [
      { name: 'Visualizar', type: 'view', },
      { name: 'Editar', type: 'update', },
      { name: 'Desativar', type: 'disable', },
      { name: 'Excluir', type: 'delete', },
      { name: 'Adicionar', type: 'create', },
      { name: 'Habilitar', type: 'reactivate', },
      { name: 'Restaurar', type: 'restore', },
    ]

    setSettings(getSettings);
    fetchGetPlanoFinanceiro();
  }, [])

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      resetInputs()
    }
  }, [formState, isSubmitSuccessful, reset])

  useEffect(() => {
    setValue("limitValue", normalizeCurrency(limitWatchValue))
  },[limitWatchValue])


  useEffect(() => {
    setValue("limitValueAcceptable", normalizeCurrency(limitWatchValueAcceptable))
  },[limitWatchValueAcceptable])

  return (
    <Configuracoes>
      <Container>
        <Header>
          <TitleBox>
            <span>Cadastro FIDC</span>
          </TitleBox>
          <ActionsHeader>
            <GradientButton title="Adicionar" onClick={() => handleOpenModalOrActivateAction("create")} styleColors="db2Gradient" disabled={!(settings.some(setting => setting.type === 'create'))} size="auto" />
            {/* {
              buttonRemoveFilters && (
                <GradientButton title="Remover Filtros" onClick={() => handleRemoveFilters()} styleColors="removeGradient" size="auto" />
              )
            } */}
          </ActionsHeader>
        </Header>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
            <TableHead className="TableHeader">
              <TableRow>
                <StyledTableCell>Nome</StyledTableCell>
                <StyledTableCell>CNPJ</StyledTableCell>
                <StyledTableCell>Numero Credor Sienge</StyledTableCell>
                <StyledTableCell>Contato</StyledTableCell>
                <StyledTableCell>Plano financeiro Principal</StyledTableCell>
                <StyledTableCell>Plano financeiro Taxas</StyledTableCell>
                <StyledTableCell>Plano financeiro Juros</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
                <StyledTableCell align="right">Ações</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
              ).map((row, index) => (
                <TableRow key={row.fidcId}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.cnpj}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.credorSiengeId}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.contact}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.planoFinanceiroPrincipal?.nome ? row.planoFinanceiroPrincipal.nome + " - " + row.planoFinanceiroPrincipal.codigo : "Não especificado"}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.planoFinanceiroTaxa?.nome ? row.planoFinanceiroTaxa.nome + " - " + row.planoFinanceiroTaxa.codigo : "Não especificado"}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.planoFinanceiroJuros?.nome ? row.planoFinanceiroJuros.nome + " - " + row.planoFinanceiroJuros.codigo : "Não especificado"}
                  </TableCell>

                  <TableCell align="right">{(row?.isActive && !row?.isDeleted) ? <Check style={{ color: '#009922' }} size={25} /> : ((!row?.isActive && !row.isDeleted) ? <X style={{ color: '#FF0000' }} size={25} /> : <Minus style={{ color: '#E1E5EB' }} size={25} />)}</TableCell>
                  <TableCell align="right">
                    <Button aria-label="edit" style={{ backgroundColor: '#D4E9EE', minWidth: '32px' }} onClick={handleOpenOptionsPerson(index, row)}>
                      <DotsThreeOutlineVertical style={{ color: '#246776' }} size={20} />
                    </Button>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorElFidc}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElFidc) && index === openIndex}
                      onClose={handleCloseFidcMenu}
                    >
                      {settings.map((setting) => {
                          if (setting.type === 'create' || setting.type === 'search') {
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

                          // Renderizar os menus com base no status
                          if (row?.isActive && !row.isDeleted) {
                            // Caso o status seja 1 (Ativado)
                            if (setting.type === 'update' || setting.type === 'permission' || setting.type === 'disable' || setting.type === 'delete' || setting.type === 'resetPassword') {
                              return (
                                <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting.type, row)}>
                                  <Typography textAlign="center">{setting.name}</Typography>
                                </MenuItem>
                              );
                            }
                          } else if (!row?.isActive && !row.isDeleted) {
                            // Caso o status seja 2 (Desativado)
                            if (setting.type === 'reactivate' || setting.type === 'delete') {
                              return (
                                <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting.type, row)}>
                                  <Typography textAlign="center">{setting.name}</Typography>
                                </MenuItem>
                              );
                            }
                          } else if (!row?.isActive && row.isDeleted) {
                            // Caso o status seja 3 (Excluído)
                            if (setting.type === 'restore') {
                              return (
                                <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting.type, row)}>
                                  <Typography textAlign="center">{setting.name}</Typography>
                                </MenuItem>
                              );
                            }
                          }

                          // Renderizar null para outros tipos de menu não especificados acima
                          return null;
                        })}

                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
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
            <form onSubmit={handleSubmit(handleActionFidc)}>
              <input type="hidden" {...register("fidcId")} />
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
                    <FidcUpdateOrCreate>
                      <Label size={"50"}>
                        <Text>Nome  <span style={{ color: "$red500" }}>*</span></Text>
                        <input style={inputStyle} {...register("name")} disabled={changeTypeModal === 'view' && true} />
                        {errors.name && (
                          <span>   {errors.name.message} </span>
                        )}
                      </Label>

                      <Label size={"45"}>
                        <Text>CNPJ  <span style={{ color: "$red500" }}>*</span></Text>
                        <input style={inputStyle} {...register("cnpj")} disabled={changeTypeModal === 'view' && true} />
                        {errors.cnpj && (
                          <span>   {errors.cnpj.message} </span>
                        )}
                      </Label>

                      <Label size={"50"}>
                        <Text>Codigo Credor Sienge <span style={{ color: "$red500" }}>*</span></Text>
                        <input style={inputStyle} {...register("credorSiengeId")} disabled={changeTypeModal === 'view' && true} />
                        {errors.credorSiengeId && (
                          <span>   {errors.credorSiengeId.message} </span>
                        )}
                      </Label>

                      <Label size={"45"}>
                        <Text>contato  <span style={{ color: "$red500" }}>*</span></Text>
                        <input style={inputStyle} {...register("contact")} disabled={changeTypeModal === 'view' && true} />
                        {errors.contact && (
                          <span>   {errors.contact.message} </span>
                        )}
                      </Label>

                      <Label size={"50"}>
                        <Text>Plano Financeiro Principal <span style={{ color: "$red500" }}>*</span></Text>

                        <select style={inputStyle} {...register("PlanoFinanceiroPrincipalIdFormat")} disabled={changeTypeModal === 'view' && true}>
                          <option value="" selected>Plano Financeiro Principal</option>
                          {
                            planoFinanceiro.map(planoFin => {
                              return <option key={planoFin.id} value={planoFin.id}>{planoFin.nome + " - " + planoFin.codigo}</option>
                            })
                          }
                        </select>

                        {errors.PlanoFinanceiroPrincipalIdFormat && (
                          <span> {errors.PlanoFinanceiroPrincipalIdFormat.message} </span>
                        )}
                      </Label>

                      <Label size={"45"}>
                        <Text>Plano Financeiro taxas <span style={{ color: "$red500" }}></span></Text>

                        <select style={inputStyle} {...register("planoFinanceiroTaxaIdFormat")} disabled={changeTypeModal === 'view' && true}>
                          <option value="0" selected>Plano Financeiro taxas</option>
                          {
                            planoFinanceiro.map(planoFin => {
                              return <option key={planoFin.id} value={planoFin.id}>{planoFin.nome + " - " + planoFin.codigo}</option>
                            })
                          }
                        </select>

                        {errors.planoFinanceiroTaxaIdFormat && (
                          <span> {errors.planoFinanceiroTaxaIdFormat.message} </span>
                        )}
                      </Label>

                      <Label size={"50"}>
                        <Text>Plano Financeiro Juros <span style={{ color: "$red500" }}>*</span></Text>

                        <select style={inputStyle} {...register("planoFinanceiroJurosIdFormat")} disabled={changeTypeModal === 'view' && true}>
                          <option value="0" selected>Plano Financeiro Juros</option>
                          {
                            planoFinanceiro.map(planoFin => {
                              return <option key={planoFin.id} value={planoFin.id}>{planoFin.nome + " - " + planoFin.codigo}</option>
                            })
                          }
                        </select>

                        {errors.planoFinanceiroJurosIdFormat && (
                          <span> {errors.planoFinanceiroJurosIdFormat.message} </span>
                        )}
                      </Label>

                      <Label size={"45"}>
                        <Text>Valor Limite  <span style={{ color: "$red500" }}>*</span></Text>
                        <input style={inputStyle} {...register("limitValue")} disabled={changeTypeModal === 'view' && true} />
                        {errors.name && (
                          <span>{errors.name.message} </span>
                        )}
                      </Label>

                      <SwitchLabel size={"50"}>
                        <Text>Permitir valor de ultrapassagem ?</Text>            
                        <Switch {...register('permitirUltrapassagem')} checked={checked}  disabled={changeTypeModal === 'view' && true} onChange={handleOvertakingPermission} />
                      </SwitchLabel>

                      <Label size={"45"}>
                        <Text>Valor aceitável para ultrapassagem  <span style={{ color: "$red500" }}>*</span></Text>
                        <input style={inputStyle} {...register("limitValueAcceptable")} disabled={changeTypeModal === 'view' && true} />
                        {errors.name && (
                          <span>{errors.name.message} </span>
                        )}
                      </Label>

                      <Label size={"45"}>
                        <Text>Valor aceitável para ultrapassagem  <span style={{ color: "$red500" }}>*</span></Text>

                        <Controller
                          name="file"
                          control={control}
                          render={({ field: { onChange, onBlur, name, ref } }) => (
                            <input type="file" onChange={(event) => {
                              onChange(event.target.files);
                              handleFileChange(event);
                            }} onBlur={onBlur}  disabled={changeTypeModal === 'view' && true} name={name} ref={ref} accept=".pdf" />
                          )}
                        />
                      </Label>

                    </FidcUpdateOrCreate>

                  ) : null
                }
              </ContentModal>
              <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0, }} />
              {
                changeTypeModal != 'view' &&
                <FooterModal>
                  <SimpleButton title="Cancelar" onClick={handleClose} styleColors="gray" />
                  {
                    changeTypeModal === 'create' || changeTypeModal === 'update' ? (
                      <SimpleButton
                        title={changeTypeModal === 'update' ? 'Editar' : 'Salvar'}
                        disabled={isSubmitting}
                        styleColors="db2"
                        loading={isSubmitting}
                        type="submit"
                      />
                    ) : null
                  }
                </FooterModal>
              }
            </form>
          </Box>
        </Modal>
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