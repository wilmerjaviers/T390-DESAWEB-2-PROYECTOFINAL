"use client";
import React, { useState } from "react";

export default function RegistroPersonas() {
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const priorityLevels = [
    {
      key: "high",
      title: "Alta Prioridad",
      desc: "Casos urgentes",
    },
    {
      key: "medium",
      title: "Media Prioridad",
      desc: "Casos normales",
    },
    {
      key: "low",
      title: "Baja Prioridad",
      desc: "Casos rutinarios",
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
              <div className="nav-btn active">
                <span className="nav-btn-title">👥 Personas</span>
                <span className="nav-btn-sub">Registro</span>
              </div>
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

      {/* Registro Content */}
      <div className="main-content active">
        <div className="breadcrumb">
          <a href="index.html">← Volver</a>
          <span> | 📝 Ficha de Registro | Personas &gt; Nuevo Registro</span>
        </div>

        <div className="form-container">
          <h1 className="form-title">Registro de Nueva Persona</h1>
          <p className="form-subtitle">
            Complete todos los campos requeridos (*) para registrar correctamente
          </p>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p className="progress-text">Paso 1 de 2 - Información Personal</p>

          <h3 className="section-title">📋 Información Personal</h3>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre Completo *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nombres y apellidos"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cédula/Documento *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Número de identificación"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Género</label>
              <select className="form-input" defaultValue="">
                <option value="" disabled>
                  Seleccionar
                </option>
                <option>Masculino</option>
                <option>Femenino</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estado Civil</label>
              <select className="form-input" defaultValue="">
                <option value="" disabled>
                  Seleccionar
                </option>
                <option>Soltero/a</option>
                <option>Casado/a</option>
                <option>Divorciado/a</option>
                <option>Viudo/a</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Nacimiento *</label>
              <input type="date" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+504 0000-0000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-input"
                placeholder="email@ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Departamento</label>
              <select className="form-input" defaultValue="Francisco Morazán">
                <option>Francisco Morazán</option>
                <option>Cortés</option>
                <option>Atlántida</option>
                <option>Choluteca</option>
              </select>
            </div>
          </div>

          <div className="form-grid two-col">
            <div className="form-group full-width">
              <label className="form-label">Dirección Completa *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Dirección completa de residencia"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Municipio</label>
              <select className="form-input" defaultValue="Tegucigalpa">
                <option>Tegucigalpa</option>
                <option>Comayagüela</option>
                <option>San Pedro Sula</option>
              </select>
            </div>
          </div>

          <h3 className="section-title">⚡ Clasificación y Prioridad</h3>

          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Nivel de Prioridad *</label>
          </div>

          <div className="priority-grid">
            {priorityLevels.map(({ key, title, desc }) => (
              <div
                key={key}
                className={`priority-card ${key}`}
                onClick={() => setSelectedPriority(key)}
                style={{
                  transform: selectedPriority === key ? "scale(1.05)" : "scale(1)",
                  cursor: "pointer",
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedPriority(key);
                  }
                }}
                role="button"
                aria-pressed={selectedPriority === key}
              >
                <div className={`priority-circle ${key}`}></div>
                <div className="priority-title">{title}</div>
                <div className="priority-desc">{desc}</div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button className="btn btn-primary">💾 Guardar</button>
            <a href="index.html" className="btn btn-secondary">
              ✕ Cancelar
            </a>
            <button className="btn btn-info">👁️ Vista Previa</button>
            <button className="btn btn-orange">➡️ Siguiente</button>
            <div className="auto-save">
              💾 Guardado automático
              <br />
              <small>hace 2 minutos</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
