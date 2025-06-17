import { createContext } from "react";

interface UsuarioContextType {
  nombreUsuario: string;
  claveUsuario: string;
  isAuthenticated: boolean;
  setNombreUsuario: (usuario: string) => void;
  setClaveUsuario: (clave: string) => void;
  logout: () => void;
}

export const usuarioContext = createContext<UsuarioContextType>({
  nombreUsuario: '',
  claveUsuario: '',
  isAuthenticated: false,
  setNombreUsuario: () => {},
  setClaveUsuario: () => {},
  logout: () => {}
});