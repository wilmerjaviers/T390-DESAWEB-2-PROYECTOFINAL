'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { useContextUsuario } from "./Provider/ProviderUsuario";
import { useRouter } from "next/navigation";


export default function Home() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { nombreUsuario, setNombreUsuario, setClaveUsuario, isAuthenticated } = useContextUsuario();
  const route = useRouter();

  function login() {
    if (usuario.trim() === '' || contrasena.trim() === '') {
      setError('Debe ingresar usuario y clave');
      return;
    }

    setIsLoading(true);
    setError('');

    
    setTimeout(() => {
      if (usuario === 'admin' && contrasena === 'admin123') {
        setNombreUsuario(usuario);
        setClaveUsuario(contrasena);
        route.push('/Dashboard'); 
      } else {
        setError('Usuario o Contraseña incorrecta');
      }
      setIsLoading(false);
    }, 1000);
  }

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      route.push('/Dashboard');
    }
  }, [isAuthenticated, route]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
         style={{
           backgroundImage: "url('/fondo-login.jpg')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
      
      
      <div className="position-absolute top-0 start-0 w-100 h-100" 
           style={{backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)'}}></div>
      
     
      <div className="position-relative" style={{zIndex: 10}}>
        <div className="card shadow-lg border-0" 
             style={{
               width: '400px',
               backgroundColor: 'rgba(255,255,255,0.95)',
               backdropFilter: 'blur(10px)'
             }}>
          
       
          <div className="card-header text-center bg-transparent border-0 pt-4">
            <img src="/logo.png" alt="Logo Anadish" className="img-fluid mb-3" style={{maxWidth: '150px'}} />
            <h2 className="text-muted">Sistema de Gestión</h2>
          </div>
          
          {/* Cuerpo del formulario */}
          <div className="card-body px-4 pb-4">
           
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); login(); }}>
              {/* Campo Usuario */}
              <div className="mb-3">
                <label htmlFor="usuario" className="form-label fw-semibold">
                  <i className="bi bi-person-fill me-2"></i>Usuario
                </label>
                <input
                  type="text"
                  id="usuario"
                  className="form-control form-control-lg"
                  placeholder="Ingrese su usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Campo Contraseña */}
              <div className="mb-3">
                <label htmlFor="clave" className="form-label fw-semibold">
                  <i className="bi bi-lock-fill me-2"></i>Contraseña
                </label>
                <div className="input-group">
                  <input
                    type={mostrarClave ? "text" : "password"}
                    id="clave"
                    className="form-control form-control-lg"
                    placeholder="Ingrese su contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setMostrarClave(!mostrarClave)}
                    disabled={isLoading}
                  >
                    <i className={`bi ${mostrarClave ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

        
              
              {/* Botón de login */}
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 fw-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            {/* Información adicional */}
            <div className="text-center mt-4">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Credenciales de prueba: admin / admin123
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}