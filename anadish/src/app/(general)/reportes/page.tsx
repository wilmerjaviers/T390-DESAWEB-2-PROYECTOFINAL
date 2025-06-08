"use client";
import React, { useState } from "react";

export default function Reportes() {
  const [selectedReport, setSelectedReport] = useState("mensual");

  const reportTypes = [
    {
      id: "mensual",
      emoji: "📅",
      title: "Reporte Mensual",
      desc1: "Resumen mensual con",
      desc2: "estadísticas básicas",
      bg: "#e3f2fd",
      borderColor: "#007bff",
    },
    {
      id: "anual",
      emoji: "📈",
      title: "Reporte Anual",
      desc1: "Informe completo del año",
      desc2: "con análisis detallado",
      bg: "#fff3e0",
      borderColor: "#ff9800",
    },
    {
      id: "personalizado",
      emoji: "⚙️",
      title: "Personalizado",
      desc1: "Período específico con",
      desc2: "filtros personalizados",
      bg: "#e8f5e8",
      borderColor: "#4caf50",
    },
    {
      id: "ejecutivo",
      emoji: "📊",
      title: "Ejecutivo",
      desc1: "Vista ejecutiva con",
      desc2: "métricas clave",
      bg: "#f3e5f5",
      borderColor: "#9c27b0",
    },
  ];

  return (
    <div className="container">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="nav-content">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="logo">
              <span className="logo-main">🏠 ANADISH</span>
              <span className="logo-sub">Sistema de Gestión</span>
            </div>

            <div className="nav-buttons">
              <a href="Dashboard" className="nav-btn">
                <span className="nav-btn-title">📊 Dashboard</span>
                <span className="nav-btn-sub">Panel Principal</span>
              </a>
              <a href="fichaRegistro" className="nav-btn">
                <span className="nav-btn-title">👥 Personas</span>
                <span className="nav-btn-sub">Registro</span>
              </a>
              <a href="solicitudNueva" className="nav-btn">
                <span className="nav-btn-title">📋 Solicitudes</span>
                <span className="nav-btn-sub">Nueva</span>
              </a>
              <a href="gestionAyudas" className="nav-btn">
                <span className="nav-btn-title">🤝 Gestión</span>
                <span className="nav-btn-sub">Ayudas</span>
              </a>
              <div className="nav-btn active">
                <span className="nav-btn-title">📈 Reportes</span>
                <span className="nav-btn-sub">Análisis</span>
              </div>
            </div>
          </div>

          <input
            type="text"
            className="search-bar"
            placeholder="🔍 Buscar personas, solicitudes..."
          />

          <div className="user-section">
            <div className="notification">
              🔔
              <div className="notification-badge">5</div>
            </div>
            <div className="user-avatar">👤</div>
            <div className="user-name">Admin</div>
          </div>
        </div>
      </div>

      {/* Reportes Content */}
      <div className="main-content active">
        <div className="breadcrumb">
          <a href="index.html">← Volver</a>
          <span> | 📊 Reportes y Estadísticas | Generación de Informes</span>
        </div>

        <h1 className="page-title">Reportes y Estadísticas</h1>
        <p className="page-subtitle">
          Genere informes detallados y análisis de datos
        </p>

        <div
          className="alert"
          style={{ background: "#e3f2fd", borderColor: "#2196f3", color: "#1976d2" }}
        >
          📈 Datos en tiempo real disponibles
        </div>

        {/* Report Type Selection */}
        <div className="form-container">
          <h3 className="section-title">📋 Seleccionar Tipo de Reporte</h3>

          <div
            className="priority-grid"
            style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 30 }}
          >
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className="priority-card"
                onClick={() => setSelectedReport(report.id)}
                style={{
                  background: report.bg,
                  borderColor: report.borderColor,
                  borderWidth: selectedReport === report.id ? "2px" : "1px",
                  transform: selectedReport === report.id ? "scale(1.02)" : "scale(1)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  userSelect: "none",
                  padding: "10px",
                  borderStyle: "solid",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{report.emoji}</div>
                <div className="priority-title">{report.title}</div>
                <div className="priority-desc">{report.desc1}</div>
                <div className="priority-desc">{report.desc2}</div>
                {selectedReport === report.id && (
                  <div style={{ color: "#2196f3", fontSize: 12, marginTop: 5 }}>
                    ✓ Seleccionado
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="two-column">
          <div className="form-container">
            <h3 className="section-title">🗓️ Configuración del Reporte</h3>

            <div
              className="form-grid two-col"
              style={{ marginBottom: 30 }}
            >
              <div className="form-group">
                <label className="form-label">Fecha Desde</label>
                <input type="date" className="form-input" defaultValue="2024-01-01" />
              </div>

              <div className="form-group">
                <label className="form-label">Fecha Hasta</label>
                <input type="date" className="form-input" defaultValue="2024-01-31" />
              </div>
            </div>

            <div
              className="form-grid three-col"
              style={{ marginBottom: 30 }}
            >
              <div className="form-group">
                <label className="form-label">Tipo de Ayuda</label>
                <select className="form-input" defaultValue="Todas las categorías">
                  <option>Todas las categorías</option>
                  <option>Medicina</option>
                  <option>Alimentos</option>
                  <option>Vivienda</option>
                  <option>Educación</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Prioridad</label>
                <select className="form-input" defaultValue="Todas">
                  <option>Todas</option>
                  <option>Alta</option>
                  <option>Media</option>
                  <option>Baja</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-input" defaultValue="Todos">
                  <option>Todos</option>
                  <option>Pendiente</option>
                  <option>Aprobado</option>
                  <option>Rechazado</option>
                </select>
              </div>
            </div>

            <div
              className="form-grid two-col"
              style={{ marginBottom: 30 }}
            >
              <div className="form-group">
                <label className="form-label">Monto Mínimo (Lempiras)</label>
                <input type="number" className="form-input" placeholder="L 0" />
              </div>

              <div className="form-group">
                <label className="form-label">Monto Máximo (Lempiras)</label>
                <input type="number" className="form-input" placeholder="L 50,000" />
              </div>
            </div>

            <div style={{ marginBottom: 30 }}>
              <label className="form-label">Formato de Salida</label>
              <div style={{ display: "flex", gap: 15, marginTop: 10 }}>
                <button
                  className="btn btn-secondary"
                  style={{ background: "#dc3545" }}
                >
                  📄 PDF
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ background: "#f8f9fa", color: "#495057" }}
                >
                  📊 Excel
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ background: "#f8f9fa", color: "#495057" }}
                >
                  📈 CSV
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary">Generar Reporte</button>
              <button className="btn btn-outline">Limpiar</button>
            </div>
          </div>

          {/* Panel de Ayudas Recientes */}
          <div className="help-panel">
            <h3 className="section-title">🤝 Ayudas Recientes</h3>
            <ul className="help-list">
              <li>
                <strong>Juan Pérez</strong> recibió apoyo para medicamentos.{" "}
                <em>Fecha: 01/05/2024</em>
              </li>
              <li>
                <strong>María Gómez</strong> apoyo para alimentos básicos.{" "}
                <em>Fecha: 03/05/2024</em>
              </li>
              <li>
                <strong>Carlos Ruiz</strong> recibió ayuda para vivienda temporal.{" "}
                <em>Fecha: 05/05/2024</em>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
