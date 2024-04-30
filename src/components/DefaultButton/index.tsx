import React, { ButtonHTMLAttributes } from "react";
import { Content, ContentTitles, DefaultB, SubTitle, Title } from './styles';
import CircularProgress from '@mui/material/CircularProgress';
import { ListChecks, MagnifyingGlass, PlusCircle, Receipt } from "phosphor-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  subTitle: string;
  typeIcon: string;
  loading?: boolean;
};

export const DefaultButton = ({ title, typeIcon, subTitle, loading = false, ...props }: ButtonProps) => {

  let component = null;
  switch (typeIcon) {
    case 'search':
      component = <MagnifyingGlass style={{ color: '#246776' }} size={80} />;
      break;
    case 'add':
      component = <PlusCircle style={{ color: '#246776' }} size={80} />
      break;
    case 'reports':
      component = <ListChecks style={{ color: '#246776' }} size={80} />
      break;
    case 'receipt':
      component = <Receipt style={{ color: '#246776' }} size={80} />
      break;
    default:
      component = <MagnifyingGlass style={{ color: '#246776' }} size={80} />;
  }

  return (
    <>
      <DefaultB {...props}>
        {loading === true ?
          <CircularProgress />
          :
          <Content>
            {component}
            <ContentTitles>
              <Title>{title}</Title>
              <SubTitle>{subTitle}</SubTitle>
            </ContentTitles>
          </Content>
        }
      </DefaultB>
    </>
  )
};
