"use client";
import React from 'react';

function NuevaSolicitud() {
  return (
    <div className="container">
      {/* Top Navigation */}
      <div className="top-nav">
        <div className="nav-content">
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
              <div className="nav-btn active">
                <span className="nav-btn-title">📋 Solicitudes</span>
                <span className="nav-btn-sub">Nueva</span>
              </div>
              <a href="solicitudNueva" className="nav-btn">
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

      {/* Solicitud Content */}
      <div className="main-content active">
        <div className="breadcrumb">
          <a href="index.html">← Volver</a>
          <span> | 🤝 Nueva Solicitud de Ayuda | Solicitudes &gt; Nueva Solicitud</span>
        </div>

        <div className="alert">⚠️ 5 casos urgentes pendientes</div>

        <div className="two-column">
          <div className="form-container">
            <h1 className="form-title">Crear Nueva Solicitud</h1>
            <p className="form-subtitle">Complete la información para generar la solicitud</p>

            <h3 className="section-title">👤 Seleccionar Beneficiario</h3>

            <div className="form-group">
              <label className="form-label">Buscar Persona *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="🔍 Buscar por nombre o cédula"
                  style={{ flex: 1 }}
                />
                <button className="btn btn-info">Buscar</button>
              </div>
            </div>

            <div className="person-card">
              <div className="person-avatar">👤</div>
              <div className="person-info">
                <div className="person-name">Ana María García</div>
                <div className="person-details">Cédula: 1234567890</div>
                <div className="person-details">Tel: +504 9876-5432</div>
                <div className="person-priority">⚠️ Prioridad: ALTA</div>
              </div>
              <button className="remove-btn">✕ Quitar</button>
            </div>

            <h3 className="section-title">📋 Detalles de la Solicitud</h3>

            <div className="form-grid two-col">
              <div className="form-group">
                <label className="form-label">Tipo de Ayuda *</label>
                <select className="form-input">
                  <option>Medicina, Alimentos, Vivienda...</option>
                  <option>Medicina</option>
                  <option>Alimentos</option>
                  <option>Vivienda</option>
                  <option>Educación</option>
                  <option>Servicios</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Urgencia</label>
                <select className="form-input">
                  <option>Alta</option>
                  <option>Media</option>
                  <option>Baja</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Monto Estimado *</label>
                <input type="number" className="form-input" placeholder="L 0.00" />
              </div>

              <div className="form-group">
                <label className="form-label">Fecha Esperada</label>
                <input type="date" className="form-input" />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Descripción Detallada *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Describa la situación específica y la necesidad de ayuda..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary">📤 Enviar</button>
              <button className="btn btn-warning">💾 Borrador</button>
              <a href="index.html" className="btn btn-secondary">
                ✕ Cancelar
              </a>
            </div>
          </div>

          <div className="info-panel">
            <h3 className="section-title">💡 Información de Ayuda</h3>

            <div className="stats-box">
              <div className="stats-title">Estadísticas del Mes</div>
              <div className="stats-item">• Solicitudes procesadas: 45</div>
              <div className="stats-item">• Tiempo promedio: 3-5 días</div>
              <div className="stats-item">• Presupuesto disponible: L 235,000</div>
              <div className="stats-item">• Tasa de aprobación: 87%</div>
            </div>

            <h4 className="section-title" style={{ fontSize: '18px' }}>
              📋 Solicitudes Recientes
            </h4>

            <div className="recent-item">
              <div className="recent-dot yellow"></div>
              <div className="recent-content">
                <div className="recent-title">Carlos Ruiz - Medicina</div>
                <div className="recent-amount">L 3,500 - Hace 2 horas</div>
                <div className="recent-status">Estado: En revisión</div>
              </div>
            </div>

            <div className="recent-item processing">
              <div className="recent-dot blue"></div>
              <div className="recent-content">
                <div className="recent-title">María López - Alimentos</div>
                <div className="recent-amount">L 2,200 - Ayer</div>
                <div className="recent-status">Estado: Procesando</div>
              </div>
            </div>

            <div className="recent-item approved">
              <div className="recent-dot green"></div>
              <div className="recent-content">
                <div className="recent-title">Pedro Martínez - Vivienda</div>
                <div className="recent-amount">L 18,500 - Hace 2 días</div>
                <div className="recent-status">Estado: Aprobado</div>
              </div>
            </div>

            <h4 className="section-title" style={{ fontSize: '18px' }}>
              📖 Tipos de Ayuda
            </h4>

            <div className="help-box">
              <div className="help-title">Categorías Disponibles:</div>
              <div className="help-item">🏥 Medicina: L 500 - L 15,000</div>
              <div className="help-item">🍎 Alimentos: L 800 - L 5,000</div>
              <div className="help-item">🏠 Vivienda: L 2,000 - L 25,000</div>
              <div className="help-item">📚 Educación: L 300 - L 8,000</div>
              <div className="help-item">⚡ Servicios: L 500 - L 10,000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NuevaSolicitud;
