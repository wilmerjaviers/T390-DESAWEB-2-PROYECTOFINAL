"use client";
import React, { useState, useEffect, useRef } from "react";
import Navigation from "../../components/Navigation";
import Chart from 'chart.js/auto';

interface Estadisticas {
  personas: { total: number; nuevas_mes: number };
  solicitudes: { total: number; urgentes: number };
  ayudas: { total: number; monto_total: number };
  presupuesto: { usado_mes: number };
}

interface SolicitudData {
  id: number;
  urgencia: string;
  estado: string;
  tipo_ayuda_nombre: string;
  monto_estimado: number;
  fecha_solicitud: string;
}

interface AyudaData {
  id: number;
  tipo_ayuda_nombre: string;
  monto_otorgado: number;
  fecha_otorgada: string;
  estado_entrega: string;
}

// Nueva interfaz para personas
interface PersonaData {
  id: number;
  nombre_completo: string;
  cedula: string;
  genero: string;
  telefono: string;
  departamento: string;
  municipio: string;
  nivel_prioridad: string;
  fecha_registro: string;
}

export default function Reportes() {
  const [selectedReport, setSelectedReport] = useState("mensual");
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [solicitudes, setSolicitudes] = useState<SolicitudData[]>([]);
  const [ayudas, setAyudas] = useState<AyudaData[]>([]);
  const [personas, setPersonas] = useState<PersonaData[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Referencias para los canvas de los gráficos
  const chartEstadisticas = useRef<HTMLCanvasElement>(null);
  const chartUrgencias = useRef<HTMLCanvasElement>(null);
  const chartTiposAyuda = useRef<HTMLCanvasElement>(null);
  const chartMontosMensuales = useRef<HTMLCanvasElement>(null);
  const chartEstadosEntrega = useRef<HTMLCanvasElement>(null);

  // Referencias para las instancias de Chart.js
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    cargarDatos();
    return () => {
      // Limpiar gráficos 
      chartInstances.current.forEach(chart => chart.destroy());
    };
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [estadisticasRes, solicitudesRes, ayudasRes, personasRes] = await Promise.all([
        fetch('/api/dashboard/estadisticas'),
        fetch('/api/solicitudes?limite=200'),
        fetch('/api/ayudas?limite=200'),
        fetch('/api/personas?limite=100') 
      ]);

      const estadisticasData = await estadisticasRes.json();
      const solicitudesData = await solicitudesRes.json();
      const ayudasData = await ayudasRes.json();
      const personasData = await personasRes.json();

      if (estadisticasData.success) {
        setEstadisticas(estadisticasData.data.estadisticas);
      }

      if (solicitudesData.success) {
        setSolicitudes(solicitudesData.data);
      }

      if (ayudasData.success) {
        setAyudas(ayudasData.data);
      }

      if (personasData.success) {
        setPersonas(personasData.data);
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error cargando datos del sistema');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (estadisticas && solicitudes.length > 0 && ayudas.length > 0) {
      crearGraficos();
    }
  }, [estadisticas, solicitudes, ayudas]);

  const crearGraficos = () => {
    // Limpiar gráficos
    chartInstances.current.forEach(chart => chart.destroy());
    chartInstances.current = [];

    crearGraficoEstadisticasGenerales();
    crearGraficoUrgencias();
    crearGraficoTiposAyuda();
    crearGraficoMontosMensuales();
    crearGraficoEstadosEntrega();
  };

  const crearGraficoEstadisticasGenerales = () => {
    if (!chartEstadisticas.current || !estadisticas) return;

    const ctx = chartEstadisticas.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Personas Registradas', 'Solicitudes Pendientes', 'Ayudas Otorgadas', 'Presupuesto Usado (L)'],
        datasets: [{
          label: 'Estadísticas Generales',
          data: [
            estadisticas.personas.total,
            estadisticas.solicitudes.total,
            estadisticas.ayudas.total,
            Math.round(estadisticas.presupuesto.usado_mes / 1000) // Convertir a miles
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(139, 92, 246, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Estadísticas Generales del Sistema'
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    chartInstances.current.push(chart);
  };

  const crearGraficoUrgencias = () => {
    if (!chartUrgencias.current) return;

    const ctx = chartUrgencias.current.getContext('2d');
    if (!ctx) return;

    // Contar solicitudes por urgencia
    const urgenciasCount = solicitudes.reduce((acc, solicitud) => {
      acc[solicitud.urgencia] = (acc[solicitud.urgencia] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(urgenciasCount),
        datasets: [{
          data: Object.values(urgenciasCount),
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)', // Alta - Rojo
            'rgba(245, 158, 11, 0.8)', // Media - Amarillo
            'rgba(16, 185, 129, 0.8)'  // Baja - Verde
          ],
          borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(16, 185, 129, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Distribución por Urgencia'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    chartInstances.current.push(chart);
  };

  const crearGraficoTiposAyuda = () => {
    if (!chartTiposAyuda.current) return;

    const ctx = chartTiposAyuda.current.getContext('2d');
    if (!ctx) return;

    // Contar solicitudes por tipo de ayuda
    const tiposCount = solicitudes.reduce((acc, solicitud) => {
      acc[solicitud.tipo_ayuda_nombre] = (acc[solicitud.tipo_ayuda_nombre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(tiposCount),
        datasets: [{
          data: Object.values(tiposCount),
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',   // Medicina - Rojo
            'rgba(34, 197, 94, 0.8)',   // Alimentos - Verde
            'rgba(59, 130, 246, 0.8)',  // Vivienda - Azul
            'rgba(245, 158, 11, 0.8)',  // Educación - Amarillo
            'rgba(139, 92, 246, 0.8)'   // Servicios - Púrpura
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Solicitudes por Tipo de Ayuda'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    chartInstances.current.push(chart);
  };

  const crearGraficoMontosMensuales = () => {
    if (!chartMontosMensuales.current) return;

    const ctx = chartMontosMensuales.current.getContext('2d');
    if (!ctx) return;

    // Agrupar ayudas por mes
    const montosPorMes = ayudas.reduce((acc, ayuda) => {
      const fecha = new Date(ayuda.fecha_otorgada);
      const mes = fecha.toLocaleDateString('es-HN', { month: 'short', year: 'numeric' });
      acc[mes] = (acc[mes] || 0) + ayuda.monto_otorgado;
      return acc;
    }, {} as Record<string, number>);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(montosPorMes),
        datasets: [{
          label: 'Monto Otorgado (L)',
          data: Object.values(montosPorMes),
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Evolución de Montos Otorgados por Mes'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'L ' + value.toLocaleString();
              }
            }
          }
        }
      }
    });

    chartInstances.current.push(chart);
  };

  const crearGraficoEstadosEntrega = () => {
    if (!chartEstadosEntrega.current) return;

    const ctx = chartEstadosEntrega.current.getContext('2d');
    if (!ctx) return;

    // Contar ayudas por estado de entrega
    const estadosCount = ayudas.reduce((acc, ayuda) => {
      acc[ayuda.estado_entrega] = (acc[ayuda.estado_entrega] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(estadosCount),
        datasets: [{
          label: 'Cantidad de Ayudas',
          data: Object.values(estadosCount),
          backgroundColor: [
            'rgba(245, 158, 11, 0.8)', // Programada - Amarillo
            'rgba(16, 185, 129, 0.8)', // Entregada - Verde
            'rgba(239, 68, 68, 0.8)'   // Cancelada - Rojo
          ],
          borderColor: [
            'rgba(245, 158, 11, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Estados de Entrega de Ayudas'
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    chartInstances.current.push(chart);
  };

  // Función para obtener información de prioridad
  const getPrioridadInfo = (prioridad: string) => {
    const prioridades = {
      'high': { color: 'danger', texto: 'ALTA', icon: 'bi-exclamation-triangle-fill' },
      'medium': { color: 'warning', texto: 'MEDIA', icon: 'bi-dash-circle-fill' },
      'low': { color: 'success', texto: 'BAJA', icon: 'bi-check-circle-fill' }
    };
    return prioridades[prioridad as keyof typeof prioridades] || prioridades.medium;
  };

  // Función para formatear fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Función para formatear cédula
  const formatearCedula = (cedula: string) => {
    if (cedula.length >= 4) {
      return `${cedula.slice(0, 4)}-${cedula.slice(4, 8)}-${cedula.slice(8, 13)}`;
    }
    return cedula;
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navigation activeSection="reportes" />
        <div className="container py-4">
          <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted">Cargando reportes y gráficos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-light">
        <Navigation activeSection="reportes" />
        <div className="container py-4">
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navigation activeSection="reportes" />

      <div className="container py-4">
        
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/Dashboard" className="text-decoration-none">
                <i className="bi bi-house-door me-1"></i>Dashboard
              </a>
            </li>
            <li className="breadcrumb-item active">Reportes y Estadísticas</li>
          </ol>
        </nav>

       
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h1 className="display-6 fw-bold text-primary mb-2">
                  <i className="bi bi-graph-up me-2"></i>
                  Reportes y Estadísticas
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Alerta de datos en tiempo real */}
        <div className="alert alert-info border-0 shadow-sm mb-4" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle-fill me-2 fs-5"></i>
            <span>📈 Datos en tiempo real disponibles</span>
          </div>
        </div>

        {/* Gráficos */}
        
        <div className="row g-4 mb-4">

          {/* Primera fila de gráficos */}

          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <canvas ref={chartEstadisticas} style={{maxHeight: '400px'}}></canvas>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <canvas ref={chartUrgencias} style={{maxHeight: '400px'}}></canvas>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">


          {/* Segunda fila de gráficos */}

          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <canvas ref={chartTiposAyuda} style={{maxHeight: '400px'}}></canvas>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <canvas ref={chartEstadosEntrega} style={{maxHeight: '400px'}}></canvas>
              </div>
            </div>
          </div>
        </div>

        {/*Tabla de Personas Registradas*/}
        
        <div className="row g-4 mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="bi bi-people-fill me-2"></i>
                  Personas Registradas Actualmente
                </h5>
                <span className="badge bg-white text-primary">
                  Total: {personas.length}
                </span>
              </div>
              <div className="card-body">
                {personas.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Nombre Completo</th>
                          <th scope="col">Cédula</th>
                          <th scope="col">Género</th>
                          <th scope="col">Teléfono</th>
                          <th scope="col">Ubicación</th>
                          <th scope="col">Prioridad</th>
                          <th scope="col">Fecha Registro</th>
                        </tr>
                      </thead>
                      <tbody>
                        {personas.map((persona, index) => {
                          const prioridadInfo = getPrioridadInfo(persona.nivel_prioridad);
                          return (
                            <tr key={persona.id}>
                              <th scope="row">{index + 1}</th>
                              <td>
                                <div className="fw-semibold">{persona.nombre_completo}</div>
                              </td>
                              <td>
                                <code className="text-muted">
                                  {formatearCedula(persona.cedula)}
                                </code>
                              </td>
                              <td>
                                <span className={`badge ${persona.genero === 'Masculino' ? 'bg-info' : 'bg-pink'} bg-opacity-25 text-dark`}>
                                  <i className={`bi ${persona.genero === 'Masculino' ? 'bi-person' : 'bi-person-dress'} me-1`}></i>
                                  {persona.genero}
                                </span>
                              </td>
                              <td>
                                {persona.telefono ? (
                                  <span className="text-success">
                                    <i className="bi bi-telephone me-1"></i>
                                    {persona.telefono}
                                  </span>
                                ) : (
                                  <span className="text-muted">
                                    <i className="bi bi-telephone-x me-1"></i>
                                    No disponible
                                  </span>
                                )}
                              </td>
                              <td>
                                <small className="text-muted">
                                  <i className="bi bi-geo-alt me-1"></i>
                                  {persona.municipio}, {persona.departamento}
                                </small>
                              </td>
                              <td>
                                <span className={`badge bg-${prioridadInfo.color}`}>
                                  <i className={`${prioridadInfo.icon} me-1`}></i>
                                  {prioridadInfo.texto}
                                </span>
                              </td>
                              <td>
                                <small className="text-muted">
                                  <i className="bi bi-calendar me-1"></i>
                                  {formatearFecha(persona.fecha_registro)}
                                </small>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-people text-muted" style={{fontSize: '4rem'}}></i>
                    <h5 className="text-muted mt-3">No hay personas registradas</h5>
                    <p className="text-muted">Las personas registradas aparecerán aquí</p>
                    <a href="/fichaRegistro" className="btn btn-primary">
                      <i className="bi bi-person-plus me-2"></i>
                      Registrar Nueva Persona
                    </a>
                  </div>
                )}
              </div>
              
              {/* Footer con estadísticas rápidas */}
              {personas.length > 0 && (
                <div className="card-footer bg-light">
                  <div className="row text-center">
                    <div className="col-md-3">
                      <div className="text-primary fw-bold">
                        {personas.filter(p => p.nivel_prioridad === 'high').length}
                      </div>
                      <small className="text-muted">Alta Prioridad</small>
                    </div>
                    <div className="col-md-3">
                      <div className="text-warning fw-bold">
                        {personas.filter(p => p.nivel_prioridad === 'medium').length}
                      </div>
                      <small className="text-muted">Media Prioridad</small>
                    </div>
                    <div className="col-md-3">
                      <div className="text-success fw-bold">
                        {personas.filter(p => p.nivel_prioridad === 'low').length}
                      </div>
                      <small className="text-muted">Baja Prioridad</small>
                    </div>
                    <div className="col-md-3">
                      <div className="text-info fw-bold">
                        {personas.filter(p => p.telefono && p.telefono.trim() !== '').length}
                      </div>
                      <small className="text-muted">Con Teléfono</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botón de actualización */}
        <div className="text-center mt-4">
          <button 
            onClick={cargarDatos}
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Actualizando...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Actualizar Datos
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .cursor-pointer:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        
        /* Asegurar que los canvas se ajusten correctamente */
        canvas {
          max-width: 100% !important;
          height: auto !important;
        }
        
        .card-body canvas {
          width: 100% !important;
        }

        /* Estilos para la tabla */
        .table-responsive {
          max-height: 600px;
          overflow-y: auto;
        }
        
        .bg-pink {
          background-color: #f8d7da !important;
        }
        
        /* Zebra stripes mejoradas */
        .table-striped > tbody > tr:nth-of-type(odd) > td {
          background-color: rgba(102, 126, 234, 0.05);
        }
        
        /* Hover mejorado */
        .table-hover > tbody > tr:hover > td {
          background-color: rgba(102, 126, 234, 0.1);
        }
      `}</style>
    </div>
  );
}