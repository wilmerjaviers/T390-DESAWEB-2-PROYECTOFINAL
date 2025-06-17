'use client'
import React, { useContext, useState, useEffect } from 'react'
import { PlantillaReact } from '../Modelos/plantillaReact'
import { usuarioContext } from '../Contexto/ContextUsuario'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ProviderUsuario({ children }: PlantillaReact) {
  const [nombreUsuario, setNombreUsuario] = useState<string>('')
  const [claveUsuario, setClaveUsuario] = useState<string>('')

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('anadish_usuario');
    const claveGuardada = localStorage.getItem('anadish_clave');
    
    if (usuarioGuardado && claveGuardada) {
      setNombreUsuario(usuarioGuardado);
      setClaveUsuario(claveGuardada);
    }
  }, []);

  // Guardar en localStorage cuando cambien los valores
  useEffect(() => {
    if (nombreUsuario && claveUsuario) {
      localStorage.setItem('anadish_usuario', nombreUsuario);
      localStorage.setItem('anadish_clave', claveUsuario);
    }
  }, [nombreUsuario, claveUsuario]);

  // Verificar si está autenticado
  const isAuthenticated = nombreUsuario !== '' && claveUsuario !== '';

  const logout = () => {
    setNombreUsuario('');
    setClaveUsuario('');
    localStorage.removeItem('anadish_usuario');
    localStorage.removeItem('anadish_clave');
  };

  return (
    <usuarioContext.Provider value={{ 
      nombreUsuario, 
      claveUsuario, 
      isAuthenticated,
      setNombreUsuario, 
      setClaveUsuario,
      logout
    }}>
      {children}
    </usuarioContext.Provider>
  )
}

export function useContextUsuario() {
  return useContext(usuarioContext)
}