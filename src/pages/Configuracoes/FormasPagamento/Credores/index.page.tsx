import { withSSRAuth } from "@/utils/withSSRAuth";
import { Controller, useForm } from "react-hook-form"
import { setupAPIClient } from "@/services/api";
import Configuracoes from "../../index.page";
import { ActionsHeader, Container, ContentModal, FooterModal, Header, HeaderModal, Label, Text, TitleBox, CredoresUpdateOrCreate, CredoresSearch } from "./styles";
import { styled, useTheme } from '@mui/material/styles';
import { Table, Button, TableRow, TableHead, TableContainer, TableCell, TableBody, tableCellClasses, Box, IconButton, TableFooter, TablePagination, Modal, Typography, Menu, MenuItem, Input, FormControlLabel, Checkbox, Switch, CircularProgress } from "@mui/material";
import { ArrowLineLeft, ArrowLineRight, CaretLeft, CaretRight, Check, DotsThreeOutlineVertical, Minus, X, XCircle } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { SimpleButton } from "@/components/SimpleButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/services/apiClient";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingScreen } from "@/pages/Pagamentos/styles";


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
  numberCreditor: z.string()
    .min(1, { message: "Preencha o campo corretamente" }),
  nameCreditor: z.string(),
  NumberFormat: z.string().min(1, { message: "Preencha o campo corretamente" }),
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

type paymentsProps = {
  id: number,
  name: string,
  siengeId: number,
  padrao: boolean,
  isDeleted: boolean,
  isActive: boolean
}

type createDataProps = {
  id: number,
  siengeId: number,
  name: string,
  cpf: string,
  cnpj: string,
  paymentTypeId: number,
  paymentType?: {
    id: number,
    name: string,
    siengeId: number,
    padrao: boolean,
    isDeleted: boolean,
    isActive: boolean
  },
  isDeleted: string,
  isActive: string
}

type settingsProps = {
  name: string,
  type: string,
}

type siengeCreditorProps = {
  siengeid: number,
  name: string,
  cpf?: string,
  cnpj?: string,
  paymentTypeId: number,
}


type CredoresFormData = z.infer<typeof CredoresFormSchema>

export default function Credores() {
  const [loadingAction, setLoadingAction] = useState(false);
  //States
  const [rows, setRows] = useState<createDataProps[]>([]);
  const [settings, setSettings] = useState<settingsProps[]>([]);
  const [payments, setPayments] = useState<paymentsProps[]>([]);
  const [siengeCreditor, setSiengeCreditor] = useState<siengeCreditorProps>();
  const [open, setOpen] = useState(false);
  const [creditorFound, setCreditorFound] = useState<boolean>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorElCredores, setAnchorElCredores] = useState<null | HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState(-1);
  const [nameModal, setNameModal] = useState('');
  const [changeTypeModal, setChangeTypeModal] = useState('');
  const [buttonRemoveFilters, setButtonRemoveFilters] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchPayment, setSearchPayment] = useState("");

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const { register, getValues, handleSubmit, formState, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<CredoresFormData>({
    resolver: zodResolver(CredoresFormSchema)
  });

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

  async function handleSearchUsers() {
    setLoadingAction(true);
    if (searchName || searchPayment || searchStatus) {
      await api.get(`/api/Configuracoes/SearchCredor?${searchPayment && "&PaymentTypeId=" + searchPayment}${searchName && '&Name=' + searchName}${searchStatus != "3" && searchStatus ? "&isActive=" + (searchStatus === "1" ? true : false) : ''}${searchStatus != "1" && searchStatus ? "&isDeleted=" + (searchStatus === "3" ? true : false) : ''}`)
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

  function handleOpenModalOrActivateAction(typeModal: 'view' | 'create' | 'update' | 'search' | 'disable' | 'delete' | 'reactivate' | 'restore', row?: createDataProps) {
    setLoadingAction(true);
    setChangeTypeModal(typeModal);
    if (typeModal === 'create') {
      setNameModal('Adicionar')
      setOpen(true);
      setLoadingAction(false);
    } else if (typeModal === 'search') {
      setNameModal('Busca avançada')
      setOpen(true);
      setLoadingAction(false);
    } else if (typeModal === 'view') {
      setNameModal('Visualizar')
      reset({ id: row?.id, numberCreditor: row?.siengeId.toString(), nameCreditor: row?.name, NumberFormat: row?.paymentTypeId.toString() });
      setOpen(true);
      setLoadingAction(false);
    } else if (typeModal === 'update') {
      setNameModal('Editar')
      loadCreditor(row?.siengeId.toString());
      reset({ id: row?.id, numberCreditor: row?.siengeId.toString(), nameCreditor: row?.name, NumberFormat: row?.paymentTypeId.toString() });
      setOpen(true);
      setLoadingAction(false);
    } else if (typeModal === 'delete') {
      api.delete(`/api/Configuracoes/DeletaCredor/${row?.id}`)
        .then((response) => {
          toast.success(`Credor excluído com sucesso`, {
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
          toast.error(`Não foi possível excluir o credor, tente novamente mais tarde.`, {
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
          fetchCredores();
          setLoadingAction(false);
        })
      handleCloseCredoresMenu();
    } else if (typeModal === 'disable' || typeModal === 'restore') {
      api.delete(`/api/Configuracoes/DesabilitaCredor/${row?.id}`)
        .then((response) => {
          toast.success(`Credor ${typeModal === 'disable' ? 'desativado' : 'restaurado'} com sucesso`, {
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
          toast.error(`Não foi possível ${typeModal === 'disable' ? 'desativar' : 'restaurar'} o credor, tente novamente mais tarde.`, {
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
          setLoadingAction(false);
          fetchCredores();
        })
      handleCloseCredoresMenu();
    } else if (typeModal === 'reactivate') {
      api.put(`/api/Configuracoes/AtivarCredor?CredorId=${row?.id}`)
        .then((response) => {
          toast.success(`Credor habilitado com sucesso`, {
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
          toast.error(`Não foi possível habilitar o credor, tente novamente mais tarde.`, {
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
          setLoadingAction(false);
          fetchCredores();
        })
      handleCloseCredoresMenu();
    } else {
      console.log('Algo deu errado')
    }
  }

  async function handleActionCredores(data: CredoresFormData) {
    const { id, numberCreditor, nameCreditor, NumberFormat } = data;
    if (changeTypeModal === 'create') {
      await api.post(`/api/Configuracoes/SalvarCredores`, {
        name: nameCreditor,
        paymentTypeId: Number(NumberFormat),
        isDeleted: false,
        isActive: true,
        cpf: siengeCreditor.cpf,
        cnpj: siengeCreditor.cnpj,
        siengeId: Number(numberCreditor)
      })
        .then(() => {
          fetchCredores();
          toast.success(`Credor ${nameCreditor} adicionado com sucesso`, {
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
          toast.error(`Não foi possÍvel adicionar o credor`, {
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
          setLoadingAction(false);
        }); 
      handleClose()
    } else if (changeTypeModal === 'update') {
      await api.put(`/api/Configuracoes/AtualizaCredor`, {
        id,
        name: nameCreditor,
        paymentTypeId: Number(NumberFormat),
        isDeleted: false,
        isActive: true,
        cpf: siengeCreditor.cpf ? siengeCreditor.cpf : null,
        cnpj: siengeCreditor.cnpj ? siengeCreditor.cnpj : null,
        siengeId: Number(numberCreditor)
      })
        .then(() => {
          fetchCredores();
          toast.success(`Credor ${nameCreditor} editado com sucesso.`, {
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
          toast.error(`Não foi possÍvel editar o credor`, {
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
          setLoadingAction(false);
        }); 
      handleClose()
    }

  }

  function resetInputs() {
    reset({ id: 0, numberCreditor: '', nameCreditor: '', NumberFormat: '' });
  }

  async function loadCreditor(siengeId: string) {
    setLoadingAction(true);
    await api.get(`/api/Configuracoes/GetCredoreBySienge?creditorId=${Number(siengeId)}`)
      .then((response) => {
        setSiengeCreditor(response.data)
        reset({ nameCreditor: response.data.name });
        setCreditorFound(true);
      })
      .catch(() => {
        setCreditorFound(false);
      }).finally(() => {
        setLoadingAction(false);
      }); 
  }

  async function fetchCredores() {
    setLoadingAction(true);
    await api.get(`/api/Configuracoes/GetCredores`)
      .then(response => {
        setRows(response.data);
      })
      .catch(() => {
      }).finally(() => {
        setLoadingAction(false);
      }); 

    const getSettings = [
      { name: 'Visualizar', type: 'view', },
      { name: 'Editar', type: 'update', },
      { name: 'Desativar', type: 'disable', },
      { name: 'Excluir', type: 'delete', },
      { name: 'Adicionar', type: 'create', },
      { name: 'Buscar', type: 'search', },
      { name: 'Habilitar', type: 'reactivate', },
      { name: 'Restaurar', type: 'restore', },
    ]

    setSettings(getSettings);
  }

  function resetSearchInputs() {
    setSearchName('')
    setSearchStatus('')
    setSearchPayment('')
  }

  function handleRemoveFilters() {
    setButtonRemoveFilters(false);
    resetSearchInputs();
    fetchCredores();
  }

  async function fetchGetFormasDePagamentos() {
    setLoadingAction(true);
    await api.get(`api/Configuracoes/GetFormaPagamento`)
      .then(response => {
        setPayments(response.data);
      })
      .catch(() => {
      }).finally(() => {
        setLoadingAction(false);
      }); 
  }

  useEffect(() => {
    fetchGetFormasDePagamentos();
    fetchCredores();
  }, [])

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      resetInputs()
    }
  }, [formState, isSubmitSuccessful, reset])

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
              <span>Personalizar por Credores</span>
            </TitleBox>
            <ActionsHeader>
              <GradientButton title="Buscar" onClick={() => handleOpenModalOrActivateAction("search")} styleColors="orangeGradient" disabled={!(settings.some(setting => setting.type === 'search'))} size="auto" />
              <GradientButton title="Adicionar" onClick={() => handleOpenModalOrActivateAction("create")} styleColors="db2Gradient" disabled={!(settings.some(setting => setting.type === 'create'))} size="auto" />
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
                  <StyledTableCell>Numero</StyledTableCell>
                  <StyledTableCell>Nome</StyledTableCell>
                  <StyledTableCell>Numero Formas de pagamento</StyledTableCell>
                  <StyledTableCell align="right">Status</StyledTableCell>
                  <StyledTableCell align="right">Ações</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : rows
                ).map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.siengeId}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.paymentType?.siengeId + " - " + row?.paymentType?.name}
                    </TableCell>
                    <TableCell align="right">{(row?.isActive && !row?.isDeleted) ? <Check style={{ color: '#009922' }} size={25} /> : ((!row?.isActive && !row.isDeleted) ? <X style={{ color: '#FF0000' }} size={25} /> : <Minus style={{ color: '#E1E5EB' }} size={25} />)}</TableCell>
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
              <form onSubmit={handleSubmit(handleActionCredores)}>
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
                        <Label size={"30"}>
                          <Text>Numero do credor <span style={{ color: "$red500" }}>*</span></Text>
                          <input style={inputStyle} min="0"  {...register("numberCreditor")} type="number" disabled={changeTypeModal === 'view' && true} />
                          {errors.numberCreditor && (
                            <span>{errors.numberCreditor.message} </span>
                          )}
                          {
                            creditorFound === false &&
                            <span>Empresa não encontrada</span>
                          }
                        </Label>
                        <Label size={"15"} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'end' }}>
                          <GradientButton
                            title="Buscar Credor"
                            type="button"
                            style={{ marginBottom: '0', height: '43px', width: '100%' }}
                            onClick={() => {
                              const numberCreditor = getValues("numberCreditor");
                              loadCreditor(numberCreditor)
                            }}
                            styleColors="orangeGradient"
                            size="auto"
                          />
                        </Label>
                        <Label size={"50"}>
                          <Text>Nome do credor <span style={{ color: "$red500" }}>*</span></Text>
                          <input style={inputStyle} {...register("nameCreditor")} disabled={true} />
                          {errors.nameCreditor && (
                            <span>   {errors.nameCreditor.message} </span>
                          )}
                        </Label>
                        <Label size={"40"}>
                          <Text>Nº Formas de pagamento <span style={{ color: "$red500" }}>*</span></Text>
                          <select style={inputStyle} {...register("NumberFormat")} disabled={changeTypeModal === 'view' && true}>
                            <option value="0" selected>Formas de pagamentos</option>
                            {
                              payments.map(payment => {
                                return <option key={payment.id} value={payment.id}>{payment.siengeId + " - " + payment.name}</option>
                              })
                            }
                          </select>
                          {errors.NumberFormat && (
                            <span> {errors.NumberFormat.message} </span>
                          )}
                        </Label>

                        {/* <Label size={"35"}>    
                            <Text>Departamento</Text>             
                            <select style={inputStyle} {...register("department")} disabled={changeTypeModal === 'view' && true}>
                              <option value="">Departamento</option>
                              <option value="Financeiro">Financeiro</option>
                              <option value="Controladoria">Controladoria</option>
                              <option value="Infraestrutura">Infraestrutura</option>
                              <option value="Desenvolvimento">Desenvolvimento</option>                    
                            </select>
                            {errors.department && (
                              <span> {errors.department.message} </span>
                            )}
                          </Label> */}
                      </CredoresUpdateOrCreate>
                    ) :
                      <CredoresSearch>
                        <Label size={"45"}>
                          <Text>Nome</Text>
                          <input style={inputStyle} value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                        </Label>
                        <Label size={"50"}>
                          <Text>Nº Formas de pagamento <span style={{ color: "$red500" }}>*</span></Text>
                          <select style={inputStyle} value={searchPayment} onChange={(e) => setSearchPayment(e.target.value)} disabled={changeTypeModal === 'view' && true}>
                            <option value="0" selected>Formas de pagamentos</option>
                            {
                              payments.map(payment => {
                                return <option key={payment.id} value={payment.id}>{payment.siengeId + " - " + payment.name}</option>
                              })
                            }
                          </select>
                        </Label>
                        <Label size={"45"}>
                          <Text>Status</Text>
                          <select style={inputStyle} value={searchStatus} onChange={(e) => setSearchStatus(e.target.value)}>
                            <option value="">Status</option>
                            <option value="1">Ativo</option>
                            <option value="2">Desativado</option>
                            <option value="3">Excluído</option>
                          </select>
                        </Label>
                      </CredoresSearch>
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
                      ) :
                        <SimpleButton
                          title='Buscar'
                          styleColors="db2"
                          onClick={handleSearchUsers}
                        />
                    }
                  </FooterModal>
                }
              </form>
            </Box>
          </Modal>
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