import { withSSRAuth } from "@/utils/withSSRAuth";
import { useForm } from "react-hook-form"
import { setupAPIClient } from "@/services/api";
import Seguranca from "../index.page";
import { ActionsHeader, Container, Content, ContentConfirmPassword, ContentForm, ContentModal, ContentPassword, Footer, FooterModal, Header, HeaderModal, Label, Text, TitleBox, TitlePermission, UserHasPermission, UserHasPermissionLeft, UserHasPermissionRight, UserSearch, UserUpdateOrCreate, ValidStagePassword } from "./styles";
import { styled, useTheme } from '@mui/material/styles';
import { Table, Button, TableRow, TableHead, TableContainer, TableCell, TableBody, tableCellClasses, Box, IconButton, TableFooter, TablePagination, Modal, Typography, Menu, MenuItem, Input, FormControlLabel, Checkbox, Switch } from "@mui/material";
import { ArrowLineLeft, ArrowLineRight, Bank, CaretLeft, CaretRight, Check, CheckCircle, DotsThreeOutlineVertical, Minus, X, XCircle } from "phosphor-react";
import { useContext, useEffect, useRef, useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { SimpleButton } from "@/components/SimpleButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputMask from 'react-input-mask';
import { format } from 'date-fns';
import GerenciarConta from "../index.page";
import { api } from "@/services/apiClient";
import { AuthContext } from "@/contexts/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  password: z.string()
  .min(3, {message: "Preencha o campo corretamente"}),
  newPassword: z.string()
  .min(3, {message: "Preencha o campo corretamente"}),
  confirmNewPassword: z.string()
  .min(3, {message: "Preencha o campo corretamente"})            
});

type createDataProps = {  
  password: string,
  newPassword: string,
  confirmNewPassword: string,            
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

export default function Pessoal() {  
  //States
  const [rows, setRows] = useState<createDataProps[]>([]);
  const [page, setPage] = useState(0);
  const { user } = useContext(AuthContext); 
  const [userFull, setUserFull] = useState<userAccessProps>({} as userAccessProps);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [minimumCharacters, setMinimumCharacters] = useState(false);
  const [upperCase, setUpperCase] = useState(false);
  const [lowerCase, setLowerCase] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [specialCharacter, setSpecialCharacter] = useState(false);
  const [same, setSame] = useState(false);
    
  const { register, handleSubmit, formState , getValues, reset, formState: {errors, isSubmitting, isSubmitSuccessful} } = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema)
  }); 

  async function changePassword (data:UserFormData) {
    const { password, newPassword, confirmNewPassword } = data;
    await api.post(`/api/Login/ChangePassword`,{
      id: userFull.userId,
      newpassword: newPassword
    })
    .then(() => {      
      resetInputs();
      toast.success(`Sua senha foi alterada com sucesso`, {
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
      toast.error(`Não foi possÍvel alterar sua senha`, {
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
  }

  const possuiLetrasMaiusculas = (str: string): boolean => {
    for (let i = 0; i < str.length; i++) {
      if (str[i] === str[i].toUpperCase() && str[i] !== str[i].toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  const possuiLetrasMinusculas = (str: string): boolean => {
    for (let i = 0; i < str.length; i++) {
      if (str[i] === str[i].toLowerCase() && str[i] !== str[i].toUpperCase()) {
        return true;
      }
    }
    return false;
  };

  const possuiNumeros = (str: string): boolean => {
    for (let i = 0; i < str.length; i++) {
      if (!isNaN(parseInt(str[i], 10))) {
        return true;
      }
    }
    return false;
  };
  
  const possuiCaracteresEspeciais = (str: string): boolean => {
    const regex = /[^\w\s]/;
    
    for (let i = 0; i < str.length; i++) {
      if (regex.test(str[i])) {
        return true;
      }
    }
    return false;
  };

  function handleChangePassword(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
    const getNewPasword = getValues("newPassword");
    const getConfirmNewPasword = getValues("confirmNewPassword");
    if((event.target.value).length > 6){
      setMinimumCharacters(true)
    }else if((event.target.value).length < 6){
      setMinimumCharacters(false)
    }
    if(possuiLetrasMaiusculas(event.target.value)){
      setUpperCase(true)
    }else{
      setUpperCase(false)
    }
    if(possuiLetrasMinusculas(event.target.value)){
      setLowerCase(true)
    }else{
      setLowerCase(false)
    }
    if(possuiNumeros(event.target.value)){
      setNumbers(true)
    }else{
      setNumbers(false)
    }
    if(possuiCaracteresEspeciais(event.target.value)){
      setSpecialCharacter(true)
    }else{
      setSpecialCharacter(false)
    }
    if(getNewPasword.length > 0 && getConfirmNewPasword.length > 0 && getNewPasword === getConfirmNewPasword){
      setSame(true)
    }else{
      setSame(false)
    }
  }

  function resetInputs(){
    reset({ password: '',  newPassword: '', confirmNewPassword: '' });
  }
    
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      resetInputs()
    }
  }, [formState, isSubmitSuccessful, reset])

  useEffect(() => {
    function generalUser(){      
      setUserFull(user?.userAccess);
    }

    generalUser();
  }, [user])
  
  return (
    <GerenciarConta> 
      <Container onSubmit={handleSubmit(changePassword)}>
        <Header>
          <TitleBox>
            <span>Alterar a senha</span>
          </TitleBox>         
        </Header>
        <hr/>     
        <Content>      
          <Text>Escolha uma senha forte e não a reutilize em outras contas, use pelo menos 10 caracteres, não use a senha de outro site ou algo muito óbvio, como o nome do seu animal de estimação.</Text>   
          <ContentPassword>
            <ContentForm>
              <Label size={"100"}>
                <Text>Senha atual</Text>
                <input style={inputStyle} type="password" {...register("password")} />      
                {errors.password && (
                  <span> {errors.password.message} </span>
                )}                            
              </Label>
              <Label size={"100"}>
                <Text>Nova senha</Text>
                <input style={inputStyle} type="password" {...register("newPassword", {onChange: (e) => {handleChangePassword(e)}})} />               
                {errors.newPassword && (
                  <span> {errors.newPassword.message} </span>
                )}                   
              </Label>          
              <Label size={"100"}>
                <Text>Confirme a nova senha</Text>
                <input style={inputStyle} type="password" {...register("confirmNewPassword", {onChange: (e) => {handleChangePassword(e)}})} />                                  
                {errors.confirmNewPassword && (
                  <span> {errors.confirmNewPassword.message} </span>
                )}
              </Label>
            </ContentForm>
            <ContentConfirmPassword>
              <ValidStagePassword className={minimumCharacters ? 'valid' : ''}>
                {
                  minimumCharacters 
                  ? <CheckCircle style={{color: "#009922"}} size={20} />
                  : <XCircle style={{color: "#FF0000"}} size={20} />
                }
                <Text>Comprimento 6 caracteres</Text>  
              </ValidStagePassword>
              <ValidStagePassword className={upperCase ? 'valid' : ''}>
                {
                  upperCase 
                  ? <CheckCircle style={{color: "#009922"}} size={20} />
                  : <XCircle style={{color: "#FF0000"}} size={20} />
                }
                <Text>Conter letras maiúsculas</Text>  
              </ValidStagePassword>
              <ValidStagePassword className={lowerCase ? 'valid' : ''}>
                {
                  lowerCase 
                  ? <CheckCircle style={{color: "#009922"}} size={20} />
                  : <XCircle style={{color: "#FF0000"}} size={20} />
                }
                <Text>Conter letras minúsculas</Text>  
              </ValidStagePassword>
              <ValidStagePassword className={numbers ? 'valid' : ''}>
                {
                  numbers 
                  ? <CheckCircle style={{color: "#009922"}} size={20} />
                  : <XCircle style={{color: "#FF0000"}} size={20} />
                }
                <Text>Conter números</Text>  
              </ValidStagePassword>
              <ValidStagePassword className={specialCharacter ? 'valid' : ''}>
                {
                  specialCharacter 
                  ? <CheckCircle style={{color: "#009922"}} size={20} />
                  : <XCircle style={{color: "#FF0000"}} size={20} />
                }
                <Text>Caractere especial </Text>  
              </ValidStagePassword>
              <ValidStagePassword className={same ? 'valid' : ''}>
                {
                  same 
                  ? <CheckCircle style={{color: "#009922"}} size={20} />
                  : <XCircle style={{color: "#FF0000"}} size={20} />
                }
                <Text>Confirmação diferente</Text>  
              </ValidStagePassword>
            </ContentConfirmPassword>
          </ContentPassword>
        </Content>  
        <hr/>
        <Footer>
          <SimpleButton 
            title="Salvar" 
            disabled={!(minimumCharacters && upperCase && lowerCase && numbers && specialCharacter && same)} 
            styleColors="db2" 
            loading={isSubmitting}
            type="submit" 
          />
        </Footer>                     
      </Container>
      <ToastContainer />
    </GerenciarConta>
  )
}


export const getServerSideProps = withSSRAuth(async (ctx) => {  
  return {
    props: {}
  }
})