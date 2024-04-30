import { withSSRAuth } from "@/utils/withSSRAuth";
import { Controller, useForm } from "react-hook-form"
import { setupAPIClient } from "@/services/api";
import Configuracoes from "../../index.page";
import { ActionsHeader, Container, ContentModal, FooterModal, Header, HeaderModal, Label, Text, TitleBox, CompanyUpdateOrCreate, CompanySearch } from "./styles";
import { styled, useTheme } from '@mui/material/styles';
import { Table, Button, TableRow, TableHead, TableContainer, TableCell, TableBody, tableCellClasses, Box, IconButton, TableFooter, TablePagination, Modal, Typography, Menu, MenuItem, Input, FormControlLabel, Checkbox, Switch } from "@mui/material";
import { ArrowLineLeft, ArrowLineRight, CaretLeft, CaretRight, Check, DotsThreeOutlineVertical, Minus, X, XCircle } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { SimpleButton } from "@/components/SimpleButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/services/apiClient";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

const CompanyFormSchema = z.object({
  id: z.coerce.number(),
  numberCompany: z.string()
    .min(1, { message: "Preencha o campo corretamente" }),
  nameCompany: z.string().min(1, { message: "Preencha o campo corretamente" }),
  contaGerencialId: z.string().min(1, { message: "Preencha o campo corretamente" }),
  centroCustoId: z.string().min(1, { message: "Preencha o campo corretamente" }),
  companyCNPJ: z.optional(z.string())
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

type centroCustoProps = {
  id: number,
  centroDeCustoName: string,
  companyId: number,
  centroDeCustoSiengeId: number,
  company: {
    id: number,
    siengeId: number,
    name: string,
    cnpj: string,
    tradeName: string
  }
  isDeleted: boolean,
  isActive: boolean
}

type contaGerencialProps = {
  id: number;
  accountNumber: string;
  accountName: string;
  companyId: number;
  isDeleted: boolean;
  isActive: boolean;
  company: {
    id: number;
    siengeId: number;
    name: string;
    cnpj: string;
    tradeName: string;
  }
}

type createDataProps = {
  companyFidicId: number,
  companyId: number,
  siengeId: number,
  centroCustoId: number,
  contaGerencialId: number,
  companyName: string,
  cnpj?: string,
  isDelected: boolean,
  isActive: boolean,
  company: {
    id: number,
    siengeId: number,
    name: string,
    cnpj: string,
    tradeName: string,
  }
  centroCusto: {
    id: number,
    centroDeCustoName: string,
    companyId: number,
    centroDeCustoSiengeId: number,
    company: string,
    isActive: boolean,
    isDeleted: boolean,
  }
  contaGerencial: {
    id: number,
    accountNumber: string,
    accountName: string,
    companyId: number,
    isdeleted: boolean,
    isActive: boolean,
  }
}

type settingsProps = {
  name: string,
  type: string,
}

type CompanyFormData = z.infer<typeof CompanyFormSchema>

export default function Company() {
  //States
  const [loadingAction, setLoadingAction] = useState(false);
  const [rows, setRows] = useState<createDataProps[]>([]);
  const [settings, setSettings] = useState<settingsProps[]>([]);
  const [centroCusto, setCentroCusto] = useState<centroCustoProps[]>([]);
  const [contaGerencial, setContaGerencial] = useState<contaGerencialProps[]>([]);
  const [open, setOpen] = useState(false);
  const [CompanyFound, setCompanyFound] = useState<boolean>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorElCompany, setAnchorElCompany] = useState<null | HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState(-1);
  const [nameModal, setNameModal] = useState('');
  const [changeTypeModal, setChangeTypeModal] = useState('');
  const [buttonRemoveFilters, setButtonRemoveFilters] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchPayment, setSearchPayment] = useState("");

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const { register, getValues, handleSubmit, formState, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<CompanyFormData>({
    resolver: zodResolver(CompanyFormSchema)
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
    if (searchName || searchPayment || searchStatus) {
      await api.get(`/api/Configuracoes/SearchCredor?${searchName && '&Name=' + searchName}${searchStatus != "3" && searchStatus ? "&isActive=" + (searchStatus === "1" ? true : false) : ''}${searchStatus != "1" && searchStatus ? "&isDelected=" + (searchStatus === "3" ? true : false) : ''}`)
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
        })
    } else {
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

  const handleCloseCompanyMenu = () => {
    setAnchorElCompany(null);
  };
  const handleRedirectCompany = (row: createDataProps, setting: string) => {

    setAnchorElCompany(null);
  };

  const handleOpenOptionsPerson = (index: number, row: createDataProps) => (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCompany(event.currentTarget);
    setOpenIndex(index);
  }

  function handleOpenModalOrActivateAction(typeModal: 'view' | 'create' | 'update' | 'search' | 'disable' | 'delete' | 'reactivate' | 'restore', row?: createDataProps) {
    setChangeTypeModal(typeModal);
    if (typeModal === 'create') {
      setNameModal('Adicionar')
      setOpen(true);
    } else if (typeModal === 'search') {
      setNameModal('Busca avançada')
      setOpen(true);
    } else if (typeModal === 'view') {
      setNameModal('Visualizar')
      reset({ id: row?.companyFidicId, numberCompany: row?.siengeId.toString(), nameCompany: row?.companyName, centroCustoId: String(row?.centroCustoId), contaGerencialId: String(row?.contaGerencialId), companyCNPJ: row?.cnpj});
      setOpen(true);
    } else if (typeModal === 'update') {
      setNameModal('Editar')
      loadCompany(row?.siengeId.toString());
      reset({ id: row?.companyFidicId, numberCompany: row?.siengeId.toString(), nameCompany: row?.companyName, centroCustoId: String(row?.centroCustoId), contaGerencialId: String(row?.contaGerencialId), companyCNPJ: row?.cnpj });
      setOpen(true);
    } else if (typeModal === 'delete') {
      api.put(`/api/Fidc/UpdateCompanyFIDIC/4`, {
        companyFidicId: row.companyFidicId,
        companyId: 0,
        siengeId: 0,
        centroCustoId: 0,
        contaGerencialId: 0,
        companyName: "",
        isActive: false,
        isDelected: true,
        cnpj: ""
      })
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
          fetchCompany();
        })
      handleCloseCompanyMenu();
    } else if (typeModal === 'disable' || typeModal === 'restore') {
      api.put(`/api/Fidc/UpdateCompanyFIDIC/3`, {
        companyFidicId: row.companyFidicId,
        companyId: 0,
        siengeId: 0,
        centroCustoId: 0,
        contaGerencialId: 0,
        companyName: "",
        isActive: false,
        isDelected: true,
        cnpj: ""
      })
        .then((response) => {
          toast.success(`Empresa ${typeModal === 'disable' ? 'desativada' : 'restaurada'} com sucesso`, {
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
          fetchCompany();
        })
      handleCloseCompanyMenu();
    } else if (typeModal === 'reactivate') {
      api.put(`/api/Fidc/UpdateCompanyFIDIC/2`, {
        companyFidicId: row.companyFidicId,
        companyId: 0,
        siengeId: 0,
        centroCustoId: 0,
        contaGerencialId: 0,
        companyName: "",
        isActive: false,
        isDelected: true,
        cnpj: ""

      })
        .then((response) => {
          toast.success(`Empresa habilitada com sucesso`, {
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
          toast.error(`Não foi possível habilitar a empresa, tente novamente mais tarde.`, {
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
          fetchCompany();
        })
      handleCloseCompanyMenu();
    } else {
      console.log('Algo deu errado')
    }
  }

  async function handleActionCompany(data: CompanyFormData) {
    const { id, numberCompany, nameCompany, centroCustoId, contaGerencialId, companyCNPJ } = data;
    console.log(id, numberCompany, nameCompany, centroCustoId, contaGerencialId, companyCNPJ);
    if (changeTypeModal === 'create') {
      await api.post(`/api/Fidc/CreateCompanyFIDIC`, {
        siengeId: numberCompany,
        centroCustoId: Number(centroCustoId),
        contaGerencialId: Number(contaGerencialId),
        companyName: "",
        isActive: true,
        isDelected: false,
        cnpj: "0"
      })
        .then(() => {
          fetchCompany();
          toast.success(`Empresa ${nameCompany} adicionada com sucesso`, {
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
          toast.error(`Não foi possÍvel adicionar a empresa`, {
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
    } else if (changeTypeModal === 'update') {
      console.log(id, numberCompany, nameCompany, centroCustoId, contaGerencialId)
      await api.put(`/api/Fidc/UpdateCompanyFIDIC/1`, {
        companyFidicId: Number(id),
        companyId: 0,
        siengeId: Number(numberCompany),
        centroCustoId: Number(centroCustoId),
        contaGerencialId: Number(contaGerencialId),
        companyName: "",
        isActive: true,
        isDelected: false,
        cnpj: companyCNPJ
      })
        .then(() => {
          fetchCompany();
          toast.success(`Empresa ${numberCompany} editado com sucesso.`, {
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
          toast.error(`Não foi possÍvel editar Empresa`, {
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
    reset({ id: 0, numberCompany: '', nameCompany: '' });
  }

  async function loadCompany(siengeId: string) {
    await api.get(`/api/Configuracoes/GetEmpresaPorSiengeId/${Number(siengeId)}`)
      .then((response) => {
        reset({ nameCompany: response.data.name });
        setCompanyFound(true);
      })
      .catch(() => {
        setCompanyFound(false);
      })
  }

  async function fetchCompany() {
    await api.get(`/api/Fidc/GetAllCompanyFIDIC`)
      .then(response => {
        setRows(response.data);
      })
      .catch(() => {
      })

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
    fetchCompany();
  }

  async function fetchCentroCusto() {
    setLoadingAction(true);
    await api.get(`/api/Fidc/GetCentroCusto`)
      .then(response => {
        setCentroCusto(response.data);
      })
      .catch(() => {
      }).finally(() => {
        setLoadingAction(false);
      });
  }

  async function fetchContaGerencial() {
    setLoadingAction(true);
    await api.get(`/api/Fidc/GetContaGerencial`)
      .then(response => {
        setContaGerencial(response.data);
      })
      .catch(() => {
      }).finally(() => {
        setLoadingAction(false);
      });
  }



  useEffect(() => {
    fetchCompany();
    fetchCentroCusto();
    fetchContaGerencial();
  }, [])

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      resetInputs()
    }
  }, [formState, isSubmitSuccessful, reset])

  return (
    <Configuracoes>
      <Container>
        <Header>
          <TitleBox>
            <span>Empresas</span>
          </TitleBox>
          <ActionsHeader>
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
                <StyledTableCell>Cnpj</StyledTableCell>
                <StyledTableCell>Conta gerencial</StyledTableCell>
                <StyledTableCell>Centro de Custo</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
                <StyledTableCell align="right">Ações</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
              ).map((row, index) => (
                <TableRow key={row.companyFidicId}>
                  <TableCell component="th" scope="row">
                    {row.siengeId}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.companyName}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.cnpj}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.contaGerencial?.accountNumber ? row.contaGerencial?.accountNumber + " - " + row.contaGerencial.accountName : "Não especificado"}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.centroCusto?.centroDeCustoSiengeId ? row.centroCusto?.centroDeCustoSiengeId + " - " + row.centroCusto.centroDeCustoName : "Não especificado"}
                  </TableCell>
                  <TableCell align="right">{(row?.isActive && !row?.isDelected) ? <Check style={{ color: '#009922' }} size={25} /> : ((!row?.isActive && !row.isDelected) ? <X style={{ color: '#FF0000' }} size={25} /> : <Minus style={{ color: '#E1E5EB' }} size={25} />)}</TableCell>
                  <TableCell align="right">
                    <Button aria-label="edit" style={{ backgroundColor: '#D4E9EE', minWidth: '32px' }} onClick={handleOpenOptionsPerson(index, row)}>
                      <DotsThreeOutlineVertical style={{ color: '#246776' }} size={20} />
                    </Button>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorElCompany}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElCompany) && index === openIndex}
                      onClose={handleCloseCompanyMenu}
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
                        if (row?.isActive && !row.isDelected) {
                          // Caso o status seja 1 (Ativado)
                          if (setting.type === 'update' || setting.type === 'permission' || setting.type === 'disable' || setting.type === 'delete' || setting.type === 'resetPassword') {
                            return (
                              <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting.type, row)}>
                                <Typography textAlign="center">{setting.name}</Typography>
                              </MenuItem>
                            );
                          }
                        } else if (!row?.isActive && !row.isDelected) {
                          // Caso o status seja 2 (Desativado)
                          if (setting.type === 'reactivate' || setting.type === 'delete') {
                            return (
                              <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting.type, row)}>
                                <Typography textAlign="center">{setting.name}</Typography>
                              </MenuItem>
                            );
                          }
                        } else if (!row?.isActive && row.isDelected) {
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
            <form onSubmit={handleSubmit(handleActionCompany)}>
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
                    <CompanyUpdateOrCreate>
                      <Label size={changeTypeModal != 'view' ? "30" : "45"}>
                        <Text>Numero da empresa <span style={{ color: "$red500" }}>*</span></Text>
                        <input style={inputStyle} min="0"  {...register("numberCompany")} type="number" disabled={changeTypeModal === 'view' && true} />
                        {errors.numberCompany && (
                          <span>{errors.numberCompany.message} </span>
                        )}
                        {
                          CompanyFound === false &&
                          <span>Empresa não encontrada</span>
                        }
                      </Label>
                      {
                        changeTypeModal != 'view' &&
                        <Label size={"15"} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'end' }}>
                          <GradientButton
                            title="Buscar empresa"
                            type="button"
                            style={{ marginBottom: '0', height: '43px', width: '100%' }}
                            onClick={() => {
                              const numberCompany = getValues("numberCompany");
                              loadCompany(numberCompany)
                            }}
                            styleColors="orangeGradient"
                            size="auto"
                          />
                        </Label>
                      }
                      <Label size={"50"}>
                        <Text>Nome da empresa <span style={{ color: "$red500" }}>*</span></Text>
                        <input style={inputStyle} {...register("nameCompany")} disabled={true} />
                        {errors.nameCompany && (
                          <span>   {errors.nameCompany.message} </span>
                        )}
                      </Label>
                      <Label size={changeTypeModal != 'view' ? "30" : "45"}>
                        <Text>CNPJ <span style={{ color: "$red500" }}></span></Text>
                        <input style={inputStyle} {...register("companyCNPJ")} disabled={true} />
                        {errors.companyCNPJ && (
                          <span>{errors.companyCNPJ.message} </span>
                        )}
                        {
                          CompanyFound === false &&
                          <span>CNPJ não</span>
                        }
                      </Label>

                      <Label size={"45"}>
                        <Text>Conta Gerencial <span style={{ color: "$red500" }}>*</span></Text>

                        <select style={inputStyle} {...register("contaGerencialId")} disabled={changeTypeModal === 'view' && true}>
                          <option value="" selected>Conta Gerencial</option>
                          {
                            contaGerencial.map(contaGen => {
                              return <option key={contaGen.id} value={contaGen.id}>{contaGen.accountNumber + " - " + contaGen.accountName}</option>
                            })
                          }
                        </select>

                        {errors.contaGerencialId && (
                          <span> {errors.contaGerencialId.message} </span>
                        )}
                      </Label>

                      <Label size={"50"}>
                        <Text>Centro de Custo <span style={{ color: "$red500" }}>*</span></Text>

                        <select style={inputStyle} {...register("centroCustoId")} disabled={changeTypeModal === 'view' && true}>
                          <option value="" selected>Centro de Custo</option>
                          {
                            centroCusto.map(centroCust => {
                              return <option key={centroCust.id} value={centroCust.id}>{centroCust.centroDeCustoSiengeId + " - " + centroCust.centroDeCustoName}</option>
                            })
                          }
                        </select>

                        {errors.centroCustoId && (
                          <span> {errors.centroCustoId.message} </span>
                        )}
                      </Label>

                    </CompanyUpdateOrCreate>
                  ) :
                    <CompanySearch>
                      <Label size={"45"}>
                        <Text>Nome</Text>
                        <input style={inputStyle} value={searchName} onChange={(e) => setSearchName(e.target.value)} />
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
                    </CompanySearch>
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
  )
}


export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {}
  }
})