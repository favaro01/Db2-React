import { withSSRAuth } from "@/utils/withSSRAuth";
import { useForm } from "react-hook-form"
import { setupAPIClient } from "@/services/api";
import { ButtonInput, Container, Content, ContentForm, ContentImage, DivImage, Footer, Header, ImageAvatar, Label, Text, TitleBox} from "./styles";
import { useContext, useEffect, useState } from "react";
import { SimpleButton } from "@/components/SimpleButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import GerenciarConta from "../index.page";
import avatar from '../../../assets/avatarDefault.png';
import { Button } from "@mui/material";
import { PencilSimple } from "phosphor-react";
import { AuthContext } from "@/contexts/AuthContext";
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import { format } from 'date-fns';
import InputMask from "react-input-mask"
import { normalizeCpfNumber } from '../../../Masks/mask'

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

function handleActionCodigosBanco(data:CodigosBancoFormData) {
  const { id, codBank, NumberFormat } = data;  
}

type createDataProps = {
  id: number,
  name: string,
  department: string,
  document?: string,
  dtNasc?: string, 
  email?: string, 
  commercialPhone?: string, 
  extension?: string, 
  cellPhone?: string,
  status: number,
}

type settingsProps ={
  name: string,
  type: string,
}


type userAccessProps = {
  "accessFirst": boolean,
  "avatarImage": string,
  "cellPhone": string,
  "commercialPhone":string,
  "company":string,
  "department":string,
  "extension":string,
  "name":string,
  "document":string,
  "dtNasc":string,
  "roles": [], 
  "userId": number
}

type UserFormData = z.infer<typeof UserFormSchema>

export default function Pessoal() {  
  //States
  const [rows, setRows] = useState<createDataProps[]>([]);
  const [page, setPage] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userFull, setUserFull] = useState<userAccessProps>({} as userAccessProps);
  const { user } = useContext(AuthContext);  
  
  const cpfValue = watch("cpf");

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const { register, handleSubmit,watch, setValue, formState , reset, formState: {errors, isSubmitting, isSubmitSuccessful} } = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema)
  }); 

  function resetInputs(){
    reset({ id: 0, cellPhone: '', cpf: '',  commercialPhone: '', department: '', email: '',  name: '', extension: '', dtNasc: '',  });
  }

  function handleImage(e){    
    setFile(URL.createObjectURL(e.target.files[0]));
  }
    
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      resetInputs()
    }
  }, [formState, isSubmitSuccessful, reset])

  async function getUser(userEffect: userAccessProps){
    if(userEffect?.userId){
      setUserFull(userEffect);
      await api.get(`/api/User/`+userEffect?.userId)
        .then(response => {        
          reset({ id: response.data?.userId, cpf: response.data?.document, name: response.data?.name, dtNasc: format(new Date(response.data?.dtNasc), 'yyyy-MM-dd')});        
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
        }) 
    }
  }

  useEffect(() => {
    setValue("cpf", normalizeCpfNumber(cpfValue))
  },[cpfValue])
  
  useEffect(() => {   
    getUser(user?.userAccess);    
  }, [user])
  
  
  return (
    <GerenciarConta> 
      <Container onSubmit={handleSubmit(handleActionCodigosBanco)}>
        <input type="hidden" {...register("id")} />
        <Header>
          <TitleBox>
            <span>Informações pessoais</span>
          </TitleBox>         
        </Header>
        <hr/>     
        <Content>
          <ContentImage>
            <Text>Foto de perfil:</Text>
            <DivImage>
              <ImageAvatar src={file ? file : avatar.src} alt="Avatar do usuário" />
              {/* <ImageAvatar src={userFull?.avatarImage ? userFull?.avatarImage : avatar.src} alt="Avatar do usuário" /> */}
              <Label>
                <ButtonInput aria-label="edit">
                  <PencilSimple style={{color: '#7F7F7F'}} size={12} />
                </ButtonInput>
                <input type="file" style={{display:"none"}} onChange={(e) => handleImage(e)} />
              </Label>
              
            </DivImage>
          </ContentImage>
          <ContentForm>
            <Label size={"60"}>
              <Text>Nome</Text>
              <input style={inputStyle} disabled {...register("name")} value={userFull?.name} />                                  
            </Label>
            <Label size={"35"}>
              <Text>Data Nasc.</Text>
              <input style={inputStyle} disabled type="date" {...register("dtNasc")} value={userFull?.dtNasc} />                                  
            </Label>          
            <Label size={"30"}>    
              <Text>CPF</Text>             
              <input disabled style={inputStyle} {...register("cpf")} />
              {errors.cpf && (
                <span> {errors.cpf.message} </span>
              )}
            </Label>       
          </ContentForm>
        </Content>  
        <hr/>
        <Footer>
          <SimpleButton 
            title="Salvar" 
            disabled={true} 
            // disabled={isSubmitting} 
            styleColors="db2" 
            loading={isSubmitting}
            type="submit" 
          />
        </Footer>            
      </Container>
    </GerenciarConta>
  )
}


export const getServerSideProps = withSSRAuth(async (ctx) => {  
  return {
    props: {}
  }
})