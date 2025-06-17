"use client";
import React, { useState } from "react";
import Navigation from "../../components/Navigation";


export default function Reportes() {
  const [selectedReport, setSelectedReport] = useState("mensual");

  const reportTypes = [
    {
      id: "mensual",
      icon: "bi-calendar-month",
      title: "Reporte Mensual",
      desc1: "Resumen mensual con",
      desc2: "estadísticas básicas",
      color: "primary",
    },
    {
      id: "anual",
      icon: "bi-graph-up",
      title: "Reporte Anual",
      desc1: "Informe completo del año",
      desc2: "con análisis detallado",
      color: "warning",
    },
    {
      id: "personalizado",
      icon: "bi-gear",
      title: "Personalizado",
      desc1: "Período específico con",
      desc2: "filtros personalizados",
      color: "success",
    },
    {
      id: "ejecutivo",
      icon: "bi-bar-chart",
      title: "Ejecutivo",
      desc1: "Vista ejecutiva con",
      desc2: "métricas clave",
      color: "info",
    },
  ];

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
                <p className="lead text-muted">
                  Genere informes detallados y análisis de datos
                </p>
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

        <div className="row g-4">
          {/* Configuración del Reporte */}
          <div className="col-lg-8">
            {/* Selección de Tipo de Reporte */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-clipboard-data me-2"></i>Seleccionar Tipo de Reporte
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {reportTypes.map((report) => (
                    <div key={report.id} className="col-md-6">
                      <div
                        className={`card h-100 border-${report.color} ${selectedReport === report.id ? `bg-${report.color} bg-opacity-10` : ''} cursor-pointer`}
                        onClick={() => setSelectedReport(report.id)}
                        style={{cursor: 'pointer', transition: 'all 0.2s'}}
                      >
                        <div className="card-body text-center">
                          <i className={`${report.icon} text-${report.color} mb-2`} style={{fontSize: '2.5rem'}}></i>
                          <h6 className={`card-title text-${report.color}`}>{report.title}</h6>
                          <p className="card-text text-muted small mb-1">{report.desc1}</p>
                          <p className="card-text text-muted small">{report.desc2}</p>
                          {selectedReport === report.id && (
                            <div className={`badge bg-${report.color} bg-opacity-25 text-${report.color} mt-2`}>
                              <i className="bi bi-check-circle-fill me-1"></i>Seleccionado
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Configuración de Parámetros */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-info text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-calendar-range me-2"></i>Configuración del Reporte
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-calendar-date me-1"></i>Fecha Desde
                    </label>
                    <input type="date" className="form-control form-control-lg" defaultValue="2024-01-01" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-calendar-check me-1"></i>Fecha Hasta
                    </label>
                    <input type="date" className="form-control form-control-lg" defaultValue="2024-01-31" />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-tags me-1"></i>Tipo de Ayuda
                    </label>
                    <select className="form-select form-select-lg" defaultValue="Todas las categorías">
                      <option>Todas las categorías</option>
                      <option>Medicina</option>
                      <option>Alimentos</option>
                      <option>Vivienda</option>
                      <option>Educación</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-flag me-1"></i>Prioridad
                    </label>
                    <select className="form-select form-select-lg" defaultValue="Todas">
                      <option>Todas</option>
                      <option>Alta</option>
                      <option>Media</option>
                      <option>Baja</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-check-circle me-1"></i>Estado
                    </label>
                    <select className="form-select form-select-lg" defaultValue="Todos">
                      <option>Todos</option>
                      <option>Pendiente</option>
                      <option>Aprobado</option>
                      <option>Rechazado</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-currency-dollar me-1"></i>Monto Mínimo (Lempiras)
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text">L</span>
                      <input type="number" className="form-control" placeholder="0" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-currency-dollar me-1"></i>Monto Máximo (Lempiras)
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text">L</span>
                      <input type="number" className="form-control" placeholder="50,000" />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-file-earmark me-1"></i>Formato de Salida
                  </label>
                  <div className="d-flex gap-3 mt-2">
                    <button className="btn btn-danger btn-lg">
                      <i className="bi bi-file-earmark-pdf me-2"></i>PDF
                    </button>
                    <button className="btn btn-success btn-lg">
                      <i className="bi bi-file-earmark-excel me-2"></i>Excel
                    </button>
                    <button className="btn btn-info btn-lg">
                      <i className="bi bi-filetype-csv me-2"></i>CSV
                    </button>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button className="btn btn-primary btn-lg">
                    <i className="bi bi-download me-2"></i>Generar Reporte
                  </button>
                  <button className="btn btn-outline-secondary btn-lg">
                    <i className="bi bi-arrow-clockwise me-2"></i>Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Lateral - Ayudas Recientes y Estadísticas */}
          <div className="col-lg-4">
            {/* Ayudas Recientes */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-success text-white">
                <h6 className="card-title mb-0">
                  <i className="bi bi-hand-thumbs-up me-2"></i>Ayudas Recientes
                </h6>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  <div className="list-group-item px-0 border-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="me-auto">
                        <strong className="mb-1">Juan Pérez</strong>
                        <p className="mb-1 small text-muted">recibió apoyo para medicamentos.</p>
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>01/05/2024
                        </small>
                      </div>
                      <span className="badge bg-primary rounded-pill">L 1,500</span>
                    </div>
                  </div>
                  
                  <div className="list-group-item px-0 border-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="me-auto">
                        <strong className="mb-1">María Gómez</strong>
                        <p className="mb-1 small text-muted">apoyo para alimentos básicos.</p>
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>03/05/2024
                        </small>
                      </div>
                      <span className="badge bg-success rounded-pill">L 2,000</span>
                    </div>
                  </div>
                  
                  <div className="list-group-item px-0 border-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="me-auto">
                        <strong className="mb-1">Carlos Ruiz</strong>
                        <p className="mb-1 small text-muted">recibió ayuda para vivienda temporal.</p>
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>05/05/2024
                        </small>
                      </div>
                      <span className="badge bg-warning rounded-pill">L 5,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-secondary text-white">
                <h6 className="card-title mb-0">
                  <i className="bi bi-bar-chart me-2"></i>Estadísticas del Mes
                </h6>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="bg-primary bg-opacity-10 rounded p-3 text-center">
                      <i className="bi bi-people text-primary" style={{fontSize: '1.5rem'}}></i>
                      <div className="fw-bold text-primary mt-1">156</div>
                      <small className="text-muted">Personas Atendidas</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-success bg-opacity-10 rounded p-3 text-center">
                      <i className="bi bi-hand-thumbs-up text-success" style={{fontSize: '1.5rem'}}></i>
                      <div className="fw-bold text-success mt-1">89</div>
                      <small className="text-muted">Ayudas Otorgadas</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-warning bg-opacity-10 rounded p-3 text-center">
                      <i className="bi bi-clock text-warning" style={{fontSize: '1.5rem'}}></i>
                      <div className="fw-bold text-warning mt-1">23</div>
                      <small className="text-muted">Pendientes</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-info bg-opacity-10 rounded p-3 text-center">
                      <i className="bi bi-currency-dollar text-info" style={{fontSize: '1.5rem'}}></i>
                      <div className="fw-bold text-info mt-1">L 45K</div>
                      <small className="text-muted">Total Invertido</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico de Progreso */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-dark text-white">
                <h6 className="card-title mb-0">
                  <i className="bi bi-pie-chart me-2"></i>Distribución por Tipo
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small">Medicina</span>
                    <span className="small">40%</span>
                  </div>
                  <div className="progress" style={{height: '8px'}}>
                    <div className="progress-bar bg-danger" style={{width: '40%'}}></div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small">Alimentos</span>
                    <span className="small">30%</span>
                  </div>
                  <div className="progress" style={{height: '8px'}}>
                    <div className="progress-bar bg-success" style={{width: '30%'}}></div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small">Vivienda</span>
                    <span className="small">20%</span>
                  </div>
                  <div className="progress" style={{height: '8px'}}>
                    <div className="progress-bar bg-warning" style={{width: '20%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small">Educación</span>
                    <span className="small">10%</span>
                  </div>
                  <div className="progress" style={{height: '8px'}}>
                    <div className="progress-bar bg-info" style={{width: '10%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vista Previa del Reporte */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="card-title mb-0">
                  <i className="bi bi-eye me-2"></i>Vista Previa del Reporte - {reportTypes.find(r => r.id === selectedReport)?.title}
                </h5>
              </div>
              <div className="card-body">
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-file-earmark-text" style={{fontSize: '4rem'}}></i>
                  <h5 className="mt-3">Vista Previa del Reporte</h5>
                  <p className="mb-3">Configure los parámetros y haga clic en "Generar Reporte" para ver una vista previa</p>
                  <div className="d-flex justify-content-center gap-2">
                    <span className="badge bg-primary">Datos en tiempo real</span>
                    <span className="badge bg-success">Exportable</span>
                    <span className="badge bg-info">Personalizable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      `}</style>
    </div>
  );
}