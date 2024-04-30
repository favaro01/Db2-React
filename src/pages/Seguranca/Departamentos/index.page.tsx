import { withSSRAuth } from "@/utils/withSSRAuth";
import { Controller, useForm } from "react-hook-form"
import { setupAPIClient } from "@/services/api";
import Seguranca from "../index.page";
import { ActionsHeader, Container, ContentModal, FooterModal, Header, HeaderModal, Label, Text, TitleBox, DepartmentUpdateOrCreate, DepartmentSearch, LoadingScreen } from "./styles";
import { styled, useTheme } from '@mui/material/styles';
import { Table, Button, TableRow, TableHead, TableContainer, TableCell, TableBody, tableCellClasses, Box, IconButton, TableFooter, TablePagination, Modal, Typography, Menu, MenuItem, Input, FormControlLabel, Checkbox, Switch, CircularProgress } from "@mui/material";
import { ArrowLineLeft, ArrowLineRight, CaretLeft, CaretRight, Check, DotsThreeOutlineVertical, Minus, X, XCircle } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { SimpleButton } from "@/components/SimpleButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from "@/services/apiClient";

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

const inputStyle ={  
  width: '100%',
  maxWidth: '-webkit-fill-available',
  height: 43,
  padding: '2px 15px',
  borderRadius: 10, 
  border: '1px solid #F3F6F9',
  marginTop: 6,  
}

const DepartmentFormSchema = z.object({
  id: z.coerce.number(), 
  name: z.string()
  .min(3, {message: "Preencha o campo corretamente"})
  .regex(/[a-zA-Z]+/g, {message: "O nome de usuário deve conter apenas letras"} ),  
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
  departmentId: number,
  deptName: string,  
  deptDescription: string,  
  deptType: string,
  status: number,
  isActive: boolean,
  isDelete: boolean,
  companyId: number
}

type settingsProps ={
  name: string,
  type: string,
}

type DepartmentFormData = z.infer<typeof DepartmentFormSchema>

export default function Departamentos() {
  const [loadingAction, setLoadingAction] = useState(false);
   //States
   const [rows, setRows] = useState<createDataProps[]>([]);
   const [settings, setSettings] = useState<settingsProps[]>([]);
   const [open, setOpen] = useState(false);  
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [anchorElDepartment, setAnchorElDepartment] = useState<null | HTMLElement>(null);    
   const [openIndex, setOpenIndex] = useState(-1);
   const [nameModal, setNameModal] = useState('');
   const [changeTypeModal, setChangeTypeModal] = useState('');
   const notify = () => toast("Wow so easy!");
   
   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
   const { register, handleSubmit, formState , reset, formState: {errors, isSubmitting, isSubmitSuccessful} } = useForm<DepartmentFormData>({
     resolver: zodResolver(DepartmentFormSchema)
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
   
   const handleCloseDepartmentMenu = () => {
     setAnchorElDepartment(null);
   };
   const handleRedirectDepartment = (row:createDataProps, setting:string) => {          
 
     setAnchorElDepartment(null);
   };
 
   const handleOpenOptionsPerson= (index:number, row:createDataProps) => (event: React.MouseEvent<HTMLElement>) =>  {
     setAnchorElDepartment(event.currentTarget);
     setOpenIndex(index);
   }
 
   function handleOpenModalOrActivateAction(typeModal: 'view' | 'create' | 'update' | 'search' | 'disable' | 'delete' | 'reactivate' | 'restore' , row?:createDataProps) {
     setChangeTypeModal(typeModal);
     setLoadingAction(true);
     if(typeModal === 'create'){
       setNameModal('Adicionar')
       setOpen(true);
       setLoadingAction(false);
     }else if(typeModal === 'search'){
       setNameModal('Busca avançada')
       setOpen(true);
       setLoadingAction(false);
     }else if(typeModal === 'view'){
       setNameModal('Visualizar usuário')
       reset({ id: row?.departmentId, name: row?.deptName});
       setOpen(true);
       setLoadingAction(false);
     } else if(typeModal === 'update'){
       setNameModal('Editar usuário')
       reset({ id: row?.departmentId, name: row?.deptName });
       setOpen(true);
       setLoadingAction(false);
     } else if(typeModal === 'delete'){
        api.put(`/api/Department/deleted/${row?.departmentId}`)
        .then((response) => {              
          toast.success(`Departamento excluído com sucesso`, {
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
          toast.error(`Não foi possível excluir o departamento, tente novamente mais tarde.`, {
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
          fetchDepartments();  
          setLoadingAction(false);
        })            
       handleCloseDepartmentMenu();
     } else if(typeModal === 'disable' || typeModal === 'restore'){
          api.put(`/api/Department/disable/${row.departmentId}`)
          .then((response) => {      
            fetchDepartments();  
            toast.success(`Departamento ${typeModal === 'disable' ? 'desativado' : "restaurado"} com sucesso`, {
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
            toast.error(`Não foi possível ${typeModal === 'disable' ? 'desativar' : "restaurar"} o departamento, tente novamente mais tarde.`, {
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
       handleCloseDepartmentMenu();          
     } else if(typeModal === 'reactivate'){
        api.put(`/api/Department/activate/${row.departmentId}`)
        .then((response) => {      
          fetchDepartments();  
          toast.success(`Departamento habilitado com sucesso`, {
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
          toast.error(`Não foi possível habilitar o departamento, tente novamente mais tarde.`, {
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
       handleCloseDepartmentMenu();          
     } else{    
       console.log('Algo deu errado')        
     }
   }
 
  async function handleActionDepartment(data:DepartmentFormData) {
    setLoadingAction(true);
    const { id, name } = data;     
    if(changeTypeModal === 'create'){
      await api.post(`/api/Department`,{
        deptName: name,        
        deptDescription: name,
        deptType: "", 
        isActive: true,
        isDelete: false,  
        companyId: 1
      })
      .then(() => {
        fetchDepartments();
        toast.success(`Departamento ${name} adicionado com sucesso com sucesso`, {
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
        console.log(err);        
        toast.error(`Não foi possÍvel adicionar departamento`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });     
      }) .finally(() => {
        setLoadingAction(false);
      });                
      handleClose();      
     }else if(changeTypeModal === 'update') {      
      await api.put(`/api/Department`,{
        departmentId: id,
        deptName: name,        
        deptDescription: name,
        deptType: "1", 
        isActive: true,
        isDelete: false,  
        companyId: 1  
      })
      .then(() => {
        fetchDepartments();
        toast.success(`Departamento ${name} editado com sucesso com sucesso`, {
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
        console.log(err);        
        toast.error(`Não foi possÍvel editar departamento`, {
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
 
   function resetInputs(){
     reset({ name: ''});
   }

   async function fetchDepartments() {
    setLoadingAction(true);
    await api.get(`api/Department/GetAll`)
    .then(response => {      
      setRows(response.data);
    })
    .catch(() => {        
    }).finally(() => {
      setLoadingAction(false);
    });           

    const getSettings = [
      { name:'Visualizar', type: 'view',},
      { name:'Editar', type: 'update',},
      { name:'Desativar', type: 'disable',},
      { name:'Excluir', type: 'delete',},
      { name:'Adicionar', type: 'create',},
      { name:'Buscar', type: 'search',},
      { name:'Habilitar', type: 'reactivate',},
      { name:'Restaurar', type: 'restore',},
    ]        

    setSettings(getSettings);      
  }
     
   useEffect(() => {
     fetchDepartments();
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
      <Seguranca> 
        <Container>
          <Header>
            <TitleBox>
              <span>Departamentos</span>
            </TitleBox>
            <ActionsHeader>            
              {/* <GradientButton title="Buscar" onClick={() => handleOpenModalOrActivateAction("search")} styleColors="orangeGradient"  disabled={!(settings.some(setting => setting.type === 'search'))} size="auto"/> */}
              <GradientButton title="Adicionar" onClick={() => handleOpenModalOrActivateAction("create")} styleColors="db2Gradient" disabled={!(settings.some(setting => setting.type === 'create'))} size="auto"/>
            </ActionsHeader>
          </Header>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
              <TableHead className="TableHeader">
                <TableRow>
                  <StyledTableCell>Nome</StyledTableCell>                
                  <StyledTableCell align="right">Status</StyledTableCell>
                  <StyledTableCell align="right">Ações</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : rows
                  ).map((row, index) => (
                  <TableRow key={row.departmentId}>
                    <TableCell component="th" scope="row">
                      {row.deptName}
                    </TableCell>                  
                    <TableCell align="right">{(row?.isActive && !row?.isDelete) ? <Check style={{color: '#009922'}} size={25} /> : ( (!row?.isActive && !row.isDelete) ? <X style={{color: '#FF0000'}} size={25}/> : <Minus style={{color: '#E1E5EB'}} size={25} /> )}</TableCell>                  
                    <TableCell align="right">
                      <Button aria-label="edit" style={{backgroundColor: '#D4E9EE', minWidth: '32px'}} onClick={handleOpenOptionsPerson(index, row)}>
                        <DotsThreeOutlineVertical style={{color: '#246776'}} size={20} />
                      </Button>
                      <Menu                      
                        id="menu-appbar"
                        anchorEl={anchorElDepartment}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}                                      
                        open={Boolean(anchorElDepartment) && index === openIndex}
                        onClose={handleCloseDepartmentMenu}
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
                          if (row?.isActive && !row.isDelete) {
                            // Caso o status seja 1 (Ativado)
                            if (setting.type === 'update' || setting.type === 'permission' || setting.type === 'disable' || setting.type === 'delete' || setting.type === 'resetPassword') {
                              return (
                                <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting.type, row)}>
                                  <Typography textAlign="center">{setting.name}</Typography>
                                </MenuItem>
                              );
                            }
                          } else if (!row?.isActive && !row.isDelete) {
                            // Caso o status seja 2 (Desativado)
                            if (setting.type === 'reactivate' || setting.type === 'delete') {
                              return (
                                <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting.type, row)}>
                                  <Typography textAlign="center">{setting.name}</Typography>
                                </MenuItem>
                              );
                            }
                          } else if (!row?.isActive && row.isDelete) {
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
            style={{width: '100%', marginLeft: 'auto'}}
          />
          <Modal
            open={open}
            onClose={handleClose}          
          >
            <Box sx={style}>
              <form onSubmit={handleSubmit(handleActionDepartment)}>
                <input type="hidden" {...register("id")} />
                <HeaderModal>
                    <span>{nameModal}</span>
                    <button style={{backgroundColor: 'transparent', border: 0, lineHeight: 1, cursor: 'pointer', }} onClick={handleClose}>
                      <XCircle style={{color: "#B1B1B1"}} size={20} />
                    </button>
                </HeaderModal>
                <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0,}} />
                <ContentModal>
                  {                
                    changeTypeModal === 'create' || changeTypeModal === 'update' || changeTypeModal === 'view' ? (              
                        <DepartmentUpdateOrCreate>
                          <Label size={"100"}>    
                            <Text>Nome do departamento <span style={{color: "$red500"}}>*</span></Text>             
                            <input style={inputStyle} {...register("name")} disabled={changeTypeModal === 'view' && true} />
                            {errors.name && (
                              <span>   {errors.name.message} </span>
                            )}
                          </Label>                                                                                                      
                        </DepartmentUpdateOrCreate>
                      ) : 
                      <DepartmentSearch>                          
                      </DepartmentSearch>                           
                  }
                

                </ContentModal>
                <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0,}} />
                {
                  changeTypeModal != 'view' &&
                  <FooterModal>
                    <SimpleButton title="Cancelar" onClick={handleClose} styleColors="gray" />
                    <SimpleButton 
                      title={changeTypeModal === 'search' ? 'Buscar' : (changeTypeModal === 'edit' ? 'Editar' : 'Salvar')} 
                      disabled={isSubmitting === false ? (changeTypeModal === 'view' ? true : false) : true} 
                      styleColors="db2" 
                      loading={isSubmitting}
                      type="submit" 
                    />
                  </FooterModal>
                }
              </form>
            </Box>
          </Modal>
        </Container>
        <ToastContainer />
      </Seguranca>
    </>
  )
}


export const getServerSideProps = withSSRAuth(async (ctx) => {  
  return {
    props: {}
  }
})