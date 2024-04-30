import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies' 
import Router from 'next/router'
import Cookies from "js-cookie";


import { api } from "../services/apiClient";
import { toast } from "react-toastify";
type User = {
  userAccess: string[];  
};

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

let authChannel: BroadcastChannel

export function signOut() {  
  Cookies.remove('nextauth.token');
  Cookies.remove('nextauth.refreshToken');
  // destroyCookie(undefined, 'nextauth.token')
  // destroyCookie(undefined, 'nextauth.refreshToken')

  Router.push('/Login')
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth')

    authChannel.onmessage = (message) => {      
      switch (message.data) {
        case 'signOut':
          signOut();
          break;
        default:
          break;
      }
    }
  }, [])

  useEffect((ctx = undefined) => {
    const { 'nextauth.token': token } = parseCookies()
    let cookies = parseCookies(ctx);
    if (token) {
      api.get(`/api/Login/me?token=${cookies['nextauth.token']}`)
        .then(response => {
          const { userAccess } = response.data

          setUser({ userAccess })
        })
        .catch(() => {
          signOut();
        })
    }
  }, [])

  async function signIn({ email, password }: SignInCredentials) {    
    try {
      const response = await api.post('api/Login', {
        userName: email,
        password,
      })

      const { token, refreshToken, userAccess } = response.data;      

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      setUser({
        userAccess,
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/Home');
    } catch (err) {    
      toast.error(`Não foi possível realizar o login, verifique seu nome de usuário ou senha.`, {
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

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}