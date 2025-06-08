'use client'
import React, { useContext, useState } from 'react'
import { PlantillaReact } from '../Modelos/plantillaReact'
import { usuarioContext } from '../Contexto/ContextUsuario'

export default function ProviderUsuario({ children }: PlantillaReact) {
  const [nombreUsuario, setNombreUsuario] = useState<string>('')
  const [claveUsuario, setClaveUsuario] = useState<string>('')

  return (
    <usuarioContext.Provider value={{ nombreUsuario, claveUsuario, setNombreUsuario, setClaveUsuario }}>
      {children}
    </usuarioContext.Provider>
  )
}

export function useContextUsuario() {
  return useContext(usuarioContext)
}
