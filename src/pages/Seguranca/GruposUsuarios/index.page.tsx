import { withSSRAuth } from "@/utils/withSSRAuth";
import { Controller, useForm } from "react-hook-form"
import { setupAPIClient } from "@/services/api";
import Seguranca from "../index.page";
import { ActionsHeader, Container, ContentModal, FooterModal, Header, HeaderModal, Label, Text, TitleBox, UserGroupsSearch, UserGroupsUpdateOrCreate, TitlePermission, UserHasPermission, UserHasPermissionLeft, UserHasPermissionRight, } from "./styles";
import { styled, useTheme } from '@mui/material/styles';
import { Table, Button, TableRow, TableHead, TableContainer, TableCell, TableBody, tableCellClasses, Box, IconButton, TableFooter, TablePagination, Modal, Typography, Menu, MenuItem, Input, FormControlLabel, Checkbox, Switch } from "@mui/material";
import { ArrowLineLeft, ArrowLineRight, Bank, CaretLeft, CaretRight, Check, DotsThreeOutlineVertical, Minus, X, XCircle } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { SimpleButton } from "@/components/SimpleButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

const inputStyle ={  
  width: '100%',
  maxWidth: '-webkit-fill-available',
  height: 43,
  padding: '2px 15px',
  borderRadius: 10, 
  border: '1px solid #F3F6F9',
  marginTop: 6,  
}

const UserGroupsFormSchema = z.object({
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
  id: number,
  name: string,  
  status: number,
}

type settingsProps ={
  name: string,
  type: string,
}

type UserGroupsFormData = z.infer<typeof UserGroupsFormSchema>

export default function GruposUsuarios() {
  //States
  const [rows, setRows] = useState<createDataProps[]>([]);
  const [settings, setSettings] = useState<settingsProps[]>([]);
  const [open, setOpen] = useState(false);  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorElUserGroups, setAnchorElUserGroups] = useState<null | HTMLElement>(null);    
  const [openIndex, setOpenIndex] = useState(-1);
  const [nameModal, setNameModal] = useState('');
  const [changeTypeModal, setChangeTypeModal] = useState('');
  const [opFidcView, setOpFidcView] = useState(false);
  const [opFidcAdd, setOpFidcAdd] = useState(false);
  const [opFidcEdit, setOpFidcEdit] = useState(false);
  const [opFidcDelete, setOpFidcDelete] = useState(false);
  const [opFidcReports, setOpFidcReports] = useState(false);
  
  
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const { register, handleSubmit, formState , reset, formState: {errors, isSubmitting, isSubmitSuccessful} } = useForm<UserGroupsFormData>({
    resolver: zodResolver(UserGroupsFormSchema)
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
  
  const handleCloseUserGroupsMenu = () => {
    setAnchorElUserGroups(null);
  };
  const handleRedirectUserGroups = (row:createDataProps, setting:string) => {          

    setAnchorElUserGroups(null);
  };

  const handleOpenOptionsPerson= (index:number, row:createDataProps) => (event: React.MouseEvent<HTMLElement>) =>  {
    setAnchorElUserGroups(event.currentTarget);
    setOpenIndex(index);
  }

  function handleUpdatePermission(){
    toast.success('Permissões salvas com sucesso', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });  
    handleClose();
  }

  function handleOpenModalOrActivateAction(typeModal: 'view' | 'create' | 'update' | 'search' | 'permission' | 'disable' | 'delete' | 'reactivate' | 'restore' , row?:createDataProps) {
    setChangeTypeModal(typeModal);
    if(typeModal === 'create'){
      setNameModal('Adicionar')
      setOpen(true);
    }else if(typeModal === 'search'){
      setNameModal('Busca avançada')
      setOpen(true);
    }else if(typeModal === 'view'){
      setNameModal('Visualizar usuário')
      reset({ id: row?.id, name: row?.name});
      setOpen(true);
    } else if(typeModal === 'update'){
      setNameModal('Editar usuário')
      reset({ id: row?.id, name: row?.name });
      setOpen(true);
    } else if(typeModal === 'permission'){
        setNameModal('Permissões')
        setOpen(true);
    } else if(typeModal === 'delete'){
      let updateList = rows.map(item => {
        if(item.id === row.id){
          return {...item, status: 3}
        }
        return item
      })
      setRows(updateList);
      toast.error(`Grupo de usuários ${row?.name} excluído`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });  
      handleCloseUserGroupsMenu();
    } else if(typeModal === 'disable' || typeModal === 'restore'){
      let updateList = rows.map(item => {
        if(item.id === row.id){
          return {...item, status: 2}
        }
        return item
      })
      setRows(updateList);
      if(typeModal === 'disable'){
        toast.error(`Grupo de usuários ${row?.name} desativado`, {
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
      if(typeModal === 'restore'){
        toast.success(`Grupo de usuários ${row?.name} restaurado`, {
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
      handleCloseUserGroupsMenu();          
    } else if(typeModal === 'reactivate'){
      let updateList = rows.map(item => {
        if(item.id === row.id){
          return {...item, status: 1}
        }
        return item
      })
      setRows(updateList);
      toast.success(`Grupo de usuários ${row?.name} Habilitado`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });  
      handleCloseUserGroupsMenu();          
    } else{    
      console.log('Algo deu errado')        
    }
  }

  function handleActionUserGroups(data:UserGroupsFormData) {
    const { id, name } = data;  
    if(changeTypeModal === 'create'){
      const newUserGroups =
      {
        id: rows.length +1,
        name: name,        
        status: 1
      }
      setRows(rows => [...rows, newUserGroups]);    
      toast.success('Grupo de usuário adicionado com sucesso', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });  
      handleClose()
    }else if(changeTypeModal === 'update') {      
      let updateList = rows.map(item => {
        if(item.id === id){
          return {...item,  name }
        }
        return item
      })      
      setRows(updateList);
      toast.success('Grupo de usuário modificado com sucesso', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });  
      handleClose();
    }        
  }

  function resetInputs(){
    reset({ id: 0, name: ''});
  }

  function handleHasPermission(namePermission: string, parentName: string, index: number, event: React.ChangeEvent<HTMLInputElement>){        
    if(namePermission === 'operacaoFidc'){
      if(parentName === 'parent'){
        if(opFidcView && opFidcAdd && opFidcEdit && opFidcDelete && opFidcReports){
          setOpFidcView(!opFidcView)
          setOpFidcAdd(!opFidcAdd)
          setOpFidcEdit(!opFidcEdit)
          setOpFidcDelete(!opFidcDelete)
          setOpFidcReports(!opFidcReports)          
        }else{
          setOpFidcView(true)
          setOpFidcAdd(true)
          setOpFidcEdit(true)
          setOpFidcDelete(true)
          setOpFidcReports(true)
        }
      }else if(index === 0){
        setOpFidcView(!opFidcView)
      }else if(index === 1){
        setOpFidcAdd(!opFidcAdd)
      }else if(index === 2){
        setOpFidcEdit(!opFidcEdit)
      }else if(index === 3){
        setOpFidcDelete(!opFidcDelete)
      }else{
        setOpFidcReports(!opFidcReports)
      }
    }    
  }
    
  useEffect(() => {
    function fetchUserGroups() {
      const getUserGroups = [
        {id: 1, name: "Acesso Executivo", status: 1},
        {id: 2, name: "Controle Diretor", status: 1},
        {id: 3, name: "Permissão Principal", status: 2},
        {id: 4, name: "Autorização Estratégica", status: 1},
        {id: 5, name: "Domínio Corporativo", status: 1},
        {id: 6, name: "Controle Centralizado", status: 1},
        {id: 7, name: "Permissão Elevada", status: 1},
        {id: 8, name: "Autorização Central", status: 2},
        {id: 9, name: "Acesso Premium Corp", status: 3},
        {id: 10, name: "Qualidade e Controle", status:  1},
      ];
      setRows(getUserGroups);

      const getSettings = [
        { name:'Visualizar', type: 'view',},
        { name:'Editar', type: 'update',},
        { name:'Permissão', type: 'permission',},
        { name:'Desativar', type: 'disable',},
        { name:'Excluir', type: 'delete',},
        { name:'Adicionar', type: 'create',},
        { name:'Buscar', type: 'search',},
        { name:'Habilitar', type: 'reactivate',},
        { name:'Restaurar', type: 'restore',},
      ]        

      setSettings(getSettings);      
    }

    fetchUserGroups();
  }, [])  

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      resetInputs()
    }
  }, [formState, isSubmitSuccessful, reset])
  
  return (
    <Seguranca> 
      <Container>
        <Header>
          <TitleBox>
            <span>Grupo de Usuários</span>
          </TitleBox>
          <ActionsHeader>            
            <GradientButton title="Buscar" onClick={() => handleOpenModalOrActivateAction("search")} styleColors="orangeGradient"  disabled={!(settings.some(setting => setting.type === 'search'))} size="auto"/>
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
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>                  
                  <TableCell align="right">{row.status === 1 ? <Check style={{color: '#009922'}} size={25} /> : ( row.status === 2 ? <X style={{color: '#FF0000'}} size={25}/> : <Minus style={{color: '#E1E5EB'}} size={25} /> )}</TableCell>                  
                  <TableCell align="right">
                    <Button aria-label="edit" style={{backgroundColor: '#D4E9EE', minWidth: '32px'}} onClick={handleOpenOptionsPerson(index, row)}>
                      <DotsThreeOutlineVertical style={{color: '#246776'}} size={20} />
                    </Button>
                    <Menu                      
                      id="menu-appbar"
                      anchorEl={anchorElUserGroups}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}                                      
                      open={Boolean(anchorElUserGroups) && index === openIndex}
                      onClose={handleCloseUserGroupsMenu}
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
                        if (row.status === 1) {
                          // Caso o status seja 1 (Ativado)
                          if (setting.type === 'update' || setting.type === 'permission' || setting.type === 'disable' || setting.type === 'delete' || setting.type === 'resetPassword') {
                            return (
                              <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting.type, row)}>
                                <Typography textAlign="center">{setting.name}</Typography>
                              </MenuItem>
                            );
                          }
                        } else if (row.status === 2) {
                          // Caso o status seja 2 (Desativado)
                          if (setting.type === 'reactivate' || setting.type === 'delete') {
                            return (
                              <MenuItem key={setting.type} onClick={() => handleOpenModalOrActivateAction(setting.type, row)}>
                                <Typography textAlign="center">{setting.name}</Typography>
                              </MenuItem>
                            );
                          }
                        } else if (row.status === 3) {
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
            <form onSubmit={handleSubmit(handleActionUserGroups)}>
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
                      <UserGroupsUpdateOrCreate>
                        <Label size={"100"}>    
                          <Text>Nome do Grupo <span style={{color: "$red500"}}>*</span></Text>             
                          <input style={inputStyle} {...register("name")} disabled={changeTypeModal === 'view' && true} />
                          {errors.name && (
                            <span>   {errors.name.message} </span>
                          )}
                        </Label>                                                                                          
                      </UserGroupsUpdateOrCreate>
                    ) : (changeTypeModal === 'permission' ? (
                      <UserHasPermission>
                        <UserHasPermissionRight>

                          <TitlePermission>
                            <Bank size={20} /> 
                            <h1>Operação FIDC</h1>
                          </TitlePermission>
                          <FormControlLabel
                              sx={{ml: 1 }}
                              label="Selecionar todos"
                              control={
                                <Checkbox
                                  checked={opFidcView && opFidcAdd && opFidcEdit && opFidcDelete && opFidcReports}                              
                                  onChange={(e) => handleHasPermission('operacaoFidc', 'parent', 0, e)}
                                />
                              }
                            />
                          <Box sx={{ display: "flex", flexDirection: "column", ml: 6 }}>
                            <FormControlLabel
                              label="Visualizar"
                              control={<Checkbox checked={opFidcView} onChange={(e) => handleHasPermission('operacaoFidc', 'child', 0, e)} />}
                            />
                            <FormControlLabel
                              label="Adicionar"
                              control={<Checkbox checked={opFidcAdd} onChange={(e) => handleHasPermission('operacaoFidc', 'child', 1, e)} />}
                            />
                            <FormControlLabel
                              label="Editar"
                              control={<Checkbox checked={opFidcEdit} onChange={(e) => handleHasPermission('operacaoFidc', 'child', 2, e)} />}
                            />
                            <FormControlLabel
                              label="Deletar"
                              control={<Checkbox checked={opFidcDelete} onChange={(e) => handleHasPermission('operacaoFidc', 'child', 3, e)} />}
                            />
                            <FormControlLabel
                              label="Relatórios"
                              control={<Checkbox checked={opFidcReports} onChange={(e) => handleHasPermission('operacaoFidc', 'child', 4, e)} />}
                            />
                          </Box>
                        </UserHasPermissionRight>                       
                      </UserHasPermission>
                    ) : (
                        <UserGroupsSearch>                          
                        </UserGroupsSearch>
                    ))                              
                }
              

              </ContentModal>
              <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0,}} />
              {
                changeTypeModal != 'view' &&
                <FooterModal>
                  <SimpleButton title="Cancelar" onClick={handleClose} styleColors="gray" />
                  {
                    changeTypeModal === 'create' || changeTypeModal === 'update' || changeTypeModal === 'search' ? (
                      <SimpleButton 
                        title={changeTypeModal === 'search' ? 'Buscar' : (changeTypeModal === 'update' ? 'Editar' : 'Salvar')} 
                        disabled={isSubmitting} 
                        styleColors="db2" 
                        loading={isSubmitting}
                        type="submit" 
                      />
                    ) : (
                      <SimpleButton 
                        title='Salvar'                         
                        styleColors="db2"                         
                        onClick={handleUpdatePermission}
                      />
                    )
                      
                  }
                </FooterModal>
              }
            </form>
          </Box>
        </Modal>
      </Container>
      <ToastContainer />
    </Seguranca>
  )
}


export const getServerSideProps = withSSRAuth(async (ctx) => {  
  return {
    props: {}
  }
})