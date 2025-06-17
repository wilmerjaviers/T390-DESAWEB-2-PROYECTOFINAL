'use client'
import React, { useEffect } from 'react';
import { useContextUsuario } from '../Provider/ProviderUsuario';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface NavigationProps {
  activeSection?: string;
}

export default function Navigation({ activeSection }: NavigationProps) {
  const { nombreUsuario, logout } = useContextUsuario();
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {

    const loadBootstrap = async () => {
      if (typeof window !== 'undefined') {
        try {
          const bootstrap = await import('bootstrap');
          console.log('✅ Bootstrap JS cargado');
        } catch (error) {
          console.warn('⚠️ Bootstrap JS no disponible');
        }
      }
    };

    loadBootstrap();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { href: '/Dashboard', icon: 'bi-speedometer2', title: 'Dashboard', sub: 'Panel Principal' },
    { href: '/fichaRegistro', icon: 'bi-people-fill', title: 'Personas', sub: 'Registro' },
    { href: '/solicitudNueva', icon: 'bi-file-earmark-plus', title: 'Solicitudes', sub: 'Nueva' },
    { href: '/gestionAyudas', icon: 'bi-hand-thumbs-up', title: 'Gestión', sub: 'Ayudas' },
    { href: '/reportes', icon: 'bi-graph-up', title: 'Reportes', sub: 'Análisis' }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" 
         style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="container-fluid">
        
        {/* Logo y Título */}
        <Link href="/Dashboard" className="navbar-brand d-flex align-items-center">
          <Image
            src="/logo.png"
            alt="Logo ANADISH"
            width={80}
            height={80}
            className="me-2 rounded shadow-sm"
            priority
          />
          <div className="text-white">
            <div className="fw-bold fs-5">ANADISH</div>
            <small className="opacity-75" style={{fontSize: '0.75rem'}}>Sistema de Gestión</small>
          </div>
        </Link>

        {/* Toggle button para móvil - Bootstrap */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          aria-controls="navbarContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido del navbar - Bootstrap Collapse */}
        <div className="collapse navbar-collapse" id="navbarContent">
          
          {/* Menú principal */}
          <ul className="navbar-nav mx-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || activeSection === item.href.replace('/', '');
              return (
                <li key={item.href} className="nav-item mx-1">
                  <Link 
                    href={item.href} 
                    className={`nav-link text-center px-3 py-2 rounded ${
                      isActive ? 'bg-white bg-opacity-25 text-white fw-semibold' : 'text-white-50'
                    }`}
                  >
                    <i className={`${item.icon} d-block fs-5 mb-1`}></i>
                    <div style={{fontSize: '0.8rem', lineHeight: '1'}}>{item.title}</div>
                    <small style={{fontSize: '0.7rem'}} className="opacity-75">{item.sub}</small>
                  </Link>
                </li>
              );
            })}
          </ul>

          

          {/* Usuario dropdown - Bootstrap Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-link text-white dropdown-toggle d-flex align-items-center text-decoration-none"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="bg-white bg-opacity-25 rounded-circle p-2 me-2">
                <i className="bi bi-person-fill"></i>
              </div>
              <div className="text-start d-none d-md-block">
                <div className="fw-semibold" style={{fontSize: '0.9rem'}}>{nombreUsuario || 'Admin'}</div>
                <small className="opacity-75">Administrador</small>
              </div>
            </button>
            
            {/* Bootstrap Dropdown Menu */}
            <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{minWidth: '200px'}}>
              <li>
                <div className="dropdown-header">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-25 rounded-circle p-2 me-2">
                      <i className="bi bi-person-fill text-primary"></i>
                    </div>
                    <div>
                      <div className="fw-semibold">{nombreUsuario || 'Admin'}</div>
                      <small className="text-muted">admin@anadish.org</small>
                    </div>
                  </div>
                </div>
              </li>
              
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger w-100 text-start" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}