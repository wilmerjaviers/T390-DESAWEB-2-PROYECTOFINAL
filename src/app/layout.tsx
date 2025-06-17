import React, { ReactNode } from 'react';
import ProviderUsuario from './Provider/ProviderUsuario';
import './globals.css';


interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ANADISH - Sistema de Gestión</title>
      </head>
      <body className="font-sans">
        <ProviderUsuario>
          {children}
        </ProviderUsuario>
      </body>
    </html>
  );
}