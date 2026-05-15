/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from "react"
import { login } from "../service/Service"
import type UsuarioLogin from "../models/UsuarioLogin"
import { ToastAlerta } from "../Utils/ToastAlerta" 
interface AuthContextProps {
    usuario: UsuarioLogin
    handleLogout(): void
    handleLogin(usuario: UsuarioLogin): Promise<void>
    isLoading: boolean
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

export function AuthProvider({ children }: AuthProviderProps) {

    const [usuario, setUsuario] = useState<UsuarioLogin>({
        id: 0,
        nome: "",
        usuario: "",
        senha: "",
        foto: "",
        token: ""
    })

    const [isLoading, setIsLoading] = useState(false)

    async function handleLogin(usuarioLogin: UsuarioLogin) {
        setIsLoading(true)
        try {
            await login(`/usuarios/logar`, usuarioLogin, setUsuario)
            ToastAlerta("Usuário foi autenticado com sucesso!", "sucesso")
        } catch (error) {
            console.log(error)
            ToastAlerta("Os dados do Usuário estão inconsistentes!", "erro")
        } finally {
            setIsLoading(false)
        }
    }

    function handleLogout() {
        setUsuario({
            id: 0,
            nome: "",
            usuario: "",
            senha: "",
            foto: "",
            token: ""
        })
    }

    return (
        <AuthContext.Provider value={{ usuario, handleLogout, handleLogin, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}