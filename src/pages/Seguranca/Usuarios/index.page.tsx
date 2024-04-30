import { withSSRAuth } from "@/utils/withSSRAuth";
import { useForm } from "react-hook-form"
import { setupAPIClient } from "@/services/api";
import Seguranca from "../index.page";
import { ActionsHeader, Container, ContentModal, FooterModal, Header, HeaderModal, Label, LoadingScreen, Text, TitleBox, TitlePermission, UserHasPermission, UserHasPermissionLeft, UserHasPermissionRight, UserSearch, UserUpdateOrCreate } from "./styles";
import { styled, useTheme } from '@mui/material/styles';
import { Table, Button, TableRow, TableHead, TableContainer, TableCell, TableBody, tableCellClasses, Box, IconButton, TableFooter, TablePagination, Modal, Typography, Menu, MenuItem, Input, FormControlLabel, Checkbox, Switch, CircularProgress } from "@mui/material";
import { ArrowLineLeft, ArrowLineRight, ArrowsCounterClockwise, Bank, CaretLeft, CaretRight, Check, DotsThreeOutlineVertical, Gear, Lock, Minus, Money, X, XCircle } from "phosphor-react";
import { useContext, useEffect, useRef, useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { SimpleButton } from "@/components/SimpleButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputMask from 'react-input-mask';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from "@/services/apiClient";
import { AuthContext, signOut } from "@/contexts/AuthContext";
import { count } from "console";

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

const UserFormSchema = z.object({
  id: z.coerce.number(), 
  name: z.string()
  .min(3, {message: "Preencha o campo corretamente"})
  .regex(/[a-zA-Z]+/g, {message: "O nome de usuário deve conter apenas letras"} ),
  cpf: z.string()
  .min(11, {message: "Preencha o campo corretamente"})
  .max(14, {message: "O limite de caracteres são de 14. "})
  .regex(/^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/, {message: "O nome de usuário deve conter apenas letras"} ),
  // dtNasc: z.preprocess((arg) => {
  //   if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  // }, z.date().max(new Date(), { message: "A data de nascimento deve ser menor que a data atual" })),
  dtNasc: z.string().min(1, { message: 'Data de nascimento é necessária'}),
  department: z.string().min(1, { message: 'Selecione o departamento'}),
  email: z.string().min(1, { message: 'O E-mail é necessário'}).email(),
  commercialPhone: z.string(),
  extension: z.string(),
  cellPhone: z.string(),
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
  userId: number,
  name: string,
  userName?: string,
  document?: string,
  email?: string,
  company?: string,
  department?: string,
  departmentId?: number,
  companyId?: number,
  roles?: [
    {
      module: string,
      permission: [
        string
      ]
    }
  ],
  avatarImage: string,
  commercialPhone: string,
  extension: string,
  cellPhone: string,
  accessFirst?: true,
  isActive?: boolean,
  isDeleted?: boolean,
  id?: number,
}

type createDepartments = {
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

type UserFormData = z.infer<typeof UserFormSchema>

type userAccessProps = {
  "accessFirst": boolean,
  "avatarImage": string,
  "cellPhone": string,
  "commercialPhone":string,
  "company":string,
  "department":string,
  "extension":string,
  "name":string,
  "roles": [], 
  "userId": number
}

export default function Usuarios() {  
  const [loadingAction, setLoadingAction] = useState(false);
  const { user } = useContext(AuthContext);  

  const [userFull, setUserFull] = useState<userAccessProps>({} as userAccessProps);
  //States
  const [rows, setRows] = useState<createDataProps[]>([]);
  const [departments, setDepartments] = useState<createDepartments[]>([]);
  const [userGet, setUserGet] = useState<createDataProps>();
  const [settings, setSettings] = useState<settingsProps[]>([]);
  const [open, setOpen] = useState(false);  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);    
  const [openIndex, setOpenIndex] = useState(-1);
  const [nameModal, setNameModal] = useState('');
  const [changeTypeModal, setChangeTypeModal] = useState('');
  const [executiveAccess, setExecutiveAccess] = useState(false);

  const [opFidcView, setOpFidcView] = useState(false);
  const [opFidcAdd, setOpFidcAdd] = useState(false);
  const [opFidcEdit, setOpFidcEdit] = useState(false);
  const [opFidcDelete, setOpFidcDelete] = useState(false);
  const [opFidcReports, setOpFidcReports] = useState(false);

  const [paymentsView, setPaymentsView] = useState(false);
  const [paymentsAdd, setPaymentsAdd] = useState(false);
  const [paymentsEdit, setPaymentsEdit] = useState(false);
  const [paymentsDelete, setPaymentsDelete] = useState(false);
  const [paymentsReports, setPaymentsReports] = useState(false);
  
  const [securityView, setSecurityView] = useState(false);
  const [securityAdd, setSecurityAdd] = useState(false);
  const [securityEdit, setSecurityEdit] = useState(false);
  const [securityDelete, setSecurityDelete] = useState(false);
  const [securityReports, setSecurityReports] = useState(false);

  const [settingsView, setSettingsView] = useState(false);
  const [settingsAdd, setSettingsAdd] = useState(false);
  const [settingsEdit, setSettingsEdit] = useState(false);
  const [settingsDelete, setSettingsDelete] = useState(false);
  const [settingsReports, setSettingsReports] = useState(false);

  const [conciliationView, setConciliationView] = useState(false);
  const [conciliationAdd, setConciliationAdd] = useState(false);
  const [conciliationEdit, setConciliationEdit] = useState(false);
  const [conciliationDelete, setConciliationDelete] = useState(false);
  const [conciliationReports, setConciliationReports] = useState(false);

  const [buttonRemoveFilters, setButtonRemoveFilters] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchUserName, setSearchUserName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const dateToday = format(new Date(), 'yyyy-MM-dd');
  
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const { register, handleSubmit, formState , reset, formState: {errors, isSubmitting, isSubmitSuccessful} } = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema)
  });

  //Functions 
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetInputs();
    resetPermissions();
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
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleRedirectUser = (row:createDataProps, setting:string) => {          
    setAnchorElUser(null);
  };

  const handleOpenOptionsPerson= (index:number, row:createDataProps) => (event: React.MouseEvent<HTMLElement>) =>  {
    setAnchorElUser(event.currentTarget);
    setOpenIndex(index);
  }

  function handleOpenModalOrActivateAction(typeModal: 'view' | 'create' | 'update' | 'search' | 'permission' | 'resetPassword' | 'disable' | 'delete' | 'reactivate' | 'restore' , row?:createDataProps) {
    setLoadingAction(true);
    setChangeTypeModal(typeModal); 
    if(typeModal === 'create'){
      setNameModal('Adicionar')      
      reset({ id: row?.userId });
      setOpen(true);
      setLoadingAction(false);
    }else if(typeModal === 'search'){
      setNameModal('Busca avançada')
      setOpen(true);
      setLoadingAction(false);
    }else if(typeModal === 'view'){
      setNameModal('Visualizar usuário')
      api.get(`/api/User/`+row?.userId)
      .then(response => {        
        reset({ id: response.data?.userId, cellPhone: response.data?.cellPhone, cpf: response.data.document, commercialPhone: response.data?.commercialPhone, department: (response.data?.departmentId)?.toString(), email: response.data?.email,  name: response.data?.name, extension: response.data?.extension, dtNasc: format(new Date(response.data?.dtNasc), 'yyyy-MM-dd'),  });
        setOpen(true);
      })
      .catch(() => {      
        toast.error(`Encontramos um erro no usuário tente novamente mais tarde.`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }) 
      }).finally(() => {
        setLoadingAction(false);
      });          
    } else if(typeModal === 'update'){
      setNameModal('Editar usuário')    
      reset({ id: row?.userId });  
      api.get(`/api/User/`+row?.userId)
      .then(response => {        
        reset({ id: response.data?.userId, cellPhone: response.data?.cellPhone, cpf: response.data?.document, commercialPhone: response.data?.commercialPhone, department: (response.data?.departmentId)?.toString(), email: response.data?.email,  name: response.data?.name, extension: response.data?.extension, dtNasc: format(new Date(response.data?.dtNasc), 'yyyy-MM-dd'),  });
        setOpen(true);
      })
      .catch(() => {      
        toast.error(`Encontramos um erro no usuário tente novamente mais tarde.`, {
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
    } else if(typeModal === 'permission'){
      setNameModal('Permissões')
      api.get(`/api/User/`+row?.userId)
      .then(response => {        
        setUserGet(response.data);
        permissionPerUser(response.data);        
        setOpen(true);
      })
      .catch(() => {      
        toast.error(`Encontramos um erro nas permissões do usuário tente novamente mais tarde.`, {
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
    } else if(typeModal === 'resetPassword'){
      api.post(`/api/User/RefinedPassword/`+row?.userId)
      .then((response) => {        
        toast.success(`${response.data.message}`, {
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
        toast.error(`A senha não foi redefinida, tente novamente mais tarde.`, {
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
    } else if(typeModal === 'delete'){
      api.put(`/api/User/4`, {
        "userId": row?.userId
      })
      .then((response) => {              
        toast.success(`Usuário excluído com sucesso`, {
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
        toast.error(`Não foi possível excluir o usuário, tente novamente mais tarde.`, {
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
        fetchUsers();  
      }).finally(() => {
        setLoadingAction(false);
      });        
      handleCloseUserMenu();
    } else if(typeModal === 'disable' || typeModal === 'restore'){      
      if(typeModal === 'disable'){
        api.put(`/api/User/3`, {
          "userId": row?.userId
        })
        .then((response) => {      
          fetchUsers();  
          toast.success(`Usuário desativado com sucesso`, {
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
          toast.error(`Não foi possível desativar o usuário, tente novamente mais tarde.`, {
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
      }
      if(typeModal === 'restore'){
        api.put(`/api/User/5`, {
          "userId": row?.userId
        })
        .then((response) => {      
          fetchUsers();  
          toast.success(`Usuário restaurado com sucesso`, {
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
          toast.error(`Não foi possível restaurar o usuário, tente novamente mais tarde.`, {
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
      }
      handleCloseUserMenu();          
    } else if(typeModal === 'reactivate'){
      api.put(`/api/User/2`, {
        "userId": row?.userId
      })
      .then((response) => {      
        fetchUsers();  
        toast.success(`Usuário habilitado com sucesso`, {
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
        toast.error(`Não foi possível habilitar o usuário, tente novamente mais tarde.`, {
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
      handleCloseUserMenu();          
    } else{    
      console.log('Algo deu errado')        
    }
  }

  function resetPermissions(){
   setOpFidcView(false);
   setOpFidcAdd(false);
   setOpFidcEdit(false);
   setOpFidcDelete(false);
   setOpFidcReports(false);

   setPaymentsView(false);
   setPaymentsAdd(false);
   setPaymentsEdit(false);
   setPaymentsDelete(false);
   setPaymentsReports(false);
    
   setSecurityView(false);
   setSecurityAdd(false);
   setSecurityEdit(false);
   setSecurityDelete(false);
   setSecurityReports(false);

   setSettingsView(false);
   setSettingsAdd(false);
   setSettingsEdit(false);
   setSettingsDelete(false);
   setSettingsReports(false);

   setConciliationView(false);
   setConciliationAdd(false);
   setConciliationEdit(false);
   setConciliationDelete(false);
   setConciliationReports(false);
  }

  async function handleActionUser(data:UserFormData) {
    setLoadingAction(true);
    const { id, name, cpf, cellPhone, commercialPhone, department, dtNasc, email, extension } = data;    
    if(changeTypeModal === 'create'){  
      await api.post(`/api/User`,{
        name: name,        
        document: cpf,
        email, 
        departmentId: Number(department),
        companyId: 1,
        dtNasc, 
        commercialPhone, 
        cellPhone,
        extension,
        userUpdate: userFull.userId     
      })
      .then(() => {
        fetchUsers();
        toast.success(`Usuário ${name} adicionado com sucesso com sucesso`, {
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
        toast.error(`Não foi possÍvel adicionar usuário`, {
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
      // setRows(rows => [...rows, newUser]);         
      handleClose()
    }else if(changeTypeModal === 'update') {      
      await api.put(`/api/User/UpdateUser`,{
        userId: id,
        name: name,        
        document: cpf,
        dtNasc, 
        email, 
        departmentId: Number(department),
        commercialPhone, 
        cellPhone,
        extension,           
      })
      .then(() => {
        fetchUsers();
        toast.success(`Usuário ${name} editado com sucesso com sucesso`, {
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
        toast.error(`Não foi possÍvel editar usuário`, {
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
    }else{      
      setLoadingAction(false);      
      console.log('Erro');
    }        
  }

  async function handleUpdatePermission(){
    var hasOperacaoFidc = undefined;
    var hasFormasPagamento = undefined;
    var hasSeguranca = undefined;
    var hasConfiguracoes = undefined;
    var hasConciliacao = undefined;
    setLoadingAction(true);

    if(paymentsView || paymentsAdd || paymentsEdit || paymentsDelete || paymentsReports){
      var hasFormasPagamento = {
        "moduleId": 1,
        "permissions": [
          paymentsView ? 1 : undefined,
          paymentsAdd ? 2 : undefined,
          paymentsEdit ? 3 : undefined,
          paymentsDelete ? 4 : undefined,
          paymentsReports ? 5 : undefined,
        ].filter(permission => permission !== undefined)
      }
    }

    if(opFidcView || opFidcAdd || opFidcEdit || opFidcDelete || opFidcReports){
      var hasOperacaoFidc = {
        "moduleId": 2,
        "permissions": [
          opFidcView ? 1 : undefined,
          opFidcAdd ? 2 : undefined,
          opFidcEdit ? 3 : undefined,
          opFidcDelete ? 4 : undefined,
          opFidcReports ? 5 : undefined,
        ].filter(permission => permission !== undefined)
      }
    }    

    if(securityView || securityAdd || securityEdit || securityDelete || securityReports){
      var hasSeguranca = {
        "moduleId": 5,
        "permissions": [
          securityView ? 1 : undefined,
          securityAdd ? 2 : undefined,
          securityEdit ? 3 : undefined,
          securityDelete ? 4 : undefined,
          securityReports ? 5 : undefined,
        ].filter(permission => permission !== undefined)
      }
    }

    if(settingsView || settingsAdd || settingsEdit || settingsDelete || settingsReports){
      var hasConfiguracoes = {
        "moduleId": 4,
        "permissions": [
          settingsView ? 1 : undefined,
          settingsAdd ? 2 : undefined,
          settingsEdit ? 3 : undefined,
          settingsDelete ? 4 : undefined,
          settingsReports ? 5 : undefined,
        ].filter(permission => permission !== undefined)
      }
    }    

    if(conciliationView || conciliationAdd || conciliationEdit || conciliationDelete || conciliationReports){
      var hasConciliacao = {
        "moduleId": 3,
        "permissions": [
          conciliationView ? 1 : undefined,
          conciliationAdd ? 2 : undefined,
          conciliationEdit ? 3 : undefined,
          conciliationDelete ? 4 : undefined,
          conciliationReports ? 5 : undefined,
        ].filter(permission => permission !== undefined)
      }
    }  

    const permissionUser = {
      "userId": userGet.userId, 
      "modules": [
        hasOperacaoFidc,
        hasFormasPagamento,
        hasSeguranca,
        hasConfiguracoes,
        hasConciliacao
      ].filter(module => module !== undefined)
    }    
    permissionUser.modules.map(teste => {
      console.log(teste);
    })

    await api.put(`api/User/Roles`, {
      ...permissionUser
    })
    .then(response => {
      resetPermissions();
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
    })
    .catch(() => {   
      toast.error('Não foi possível salvar as permissões.', {
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
    handleClose();
  }

  function resetSearchInputs(){
    setSearchName('')
    setSearchDepartment('')
    setSearchStatus('')
    setSearchUserName('')
  }

  async function handleSearchUsers(){
    if(searchName || searchDepartment || searchStatus || searchUserName){      
      await api.get(`/api/User/search?${searchName && 'name='+searchName}${searchDepartment && "&departamentId="+Number(searchDepartment)}${searchUserName && "&userName="+searchUserName}${searchStatus != "3" && searchStatus ? "&isActive="+(searchStatus === "1" ? true : false): ''}${ searchStatus != "1" && searchStatus ? "&isDeleted="+(searchStatus === "3" ? true : false) : ''}`)
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
    }else {
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

  function resetInputs(){
    reset({ id: 0, cellPhone: '', cpf: '',  commercialPhone: '', department: '', email: '',  name: '', extension: '', dtNasc: '',  });
  }

  async function fetchDepartments(){
    await api.get(`api/Department/GetAll`)
    .then(response => {      
      setDepartments(response.data);
    })
    .catch(() => {        
    })  
  }

  function handleRemoveFilters() {
    setButtonRemoveFilters(false);
    resetSearchInputs();
    fetchUsers();
  }

  async function permissionPerUser(user:createDataProps){ 
    if(user.roles){
      user.roles.modules.map(role => {    
          if(role.moduleId === 1){
            role.permissions.map(permission => {
              if(permission === 1){
                setPaymentsView(true);
              } else if(permission === 2){
                setPaymentsAdd(true);
              } else if(permission === 3){
                setPaymentsEdit(true);
              } else if(permission === 4){
                setPaymentsDelete(true);
              } else if(permission === 5){
                setPaymentsReports(true);
              }                                   
            })
          }else if(role.moduleId === 2){
            role.permissions.map(permission => {
              if(permission === 1){
                setOpFidcView(true);
              } else if(permission === 2){
                setOpFidcAdd(true);
              } else if(permission === 3){
                setOpFidcEdit(true);
              } else if(permission === 4){
                setOpFidcDelete(true);
              } else if(permission === 5){
                setOpFidcReports(true);
              }                                   
            })
          }else if(role.moduleId === 3){
            role.permissions.map(permission => {
              if(permission === 1){
                setConciliationView(true);
              } else if(permission === 2){
                setConciliationAdd(true);
              } else if(permission === 3){
                setConciliationEdit(true);
              } else if(permission === 4){
                setConciliationDelete(true);
              } else if(permission === 5){
                setConciliationReports(true);
              }                                   
            })
          }else if(role.moduleId === 4){
            role.permissions.map(permission => {
              if(permission === 1){
                setSettingsView(true);
              } else if(permission === 2){
                setSettingsAdd(true);
              } else if(permission === 3){
                setSettingsEdit(true);
              } else if(permission === 4){
                setSettingsDelete(true);
              } else if(permission === 5){
                setSettingsReports(true);
              }                                   
            })
          }else if(role.moduleId === 5){
            role.permissions.map(permission => {
              if(permission === 1){
                setSecurityView(true);
              } else if(permission === 2){
                setSecurityAdd(true);
              } else if(permission === 3){
                setSecurityEdit(true);
              } else if(permission === 4){
                setSecurityDelete(true);
              } else if(permission === 5){
                setSecurityReports(true);
              }                                   
            })
          }
        }
      )    
    }   

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
    }else if(namePermission === 'formasPagamento'){
      if(parentName === 'parent'){
        if(paymentsView && paymentsAdd && paymentsEdit && paymentsDelete && paymentsReports){
          setPaymentsView(!paymentsView)
          setPaymentsAdd(!paymentsAdd)
          setPaymentsEdit(!paymentsEdit)
          setPaymentsDelete(!paymentsDelete)
          setPaymentsReports(!paymentsReports)          
        }else{
          setPaymentsView(true)
          setPaymentsAdd(true)
          setPaymentsEdit(true)
          setPaymentsDelete(true)
          setPaymentsReports(true)
        }
      }else if(index === 0){
        setPaymentsView(!paymentsView)
      }else if(index === 1){
        setPaymentsAdd(!paymentsAdd)
      }else if(index === 2){
        setPaymentsEdit(!paymentsEdit)
      }else if(index === 3){
        setPaymentsDelete(!paymentsDelete)
      }else{
        setPaymentsReports(!paymentsReports)
      }
    }else if(namePermission === 'seguranca'){
      if(parentName === 'parent'){
        if(securityView && securityAdd && securityEdit && securityDelete && securityReports){
          setSecurityView(!securityView)
          setSecurityAdd(!securityAdd)
          setSecurityEdit(!securityEdit)
          setSecurityDelete(!securityDelete)
          setSecurityReports(!securityReports)          
        }else{
          setSecurityView(true)
          setSecurityAdd(true)
          setSecurityEdit(true)
          setSecurityDelete(true)
          setSecurityReports(true)
        }
      }else if(index === 0){
        setSecurityView(!securityView)
      }else if(index === 1){
        setSecurityAdd(!securityAdd)
      }else if(index === 2){
        setSecurityEdit(!securityEdit)
      }else if(index === 3){
        setSecurityDelete(!securityDelete)
      }else{
        setSecurityReports(!securityReports)
      }
    }else if(namePermission === 'configuracoes'){
      if(parentName === 'parent'){
        if(settingsView && settingsAdd && settingsEdit && settingsDelete && settingsReports){
          setSettingsView(!settingsView)
          setSettingsAdd(!settingsAdd)
          setSettingsEdit(!settingsEdit)
          setSettingsDelete(!settingsDelete)
          setSettingsReports(!settingsReports)          
        }else{
          setSettingsView(true)
          setSettingsAdd(true)
          setSettingsEdit(true)
          setSettingsDelete(true)
          setSettingsReports(true)
        }
      }else if(index === 0){
        setSettingsView(!settingsView)
      }else if(index === 1){
        setSettingsAdd(!settingsAdd)
      }else if(index === 2){
        setSettingsEdit(!settingsEdit)
      }else if(index === 3){
        setSettingsDelete(!settingsDelete)
      }else{
        setSettingsReports(!settingsReports)
      }
    }else if(namePermission === 'conciliacao'){
      if(parentName === 'parent'){
        if(conciliationView && conciliationAdd && conciliationEdit && conciliationDelete && conciliationReports){
          setConciliationView(!conciliationView)
          setConciliationAdd(!conciliationAdd)
          setConciliationEdit(!conciliationEdit)
          setConciliationDelete(!conciliationDelete)
          setConciliationReports(!conciliationReports)          
        }else{
          setConciliationView(true)
          setConciliationAdd(true)
          setConciliationEdit(true)
          setConciliationDelete(true)
          setConciliationReports(true)
        }
      }else if(index === 0){
        setConciliationView(!conciliationView)
      }else if(index === 1){
        setConciliationAdd(!conciliationAdd)
      }else if(index === 2){
        setConciliationEdit(!conciliationEdit)
      }else if(index === 3){
        setConciliationDelete(!conciliationDelete)
      }else{
        setConciliationReports(!conciliationReports)
      }
    }else if(namePermission === 'UserGroups'){
      if(index === 0){
        setExecutiveAccess(!executiveAccess)
      }
    }
  }

  async function fetchUsers() {
    setLoadingAction(true);
    await api.get(`/api/User`)
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
      { name:'Permissão', type: 'permission',},
      { name:'Desativar', type: 'disable',},
      { name:'Excluir', type: 'delete',},
      { name:'Redefinir senha', type: 'resetPassword',},
      { name:'Adicionar', type: 'create',},
      { name:'Buscar', type: 'search',},
      { name:'Habilitar', type: 'reactivate',},
      { name:'Restaurar', type: 'restore',},
    ]        

    setSettings(getSettings);      
  }
    
  useEffect(() => {
    fetchUsers();    
    fetchDepartments(); 
    handleRemoveFilters();
  }, [])  

  useEffect(() => {    
    function generalUser(){      
      setUserFull(user?.userAccess);      
    }      
    generalUser();
  }, [user])
  
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
              <span>Usuários</span>
            </TitleBox>
            <ActionsHeader>            
              <GradientButton title="Buscar" onClick={() => handleOpenModalOrActivateAction("search")} styleColors="orangeGradient"  disabled={!(settings.some(setting => setting.type === 'search'))} size="auto"/>
              <GradientButton title="Adicionar" onClick={() => handleOpenModalOrActivateAction("create")} styleColors="db2Gradient" disabled={!(settings.some(setting => setting.type === 'create'))} size="auto"/>
              {
                buttonRemoveFilters && (                
                  <GradientButton title="Remover Filtros" onClick={() => handleRemoveFilters()} styleColors="removeGradient" size="auto"/>
                )
              }
            </ActionsHeader>
          </Header>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
              <TableHead className="TableHeader">
                <TableRow>
                  <StyledTableCell>Nome</StyledTableCell>
                  <StyledTableCell>Departamentos</StyledTableCell>
                  <StyledTableCell align="right">Status</StyledTableCell>
                  <StyledTableCell align="right">Ações</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : rows
                  ).map((row, index) => (
                  <TableRow key={row.userId}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell align="right">{(row?.isActive && !row?.isDeleted) ? <Check style={{color: '#009922'}} size={25} /> : ( (!row?.isActive && !row.isDeleted) ? <X style={{color: '#FF0000'}} size={25}/> : <Minus style={{color: '#E1E5EB'}} size={25} /> )}</TableCell>                  
                    <TableCell align="right">
                      <Button aria-label="edit" style={{backgroundColor: '#D4E9EE', minWidth: '32px'}} onClick={handleOpenOptionsPerson(index, row)}>
                        <DotsThreeOutlineVertical style={{color: '#246776'}} size={20} />
                      </Button>
                      <Menu                      
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}                                      
                        open={Boolean(anchorElUser) && index === openIndex}
                        onClose={handleCloseUserMenu}
                      >
                        {settings.map((setting) => {
                          if (setting.type === 'create' || setting.type === 'search') {
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
            style={{width: '100%', marginLeft: 'auto'}}
          />
          <Modal
            open={open}
            onClose={handleClose}                     
          >
            <Box sx={style}>
              <form onSubmit={handleSubmit(handleActionUser)}>
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
                        <UserUpdateOrCreate>
                          <Label size={"40"}>    
                            <Text>Nome</Text>             
                            <input style={inputStyle} {...register("name")} disabled={changeTypeModal === 'view' && true} />
                            {errors.name && (
                              <span>   {errors.name.message} </span>
                            )}
                          </Label>
                          <Label size={"30"}>    
                            <Text>CPF</Text> 
                            <input style={inputStyle} {...register("cpf")} disabled={changeTypeModal === 'view' && true} />                                      
                            {/* <InputMask mask="999.999.999-99" style={inputStyle} {...register("cpf")} disabled={changeTypeModal === 'view' && true} /> */}
                            {errors.cpf && (
                              <span> {errors.cpf.message} </span>
                            )}
                          </Label>       
                          <Label size={"25"}>    
                            <Text>Data de nascimento</Text>             
                            <input type="date" max={dateToday} style={inputStyle} {...register("dtNasc")} disabled={changeTypeModal === 'view' && true} />
                            {errors.dtNasc && (
                              <span> {errors.dtNasc.message} </span>
                            )}
                            {errors.id && (
                              <span> {errors.id.message} </span>
                            )}
                          </Label>         
                          <Label size={"35"}>    
                            <Text>Departamento</Text>             
                            <select style={inputStyle} {...register("department")} disabled={changeTypeModal === 'view' && true}>
                              <option value="">Departamento</option>
                              {
                                departments.map(department => {
                                  return <option key={department.departmentId} value={department.departmentId}>{department.deptName}</option>
                                })
                              }                 
                            </select>
                            {errors.department && (
                              <span> {errors.department.message} </span>
                            )}
                          </Label>
                          <Label size={"60"}>    
                            <Text>E-mail</Text>             
                            <input style={inputStyle} {...register("email")} disabled={changeTypeModal === 'view' && true} />
                            {errors.email && (
                              <span> {errors.email.message} </span>
                            )}
                          </Label>       
                          <Label size={"35"}>    
                            <Text>Tel. Comercial</Text>             
                            <InputMask mask="(99)9999-9999" style={inputStyle} {...register("commercialPhone")} disabled={changeTypeModal === 'view' && true} />
                            {errors.commercialPhone && (
                              <span> {errors.commercialPhone.message} </span>
                            )}                         
                          </Label>          
                          <Label size={"25"}>    
                            <Text>Ramal</Text>             
                            <input style={inputStyle} {...register("extension")} disabled={changeTypeModal === 'view' && true}/>
                            {errors.extension && (
                              <span> {errors.extension.message} </span>
                            )}
                          </Label>      
                          <Label size={"35"}>    
                            <Text>Tel. Celular</Text>             
                            <InputMask mask="(99)99999-9999" style={inputStyle} {...register("cellPhone")} disabled={changeTypeModal === 'view' && true} />
                            {errors.cellPhone && (
                              <span> {errors.cellPhone.message} </span>
                            )}
                          </Label>     
                        </UserUpdateOrCreate>
                      ) : (changeTypeModal === 'permission' ? (
                        <UserHasPermission>
                          <UserHasPermissionRight>                          
                            <TitlePermission>
                              <Money size={20} />
                              <h1>Formas de pagamento</h1>
                            </TitlePermission>
                            <FormControlLabel
                                sx={{ml: 1 }}
                                label="Selecionar todos"
                                control={
                                  <Checkbox
                                    checked={paymentsView && paymentsAdd && paymentsEdit && paymentsDelete && paymentsReports}                              
                                    onChange={(e) => handleHasPermission('formasPagamento', 'parent', 0, e)}
                                  />
                                }
                              />
                            <Box sx={{ display: "flex", flexDirection: "column", ml: 6 }}>
                              <FormControlLabel
                                label="Visualizar"
                                control={<Checkbox checked={paymentsView} onChange={(e) => handleHasPermission('formasPagamento', 'child', 0, e)} />}
                              />
                              <FormControlLabel
                                label="Adicionar"
                                control={<Checkbox checked={paymentsAdd} onChange={(e) => handleHasPermission('formasPagamento', 'child', 1, e)} />}
                              />
                              <FormControlLabel
                                label="Editar"
                                control={<Checkbox checked={paymentsEdit} onChange={(e) => handleHasPermission('formasPagamento', 'child', 2, e)} />}
                              />
                              <FormControlLabel
                                label="Deletar"
                                control={<Checkbox checked={paymentsDelete} onChange={(e) => handleHasPermission('formasPagamento', 'child', 3, e)} />}
                              />
                              <FormControlLabel
                                label="Relatórios"
                                control={<Checkbox checked={paymentsReports} onChange={(e) => handleHasPermission('formasPagamento', 'child', 4, e)} />}
                              />
                            </Box>                          
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
                            <TitlePermission>
                              <ArrowsCounterClockwise size={20} />
                              <h1>Conciliação</h1>
                            </TitlePermission>
                            <FormControlLabel
                                sx={{ml: 1 }}
                                label="Selecionar todos"
                                control={
                                  <Checkbox
                                    checked={conciliationView && conciliationAdd && conciliationEdit && conciliationDelete && conciliationReports}                              
                                    onChange={(e) => handleHasPermission('conciliacao', 'parent', 0, e)}
                                  />
                                }
                              />
                            <Box sx={{ display: "flex", flexDirection: "column", ml: 6 }}>
                              <FormControlLabel
                                label="Visualizar"
                                control={<Checkbox checked={conciliationView} onChange={(e) => handleHasPermission('conciliacao', 'child', 0, e)} />}
                              />
                              <FormControlLabel
                                label="Adicionar"
                                control={<Checkbox checked={conciliationAdd} onChange={(e) => handleHasPermission('conciliacao', 'child', 1, e)} />}
                              />
                              <FormControlLabel
                                label="Editar"
                                control={<Checkbox checked={conciliationEdit} onChange={(e) => handleHasPermission('conciliacao', 'child', 2, e)} />}
                              />
                              <FormControlLabel
                                label="Deletar"
                                control={<Checkbox checked={conciliationDelete} onChange={(e) => handleHasPermission('conciliacao', 'child', 3, e)} />}
                              />
                              <FormControlLabel
                                label="Relatórios"
                                control={<Checkbox checked={conciliationReports} onChange={(e) => handleHasPermission('conciliacao', 'child', 4, e)} />}
                              />
                            </Box> 
                          </UserHasPermissionRight>
                          <UserHasPermissionLeft>
                            {/* <TitlePermission>                            
                              <h1>Grupo de Usuários</h1>
                            </TitlePermission>
                            <FormControlLabel
                              sx={{ml: 1 }}
                              label="Acesso Executivo"
                              control={<Checkbox checked={executiveAccess} onChange={(e) => handleHasPermission('UserGroups', 'child', 0, e)} />}
                            /> */}
                            <TitlePermission>
                              <Lock size={20} />
                              <h1>Segurança</h1>
                            </TitlePermission>
                            <FormControlLabel
                                sx={{ml: 1 }}
                                label="Selecionar todos"
                                control={
                                  <Checkbox
                                    checked={securityView && securityAdd && securityEdit && securityDelete && securityReports}                              
                                    onChange={(e) => handleHasPermission('seguranca', 'parent', 0, e)}
                                  />
                                }
                              />
                            <Box sx={{ display: "flex", flexDirection: "column", ml: 6 }}>
                              <FormControlLabel
                                label="Visualizar"
                                control={<Checkbox checked={securityView} onChange={(e) => handleHasPermission('seguranca', 'child', 0, e)} />}
                              />
                              <FormControlLabel
                                label="Adicionar"
                                control={<Checkbox checked={securityAdd} onChange={(e) => handleHasPermission('seguranca', 'child', 1, e)} />}
                              />
                              <FormControlLabel
                                label="Editar"
                                control={<Checkbox checked={securityEdit} onChange={(e) => handleHasPermission('seguranca', 'child', 2, e)} />}
                              />
                              <FormControlLabel
                                label="Deletar"
                                control={<Checkbox checked={securityDelete} onChange={(e) => handleHasPermission('seguranca', 'child', 3, e)} />}
                              />
                              <FormControlLabel
                                label="Relatórios"
                                control={<Checkbox checked={securityReports} onChange={(e) => handleHasPermission('seguranca', 'child', 4, e)} />}
                              />
                            </Box>                          
                            <TitlePermission>
                              <Gear size={20} />
                              <h1>Configurações</h1>
                            </TitlePermission>
                            <FormControlLabel
                                sx={{ml: 1 }}
                                label="Selecionar todos"
                                control={
                                  <Checkbox
                                    checked={settingsView && settingsAdd && settingsEdit && settingsDelete && settingsReports}                              
                                    onChange={(e) => handleHasPermission('configuracoes', 'parent', 0, e)}
                                  />
                                }
                              />
                            <Box sx={{ display: "flex", flexDirection: "column", ml: 6 }}>
                              <FormControlLabel
                                label="Visualizar"
                                control={<Checkbox checked={settingsView} onChange={(e) => handleHasPermission('configuracoes', 'child', 0, e)} />}
                              />
                              <FormControlLabel
                                label="Adicionar"
                                control={<Checkbox checked={settingsAdd} onChange={(e) => handleHasPermission('configuracoes', 'child', 1, e)} />}
                              />
                              <FormControlLabel
                                label="Editar"
                                control={<Checkbox checked={settingsEdit} onChange={(e) => handleHasPermission('configuracoes', 'child', 2, e)} />}
                              />
                              <FormControlLabel
                                label="Deletar"
                                control={<Checkbox checked={settingsDelete} onChange={(e) => handleHasPermission('configuracoes', 'child', 3, e)} />}
                              />
                              <FormControlLabel
                                label="Relatórios"
                                control={<Checkbox checked={settingsReports} onChange={(e) => handleHasPermission('configuracoes', 'child', 4, e)} />}
                              />
                            </Box>
                          </UserHasPermissionLeft>
                        </UserHasPermission>
                      ) : (
                          <UserSearch>                           
                              <Label size={"50"}>    
                                <Text>Nome</Text>             
                                <input style={inputStyle} value={searchName} onChange={(e) => setSearchName(e.target.value)} />                              
                              </Label>
                              <Label size={"45"}>    
                                <Text>Nome de usuário</Text>             
                                <input style={inputStyle} value={searchUserName} onChange={(e) => setSearchUserName(e.target.value)} />                              
                              </Label>                            
                              <Label size={"50"}>    
                                <Text>Departamento</Text>             
                                <select style={inputStyle} value={searchDepartment} onChange={(e) => setSearchDepartment(e.target.value)}>
                                  <option value="">Departamento</option>
                                  {
                                    departments.map(department => {
                                      return <option key={department.departmentId} value={department.departmentId}>{department.deptName}</option>
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
                          </UserSearch>
                      ))                               
                  }
                

                </ContentModal>
                <hr style={{ display: 'block', height: '1px', border: 0, borderTop: '1px solid #B1B1B1', padding: 0,}} />
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
                      ) : ( changeTypeModal === 'search' ? 
                        <SimpleButton 
                          title='Buscar'                         
                          styleColors="db2"              
                          onClick={handleSearchUsers}
                        />
                      : 
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
    </>
  )
}


export const getServerSideProps = withSSRAuth(async (ctx) => {  
  return {
    props: {}
  }
})