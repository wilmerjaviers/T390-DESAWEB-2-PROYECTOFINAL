"use client";
import React from "react";

export default function Dashboard() {
  return (
    <div className="container">
      <div className="top-nav">
        <div className="nav-content">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="logo">
              <span className="logo-main">🏠 ANADISH</span>
              <span className="logo-sub">Sistema de Gestión</span>
            </div>

            <div className="nav-buttons">
              <div className="nav-btn active">
                <span className="nav-btn-title">📊 Dashboard</span>
                <span className="nav-btn-sub">Panel Principal</span>
              </div>
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
              <a href="reportes" className="nav-btn">
                <span className="nav-btn-title">📈 Reportes</span>
                <span className="nav-btn-sub">Análisis</span>
              </a>
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

      {/* Dashboard Content */}
      <div className="main-content active">
        <h1 className="page-title">Panel de Control</h1>
        <p className="page-subtitle">
          Bienvenido al sistema de gestión - Fundación ANADISH
        </p>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">👥</div>
            <div className="stat-title">Personas</div>
            <div className="stat-title">Registradas</div>
            <div className="stat-value">156</div>
            <div className="stat-subtitle">+12 este mes</div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">📋</div>
            <div className="stat-title">Solicitudes</div>
            <div className="stat-title">Pendientes</div>
            <div className="stat-value">23</div>
            <div className="stat-subtitle">5 urgentes</div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">🤝</div>
            <div className="stat-title">Ayudas</div>
            <div className="stat-title">Otorgadas</div>
            <div className="stat-value">45</div>
            <div className="stat-subtitle">Este mes</div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">💰</div>
            <div className="stat-title">Presupuesto</div>
            <div className="stat-title">Usado</div>
            <div className="stat-value">L 125,450</div>
            <div className="stat-subtitle">68% del total</div>
          </div>
        </div>

        <div className="bottom-section">
          <div className="activity-card">
            <h3 className="card-title">📊 Actividad Reciente</h3>

            <div className="activity-item">
              <div className="activity-dot green"></div>
              <div>
                <div className="activity-text">Nueva persona: Ana García</div>
                <div className="activity-time">Hace 15 minutos</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-dot yellow"></div>
              <div>
                <div className="activity-text">
                  Solicitud: Carlos Ruiz - Medicina
                </div>
                <div className="activity-time">L 3,500 - Hace 1 hora</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-dot blue"></div>
              <div>
                <div className="activity-text">Ayuda aprobada: María López</div>
                <div className="activity-time">L 2,200 - Hace 2 horas</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-dot red"></div>
              <div>
                <div className="activity-text">Caso urgente: Pedro Martínez</div>
                <div className="activity-time">L 8,900 - Hace 3 horas</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-dot purple"></div>
              <div>
                <div className="activity-text">Reporte generado: Enero 2024</div>
                <div className="activity-time">Hace 4 horas</div>
              </div>
            </div>

            <button className="view-all-btn">Ver Todas</button>
          </div>

          <div className="actions-card">
            <h3 className="card-title">⚡ Acciones Rápidas</h3>

            <div className="action-grid">
              <a href="personas.html" className="action-btn">
                + Nuevo Registro
              </a>
              <a href="solicitudes.html" className="action-btn secondary">
                📋 Ver Solicitudes
              </a>
              <a href="reportes.html" className="action-btn warning">
                📊 Generar Reporte
              </a>
              <a href="gestion.html" className="action-btn purple">
                🤝 Gestionar Ayudas
              </a>
              <button className="action-btn orange">📤 Exportar Datos</button>
              <button className="action-btn teal">⚙️ Configuración</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
