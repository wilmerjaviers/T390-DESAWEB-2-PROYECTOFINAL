import React, { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="/style/global.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
