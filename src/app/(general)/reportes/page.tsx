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

export default function Reportes() {
  const [selectedReport, setSelectedReport] = useState("mensual");
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [solicitudes, setSolicitudes] = useState<SolicitudData[]>([]);
  const [ayudas, setAyudas] = useState<AyudaData[]>([]);
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
      // Limpiar gráficos al desmontar el componente
      chartInstances.current.forEach(chart => chart.destroy());
    };
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [estadisticasRes, solicitudesRes, ayudasRes] = await Promise.all([
        fetch('/api/dashboard/estadisticas'),
        fetch('/api/solicitudes?limite=200'),
        fetch('/api/ayudas?limite=200')
      ]);

      const estadisticasData = await estadisticasRes.json();
      const solicitudesData = await solicitudesRes.json();
      const ayudasData = await ayudasRes.json();

      if (estadisticasData.success) {
        setEstadisticas(estadisticasData.data.estadisticas);
      }

      if (solicitudesData.success) {
        setSolicitudes(solicitudesData.data);
      }

      if (ayudasData.success) {
        setAyudas(ayudasData.data);
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
    // Limpiar gráficos existentes
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
        {/* Breadcrumb */}
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

        {/* Header */}
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

        <div className="row g-4 mb-4">
          
         
        </div>

        <div className="row g-4">
          {/* Configuración del Reporte */}
          <div className="col-lg-8">
            {/* Contenido existente si lo hay */}
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
      `}</style>
    </div>
  );
}