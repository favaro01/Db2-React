import { withSSRAuth } from "@/utils/withSSRAuth";
import { Controller, useForm } from "react-hook-form"
import { setupAPIClient } from "@/services/api";
import Configuracoes from "../../index.page";
import { ActionsHeader, Container, ContentModal, FooterModal, Header, HeaderModal, Label, Text, TitleBox, ContaGerencialUpdateOrCreate } from "./styles";
import { styled, useTheme } from '@mui/material/styles';
import { Table, Button, TableRow, TableHead, TableContainer, TableCell, TableBody, tableCellClasses, Box, IconButton, TableFooter, TablePagination, Modal, Typography, Menu, MenuItem, Input, FormControlLabel, Checkbox, Switch } from "@mui/material";
import { ArrowLineLeft, ArrowLineRight, CaretLeft, CaretRight, Check, DotsThreeOutlineVertical, Minus, X, XCircle } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { SimpleButton } from "@/components/SimpleButton";
import { ZodString, z } from "zod";
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

const ContaGerencialFormSchema = z.object({
  id: z.coerce.number(),
  accountNumber: z.string().min(1, { message: "Preencha o campo corretamente" }),
  accountName: z.string(),
  companyId: z.string(),
  companyName: z.string(),

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

type createDataProps = {
  id: number,
  accountNumber: string,
  accountName: string,
  companyName?: string,
  companyId: number,
  isActive?: boolean,
  isDeleted?: boolean,
  company: {
    id: number,
    siengeId: number,
    name: string,
    cnpj: string,
    tradeName: string,
    isActive?: boolean,
    isDeleted?: boolean,
  }
}

type settingsProps = {
  name: string,
  type: string,
}

type ContaGerencialFormData = z.infer<typeof ContaGerencialFormSchema>

export default function ContaGerencial() {
  //States
  const [rows, setRows] = useState<createDataProps[]>([]);
  const [settings, setSettings] = useState<settingsProps[]>([]);
  const [CompanyFound, setCompanyFound] = useState<boolean>();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorElContaGerencial, setAnchorElContaGerencial] = useState<null | HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState(-1);
  const [nameModal, setNameModal] = useState('');
  const [changeTypeModal, setChangeTypeModal] = useState('');
  const [buttonRemoveFilters, setButtonRemoveFilters] = useState(false);


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const { register, handleSubmit, getValues, formState, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<ContaGerencialFormData>({
    resolver: zodResolver(ContaGerencialFormSchema)
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


  const handleCloseContaGerencialMenu = () => {
    setAnchorElContaGerencial(null);
  };

  const handleRedirectContaGerencial = (row: createDataProps, setting: string) => {
    setAnchorElContaGerencial(null);
  };

  const handleOpenOptionsPerson = (index: number, row: createDataProps) => (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElContaGerencial(event.currentTarget);
    setOpenIndex(index);
  }

  function handleOpenModalOrActivateAction(typeModal: 'view' | 'create' | 'update' | 'disable' | 'delete' | 'reactivate' | 'restore', row?: createDataProps) {
    setChangeTypeModal(typeModal);
    if (typeModal === 'create') {
      setNameModal('Adicionar')
      setOpen(true);
    } else if (typeModal === 'view') {
      setNameModal('Visualizar')
      reset({ id: row?.id, accountNumber: row?.accountNumber, accountName: row?.accountName, companyId: String(row?.companyId), companyName: row?.company?.name });
      setOpen(true);
    } else if (typeModal === 'update') {
      setNameModal('Editar')
      loadCompany(row?.companyId.toString());
      reset({ id: row?.id, accountNumber: row?.accountNumber, accountName: row?.accountName, companyId: String(row?.companyId), companyName: row?.company?.name });
      setOpen(true);
    } else if (typeModal === 'delete') {
      api.put(`/api/Fidc/UpdateContaGerencial?typeId=4`, {
        id: row?.id,
        accountNumber: "",
        accountName: "",
        companyId: row?.companyId,
        companyName: "",
        isDeleted: true,
        isActive: false,
      })
        .then((response) => {
          toast.success(`Conta Gerencial excluída com sucesso`, {
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
          toast.error(`Não foi possível excluir a Conta Gerencial, tente novamente mais tarde.`, {
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
          fetchContaGerencial();
        })
      handleCloseContaGerencialMenu();
    } else if (typeModal === 'disable' || typeModal === 'restore') {
      api.put(`/api/Fidc/UpdateContaGerencial?typeId=3`, {
        id: row?.id,
        accountNumber: "",
        accountName: "",
        companyName: "",
        companyId: row?.companyId,
        isDeleted: true,
        isActive: false,
      })
        .then((response) => {
          toast.success(`ContaGerencial ${typeModal === 'disable' ? 'desativado' : 'restaurado'} com sucesso`, {
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
          toast.error(`Conta Gerencial ${typeModal === 'disable' ? 'desativar' : 'restaurar'} o tipo de documento, tente novamente mais tarde.`, {
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
          fetchContaGerencial();
        })
      handleCloseContaGerencialMenu();
    } else if (typeModal === 'reactivate') {
      api.put(`/api/Fidc/UpdateContaGerencial?typeId=2`, {
        id: row?.id,
        accountNumber: "",
        accountName: "",
        companyId: row?.companyId,
        companyName: "",
        isDeleted: true,
        isActive: false,
      })
        .then((response) => {
          toast.success(`Conta Gerencial habilitada com sucesso`, {
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
          toast.error(`Não foi possível habilitar a Conta Gerencial, tente novamente mais tarde.`, {
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
          fetchContaGerencial();
        })
      handleCloseContaGerencialMenu();
    } else {
      console.log('Algo deu errado')
    }
  }

  async function handleActionContaGerencial(data: createDataProps) {
    const { id, accountNumber, accountName, companyId, company } = data;
    if (changeTypeModal === 'create') {
      await api.post(`/api/Fidc/CreateContaGerencial`, {
        accountNumber,
        accountName,
        companyId: Number(companyId),
        company,
        isDeleted: false,
        isActive: true,
      })
        .then(() => {
          fetchContaGerencial();
          toast.success(`Conta Gerencial ${accountName} adicionado com sucesso`, {
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
          toast.error(`Não foi possÍvel adicionar a Conta Gerencial`, {
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
      await api.put(`/api/Fidc/UpdateContaGerencial?typeId=1`, {
        id,
        accountNumber,
        accountName,
        companyId,
        companyName: "",
        isDeleted: false,
        isActive: true,
      })
        .then(() => {
          fetchContaGerencial();
          toast.success(`Conta Gerencial ${accountName} editado com sucesso.`, {
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
          toast.error(`Não foi possÍvel editar Conta Gerencial`, {
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
    reset({ ContaGerencialId: 0, name: '' });
    reset({ id: 0, companyId: '', companyName: '' });
  }

  async function loadCompany(companyId: string) {
    await api.get(`/api/Configuracoes/GetEmpresaPorSiengeId/${Number(companyId)}`)
      .then((response) => {
        reset({ companyName: response.data.name });
        setCompanyFound(true);
      })
      .catch(() => {
        setCompanyFound(false);
      })
  }

  async function fetchContaGerencial() {
    await api.get(`/api/Fidc/GetContaGerencial`)
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
      { name: 'Habilitar', type: 'reactivate', },
      { name: 'Restaurar', type: 'restore', },
    ]

    setSettings(getSettings);
  }


  function handleRemoveFilters() {
    setButtonRemoveFilters(false);
    fetchContaGerencial();
  }

  useEffect(() => {
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
            <span>Cadastro Conta Gerencial</span>
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
                <StyledTableCell>Numero de Conta</StyledTableCell>
                <StyledTableCell>Nome da Conta</StyledTableCell>
                <StyledTableCell>Empresa</StyledTableCell>
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
                    {row.accountNumber}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.accountName}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.company?.siengeId + " - " + row?.company?.name}
                  </TableCell>
                  <TableCell align="right">{(row?.isActive && !row?.isDeleted) ? <Check style={{ color: '#009922' }} size={25} /> : ((!row?.isActive && !row.isDeleted) ? <X style={{ color: '#FF0000' }} size={25} /> : <Minus style={{ color: '#E1E5EB' }} size={25} />)}</TableCell>
                  <TableCell align="right">
                    <Button aria-label="edit" style={{ backgroundColor: '#D4E9EE', minWidth: '32px' }} onClick={handleOpenOptionsPerson(index, row)}>
                      <DotsThreeOutlineVertical style={{ color: '#246776' }} size={20} />
                    </Button>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorElContaGerencial}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElContaGerencial) && index === openIndex}
                      onClose={handleCloseContaGerencialMenu}
                    >
                      {settings.map((setting) => {
                        if (setting.type === 'create') {
                          // Não renderizar "Adicionar" e "Buscar"
                          return null;
                        }

                        // Renderizar sempre os menus que não dependem do status
                        if (setting.type === 'view') {
                          return (
                            <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting?.type, row)}>
                              <Typography textAlign="center">{setting.name}</Typography>
                            </MenuItem>
                          );
                        }

                        // Renderizar os menus com base no status
                        if (row?.isActive && !row.isDeleted) {
                          // Caso o status seja 1 (Ativado)
                          if (setting.type === 'update' || setting.type === 'disable' || setting.type === 'delete') {
                            return (
                              <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting?.type, row)}>
                                <Typography textAlign="center">{setting.name}</Typography>
                              </MenuItem>
                            );
                          }
                        } else if (!row?.isActive && !row.isDeleted) {
                          // Caso o status seja 2 (Desativado)
                          if (setting.type === 'reactivate' || setting.type === 'delete') {
                            return (
                              <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting?.type, row)}>
                                <Typography textAlign="center">{setting.name}</Typography>
                              </MenuItem>
                            );
                          }
                        } else if (!row?.isActive && row.isDeleted) {
                          // Caso o status seja 3 (Excluído)
                          if (setting.type === 'restore') {
                            return (
                              <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting?.type, row)}>
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
            <form onSubmit={handleSubmit(handleActionContaGerencial)}>
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
                    <ContaGerencialUpdateOrCreate>
                      <Label size={"50"}>
                        <Text>Número da conta  <span style={{ color: "$red500" }}>*</span></Text>
                        <input style={inputStyle} {...register("accountNumber")} disabled={changeTypeModal === 'view' && true} />
                        {errors.accountNumber && (
                          <span>   {errors.accountNumber.message} </span>
                        )}
                      </Label>

                      <Label size={"45"}>
                        <Text>Nome da conta  <span style={{ color: "$red500" }}>*</span></Text>
                        <input style={inputStyle} {...register("accountName")} disabled={changeTypeModal === 'view' && true} />
                        {errors.accountName && (
                          <span>   {errors.accountName.message} </span>
                        )}
                      </Label>

                      <Label size={changeTypeModal != 'view' ? "30" : "45"}>
                        <Text>Numero da empresa <span style={{ color: "$red500" }}>*</span></Text>
                        <input style={inputStyle} min="0"  {...register("companyId")} type="number" disabled={changeTypeModal === 'view' && true} />
                        {errors.companyId && (
                          <span>{errors.companyId.message} </span>
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
                              const companyId = getValues("companyId");
                              loadCompany(companyId)
                            }}
                            styleColors="orangeGradient"
                            size="auto"
                          />
                        </Label>
                      }
                      <Label size={"50"}>
                        <Text>Nome da empresa <span style={{ color: "$red500" }}></span></Text>
                        <input style={inputStyle} {...register("companyName")} disabled={true} />
                        {errors.companyName && (
                          <span>   {errors.companyName.message} </span>
                        )}
                      </Label>


                    </ContaGerencialUpdateOrCreate>

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