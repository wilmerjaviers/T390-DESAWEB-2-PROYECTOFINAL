"use client";
import React, { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";


interface Estadisticas {
  personas: { total: number; nuevas_mes: number };
  solicitudes: { total: number; urgentes: number };
  ayudas: { total: number; monto_total: number };
  presupuesto: { usado_mes: number };
}

interface Actividad {
  tipo_actividad: string;
  descripcion: string;
  fecha_actividad: string;
  usuario_nombre: string;
}

export default function Dashboard() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const response = await fetch('/api/dashboard/estadisticas');
      const data = await response.json();

      if (data.success) {
        setEstadisticas(data.data.estadisticas);
        setActividades(data.data.actividades);
      } else {
        setError('Error al cargar datos del dashboard');
      }
    } catch (error) {
      console.error('Error cargando dashboard:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 0
    }).format(monto);
  };

  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha);
    const ahora = new Date();
    const diferencia = ahora.getTime() - fechaObj.getTime();
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 60) {
      return `Hace ${minutos} minutos`;
    } else if (horas < 24) {
      return `Hace ${horas} horas`;
    } else {
      return `Hace ${dias} días`;
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navigation activeSection="Dashboard" />
        <div className="container-fluid py-5">
          <div className="d-flex justify-content-center align-items-center" style={{minHeight: '60vh'}}>
            <div className="text-center">
              <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted fs-5">Cargando dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-light">
        <Navigation activeSection="Dashboard" />
        <div className="container py-4">
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8f9fa'}}>
      <Navigation activeSection="Dashboard" />

      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="text-center mb-4">
              <h1 className="fw-bold text-primary mb-2">
                <i className="me-3"></i>Fundación ANADISH
                
              </h1>
              <h3 className="fw-bold text-primary mb-2">
             
                 <i className="me-3"></i>Bienvenido(a) al Sistema de Gestión
              </h3>
            </div>
            
       
          </div>
        </div>

{/* Estadísticas principales*/}
        <div className="row g-8 mb-5 mx-5">
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-2">
                <div className="d-flex align-items-center justify-content-center mb-1">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-1">
                    <i className="bi bi-people-fill text-primary" style={{fontSize: '1rem'}}></i>
                  </div>
                </div>
                <div className="small text-muted mb-1">Personas Registradas</div>
                <h5 className="text-primary fw-bold mb-1">
                  {estadisticas?.personas.total || 0}
                </h5>
                <span className="badge bg-success bg-opacity-10 text-success" style={{fontSize: '0.65rem'}}>
                  <i className="bi bi-arrow-up me-1" style={{fontSize: '0.6rem'}}></i>
                  +{estadisticas?.personas.nuevas_mes || 0} mes
                </span>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-2">
                <div className="d-flex align-items-center justify-content-center mb-1">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-1">
                    <i className="bi bi-file-earmark-text text-warning" style={{fontSize: '1rem'}}></i>
                  </div>
                </div>
                <div className="small text-muted mb-1">Solicitudes Pendientes</div>
                <h5 className="text-warning fw-bold mb-1">
                  {estadisticas?.solicitudes.total || 0}
                </h5>
                <span className="badge bg-danger bg-opacity-10 text-danger" style={{fontSize: '0.65rem'}}>
                  <i className="bi bi-exclamation-triangle me-1" style={{fontSize: '0.6rem'}}></i>
                  {estadisticas?.solicitudes.urgentes || 0} urgentes
                </span>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-2">
                <div className="d-flex align-items-center justify-content-center mb-1">
                  <div className="bg-success bg-opacity-10 rounded-circle p-1">
                    <i className="bi bi-hand-thumbs-up text-success" style={{fontSize: '1rem'}}></i>
                  </div>
                </div>
                <div className="small text-muted mb-1">Ayudas Otorgadas</div>
                <h5 className="text-success fw-bold mb-1">
                  {estadisticas?.ayudas.total || 0}
                </h5>
                <span className="badge bg-info bg-opacity-10 text-info" style={{fontSize: '0.65rem'}}>
                  <i className="bi bi-calendar-month me-1" style={{fontSize: '0.6rem'}}></i>
                  Este mes
                </span>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-2">
                <div className="d-flex align-items-center justify-content-center mb-1">
                  <div className="bg-info bg-opacity-10 rounded-circle p-1">
                    <i className="bi bi-cash-stack text-info" style={{fontSize: '1.3rem'}}></i>
                  </div>
                </div>
                <div className="small text-muted mb-1">Presupuesto Usado</div>
                <h6 className="text-info fw-bold mb-1">
                  {formatearMoneda(estadisticas?.presupuesto.usado_mes || 0)}
                </h6>
                <span className="badge bg-primary bg-opacity-10 text-primary" style={{fontSize: '0.65rem'}}>
                  <i className="bi bi-calendar-month me-1" style={{fontSize: '0.6rem'}}></i>
                  Este mes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección inferior */}
        <div className="row g-4">
          {/* Actividad Reciente */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-primary text-white d-flex align-items-center">
                <i className="bi bi-activity me-2"></i>
                <h5 className="card-title mb-0">Actividad Reciente</h5>
              </div>
              <div className="card-body">
                <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                  {actividades.length > 0 ? (
                    actividades.map((actividad, index) => (
                      <div key={index} className="d-flex align-items-start mb-3 pb-3 border-bottom">
                        <div className="flex-shrink-0 me-3">
                          <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                               style={{width: '40px', height: '40px'}}>
                            <i className="bi bi-person-check text-success"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-semibold">{actividad.descripcion}</p>
                          <div className="d-flex align-items-center text-muted">
                            <i className="bi bi-clock me-1"></i>
                            <small>{formatearFecha(actividad.fecha_actividad)}</small>
                            <span className="mx-2">•</span>
                            <small>{actividad.usuario_nombre}</small>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-inbox text-muted" style={{fontSize: '3rem'}}></i>
                      <p className="text-muted mt-3">No hay actividades recientes</p>
                    </div>
                  )}
                </div>
                <div className="d-grid">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => window.location.href = '/reportes'}
                  >
                    <i className="bi bi-eye me-2"></i>Ver Reportes y Personas
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-secondary text-white d-flex align-items-center">
                <i className="bi bi-lightning-charge me-2"></i>
                <h5 className="card-title mb-0">Acciones Rápidas</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-6">
                    <a href="/fichaRegistro" className="btn btn-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center text-decoration-none p-3">
                      <i className="bi bi-person-plus-fill" style={{fontSize: '2rem'}}></i>
                      <small className="mt-2 fw-semibold">Nuevo Registro</small>
                    </a>
                  </div>
                  
                  <div className="col-6">
                    <a href="/solicitudNueva" className="btn btn-success w-100 h-100 d-flex flex-column align-items-center justify-content-center text-decoration-none p-3">
                      <i className="bi bi-file-earmark-plus" style={{fontSize: '2rem'}}></i>
                      <small className="mt-2 fw-semibold">Nueva Solicitud</small>
                    </a>
                  </div>
                  
                  <div className="col-6">
                    <a href="/reportes" className="btn btn-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center text-decoration-none p-3">
                      <i className="bi bi-graph-up" style={{fontSize: '2rem'}}></i>
                      <small className="mt-2 fw-semibold">Generar Reporte</small>
                    </a>
                  </div>
                  
                  <div className="col-6">
                    <a href="/gestionAyudas" className="btn btn-info w-100 h-100 d-flex flex-column align-items-center justify-content-center text-decoration-none p-3">
                      <i className="bi bi-hand-thumbs-up" style={{fontSize: '2rem'}}></i>
                      <small className="mt-2 fw-semibold">Gestionar Ayudas</small>
                    </a>
                  </div>
                </div>

                {/* Resumen adicional */}
                <div className="mt-4 pt-3 border-top">
                  <h6 className="text-muted mb-3">
                    <i className="bi bi-info-circle me-2"></i>Resumen Rápido
                  </h6>
                  <div className="row text-center g-2">
                    <div className="col-6">
                      <div className="bg-light rounded p-2">
                        <div className="fw-bold text-primary">
                          {estadisticas?.personas.total || 0}
                        </div>
                        <small className="text-muted">Total Personas Registradas</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded p-2">
                        <div className="fw-bold text-warning">
                          {estadisticas?.solicitudes.total || 0}
                        </div>
                        <small className="text-muted">Solicitudes Pendientes</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}