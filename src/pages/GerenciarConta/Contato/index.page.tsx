import { withSSRAuth } from "@/utils/withSSRAuth";
import { useForm } from "react-hook-form"
import { setupAPIClient } from "@/services/api";
import Seguranca from "../index.page";
import { ActionsHeader, Container, Content, ContentForm, ContentImage, ContentModal, DivImage, Footer, FooterModal, Header, HeaderModal, ImageAvatar, Label, Text, TitleBox, TitlePermission, UserHasPermission, UserHasPermissionLeft, UserHasPermissionRight, UserSearch, UserUpdateOrCreate } from "./styles";
import { styled, useTheme } from '@mui/material/styles';
import { Table, Button, TableRow, TableHead, TableContainer, TableCell, TableBody, tableCellClasses, Box, IconButton, TableFooter, TablePagination, Modal, Typography, Menu, MenuItem, Input, FormControlLabel, Checkbox, Switch } from "@mui/material";
import { ArrowLineLeft, ArrowLineRight, Bank, CaretLeft, CaretRight, Check, DotsThreeOutlineVertical, Minus, PencilSimple, X, XCircle } from "phosphor-react";
import { useContext, useEffect, useRef, useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { SimpleButton } from "@/components/SimpleButton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputMask from 'react-input-mask';
import { format } from 'date-fns';
import GerenciarConta from "../index.page";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { IMaskInput } from "react-imask";

import { normalizePhoneNumber, normalizeCelularNumber, normalizeTelefoneFixo } from '../../../Masks/mask'

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
  "email":string,
  "roles": [],
  "userId": number
}

type UserFormData = z.infer<typeof UserFormSchema>

export default function Contato() {

  const { user } = useContext(AuthContext);
  //States
  const [rows, setRows] = useState<createDataProps[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userFull, setUserFull] = useState<userAccessProps>({} as userAccessProps);


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const { register, handleSubmit, watch, setValue, formState , reset, formState: {errors, isSubmitting, isSubmitSuccessful} } = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema)
  });

  function resetInputs(){
    reset({ id: 0, cellPhone: '', cpf: '',  commercialPhone: '', department: '', email: '',  name: '', extension: '', dtNasc: '',  });
  }

  const cellPhoneValue = watch("cellPhone");
  const phoneValue = watch("commercialPhone");

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      resetInputs()
    }
  }, [formState, isSubmitSuccessful, reset])

  function handleActionUser(){
    console.log("submit");
  }

  async function getUser(userEffect: userAccessProps){
    if(userEffect?.userId){
      setUserFull(userEffect);
      await api.get(`/api/User/`+userEffect?.userId)
        .then(response => {
          reset({cellPhone: response.data.cellPhone, email: response.data.email, commercialPhone: response.data.commercialPhone, extension: response.data.extension});
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
    getUser(user?.userAccess);
  }, [user])


  useEffect(() => {
    setValue("cellPhone", normalizeCelularNumber(cellPhoneValue))
  },[cellPhoneValue])
  
  useEffect(() => {
    setValue("commercialPhone", normalizeTelefoneFixo(phoneValue))
  },[phoneValue])

  return (
    <GerenciarConta>
      <Container onSubmit={handleSubmit(handleActionUser)}>
        <input type="hidden" {...register("id")} />
        <Header>
          <TitleBox>
            <span>Informações para contato</span>
          </TitleBox>
        </Header>
        <hr/>
        <Content>
          <ContentForm>
            <Label size={"50"}>
              <Text>E-mail da Conta</Text>
              <input style={inputStyle} disabled {...register("email")} value={userFull?.email} />
            </Label>
            <Label size={"45"}>
              <Text>Tel. Celular</Text>
              <input style={inputStyle} disabled {...register("cellPhone")}/>
              {errors.cellPhone && (
                <span> {errors.cellPhone.message} </span>
              )}
            </Label>
            <Label size={"50"}>
              <Text>Tel. Comercial</Text>
              <input style={inputStyle} disabled {...register("commercialPhone")}  />
              {errors.commercialPhone && (
                <span> {errors.commercialPhone.message} </span>
              )}
            </Label>
            <Label size={"45"}>
              <Text>Ramal</Text>
              <input style={inputStyle} disabled {...register("extension")} value={userFull?.extension} />
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