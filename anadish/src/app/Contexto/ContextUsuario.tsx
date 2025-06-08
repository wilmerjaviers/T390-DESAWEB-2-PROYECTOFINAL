import { createContext } from "react";

export const usuarioContext = createContext({
  nombreUsuario: '',
  claveUsuario: '',
  setNombreUsuario: (usuario: any) => {},
  setClaveUsuario: (clave: any) => {}
});
