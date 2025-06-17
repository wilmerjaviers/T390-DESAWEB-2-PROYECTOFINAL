'use client'
import { useContextUsuario } from '../Provider/ProviderUsuario';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


interface GeneralLayoutProps {
  children: React.ReactNode;
}

export default function GeneralLayout({ children }: GeneralLayoutProps) {
  const { isAuthenticated } = useContextUsuario();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/');
      }
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  return <>{children}</>;
}