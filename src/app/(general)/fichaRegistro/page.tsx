"use client";
import React, { useState } from "react";
import Navigation from "../../components/Navigation";


interface FormData {
  nombre_completo: string;
  cedula: string;
  genero: string;
  estado_civil: string;
  fecha_nacimiento: string;
  telefono: string;
  email: string;
  departamento: string;
  municipio: string;
  direccion_completa: string;
  nivel_prioridad: string;
}

export default function RegistroPersonas() {
  const [formData, setFormData] = useState<FormData>({
    nombre_completo: '',
    cedula: '',
    genero: '',
    estado_civil: '',
    fecha_nacimiento: '',
    telefono: '',
    email: '',
    departamento: 'Francisco Morazán',
    municipio: 'Tegucigalpa',
    direccion_completa: '',
    nivel_prioridad: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const priorityLevels = [
    {
      key: "high",
      title: "Alta Prioridad",
      desc: "Casos urgentes y críticos",
      color: "danger",
      icon: "bi-exclamation-triangle-fill"
    },
    {
      key: "medium",
      title: "Media Prioridad", 
      desc: "Casos normales",
      color: "warning",
      icon: "bi-dash-circle-fill"
    },
    {
      key: "low",
      title: "Baja Prioridad",
      desc: "Casos rutinarios",
      color: "success",
      icon: "bi-check-circle-fill"
    },
  ];

  const departamentos = [
    'Francisco Morazán', 'Cortés', 'Atlántida'//, 'Choluteca', 'El Paraíso',
    //'Yoro', 'Olancho', 'Colón', 'Comayagua', 'Santa Bárbara',
    //'Lempira', 'Copán', 'Intibucá', 'La Paz', 'Valle',
    //'Ocotepeque', 'Gracias a Dios', 'Islas de la Bahía'
  ];

  const municipiosPorDepartamento: {[key: string]: string[]} = {
    'Francisco Morazán': ['Tegucigalpa', 'Comayagüela', 'Valle de Ángeles', 'Santa Lucía', 'San Juan de Flores'],
    'Cortés': ['San Pedro Sula', 'Choloma', 'La Lima', 'Villanueva', 'Puerto Cortés'],
    'Atlántida': ['La Ceiba', 'Tela', 'El Progreso', 'Jutiapa', 'Arizona'],
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'departamento') {
        newData.municipio = municipiosPorDepartamento[value]?.[0] || '';
      }
      
      return newData;
    });

    if (message) {
      setMessage(null);
    }
  };

  const handlePrioritySelect = (priority: string) => {
    setFormData(prev => ({
      ...prev,
      nivel_prioridad: priority
    }));
    if (message) {
      setMessage(null);
    }
  };

  const validateForm = (): boolean => {
    const trimmedData = {
      ...formData,
      nombre_completo: formData.nombre_completo.trim(),
      cedula: formData.cedula.trim(),
      direccion_completa: formData.direccion_completa.trim()
    };

    if (!trimmedData.nombre_completo) {
      setMessage({type: 'error', text: 'El nombre completo es requerido'});
      return false;
    }

    if (!trimmedData.cedula) {
      setMessage({type: 'error', text: 'La cédula es requerida'});
      return false;
    }

    if (!/^\d{13}$/.test(trimmedData.cedula.replace(/\D/g, ''))) {
      setMessage({type: 'error', text: 'La cédula debe tener 13 dígitos'});
      return false;
    }

    if (!formData.genero) {
      setMessage({type: 'error', text: 'El género es requerido'});
      return false;
    }

    if (!formData.fecha_nacimiento) {
      setMessage({type: 'error', text: 'La fecha de nacimiento es requerida'});
      return false;
    }

    if (!trimmedData.direccion_completa) {
      setMessage({type: 'error', text: 'La dirección completa es requerida'});
      return false;
    }

    if (!formData.nivel_prioridad) {
      setMessage({type: 'error', text: 'Debe seleccionar un nivel de prioridad'});
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const dataToSend = {
        ...formData,
        nombre_completo: formData.nombre_completo.trim(),
        cedula: formData.cedula.replace(/\D/g, ''),
        direccion_completa: formData.direccion_completa.trim()
      };

      const response = await fetch('/api/personas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({type: 'success', text: `Persona registrada exitosamente con ID: ${data.data.id}`});
        
        setFormData({
          nombre_completo: '',
          cedula: '',
          genero: '',
          estado_civil: '',
          fecha_nacimiento: '',
          telefono: '',
          email: '',
          departamento: 'Francisco Morazán',
          municipio: 'Tegucigalpa',
          direccion_completa: '',
          nivel_prioridad: ''
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setMessage({type: 'error', text: data.error || 'Error al registrar persona'});
      }
    } catch (error) {
      console.error('Error registrando persona:', error);
      setMessage({type: 'error', text: 'Error de conexión. Intente nuevamente.'});
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCedula = (cedula: string) => {
    const numbers = cedula.replace(/\D/g, '');
    if (numbers.length >= 4) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}-${numbers.slice(8, 13)}`;
    }
    return numbers;
  };

  const getProgressPercentage = () => {
    const requiredFields = ['nombre_completo', 'cedula', 'genero', 'fecha_nacimiento', 'direccion_completa', 'nivel_prioridad'];
    const filledFields = requiredFields.filter(field => formData[field as keyof FormData] !== '');
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navigation activeSection="fichaRegistro" />

      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/Dashboard" className="text-decoration-none">
                <i className="bi bi-house-door me-1"></i>Dashboard
              </a>
            </li>
            <li className="breadcrumb-item active">Registro de Personas</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h1 className="display-6 fw-bold text-primary mb-2">
                  <i className="bi bi-person-plus-fill me-2"></i>
                  Registro de Nueva Persona
                </h1>
                <p className="lead text-muted">
                  Complete todos los campos requeridos (*) para registrar correctamente a la persona en el sistema
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
            <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
          </div>
        )}

        {/* Barra de progreso */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-semibold">Progreso del formulario</span>
              <span className="badge bg-primary">{getProgressPercentage()}%</span>
            </div>
            <div className="progress" style={{height: '8px'}}>
              <div 
                className="progress-bar bg-gradient" 
                style={{width: `${getProgressPercentage()}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Información Personal */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-person-fill me-2"></i>Información Personal
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-person me-1"></i>Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre_completo"
                    className="form-control form-control-lg"
                    placeholder="Nombres y apellidos completos"
                    value={formData.nombre_completo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-credit-card me-1"></i>Cédula de Identidad *
                  </label>
                  <input
                    type="text"
                    name="cedula"
                    className="form-control form-control-lg"
                    placeholder="0000-0000-00000"
                    value={formatCedula(formData.cedula)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 13);
                      setFormData(prev => ({ ...prev, cedula: value }));
                    }}
                    maxLength={15}
                    required
                  />
                  <div className="form-text">Formato: 0000-0000-00000 (13 dígitos)</div>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-gender-ambiguous me-1"></i>Género *
                  </label>
                  <select 
                    name="genero"
                    className="form-select form-select-lg" 
                    value={formData.genero}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-heart me-1"></i>Estado Civil
                  </label>
                  <select 
                    name="estado_civil"
                    className="form-select form-select-lg" 
                    value={formData.estado_civil}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar estado civil</option>
                    <option value="Soltero/a">Soltero/a</option>
                    <option value="Casado/a">Casado/a</option>
                    <option value="Divorciado/a">Divorciado/a</option>
                    <option value="Viudo/a">Viudo/a</option>
                    
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-calendar-date me-1"></i>Fecha de Nacimiento *
                  </label>
                  <input 
                    type="date" 
                    name="fecha_nacimiento"
                    className="form-control form-control-lg"
                    value={formData.fecha_nacimiento}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    min="1900-01-01"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-telephone me-1"></i>Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    className="form-control form-control-lg"
                    placeholder="+504 0000-0000"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-envelope me-1"></i>Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-lg"
                    placeholder="email@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información de Ubicación */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-geo-alt-fill me-2"></i>Información de Ubicación
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-map me-1"></i>Departamento *
                  </label>
                  <select 
                    name="departamento"
                    className="form-select form-select-lg" 
                    value={formData.departamento}
                    onChange={handleInputChange}
                    required
                  >
                    {departamentos.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-building me-1"></i>Municipio *
                  </label>
                  <select 
                    name="municipio"
                    className="form-select form-select-lg" 
                    value={formData.municipio}
                    onChange={handleInputChange}
                    required
                  >
                    {(municipiosPorDepartamento[formData.departamento] || ['Tegucigalpa']).map(mun => (
                      <option key={mun} value={mun}>{mun}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-house me-1"></i>Dirección Completa *
                  </label>
                  <textarea
                    name="direccion_completa"
                    className="form-control"
                    placeholder="Dirección completa de residencia (colonia, barrio, calle, número de casa, referencias)"
                    value={formData.direccion_completa}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Clasificación y Prioridad */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-warning text-dark">
              <h5 className="card-title mb-0">
                <i className="bi bi-flag-fill me-2"></i>Clasificación y Prioridad
              </h5>
            </div>
            <div className="card-body">
              <label className="form-label fw-semibold mb-3">
                <i className="bi bi-exclamation-triangle me-1"></i>Nivel de Prioridad *
              </label>
              <p className="text-muted mb-4">
                Seleccione el nivel de prioridad según la urgencia del caso
              </p>

              <div className="row g-3">
                {priorityLevels.map(({ key, title, desc, color, icon }) => (
                  <div key={key} className="col-md-4">
                    <div
                      className={`card h-100 border-${color} ${formData.nivel_prioridad === key ? `bg-${color} bg-opacity-10` : ''} cursor-pointer`}
                      onClick={() => handlePrioritySelect(key)}
                      style={{cursor: 'pointer', transition: 'all 0.2s'}}
                    >
                      <div className="card-body text-center">
                        <i className={`${icon} text-${color} mb-2`} style={{fontSize: '2rem'}}></i>
                        <h6 className={`card-title text-${color}`}>{title}</h6>
                        <p className="card-text text-muted small">{desc}</p>
                        {formData.nivel_prioridad === key && (
                          <div className={`badge bg-${color} bg-opacity-25 text-${color}`}>
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

          {/* Botones de acción */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-2"></i>Guardar Persona
                    </>
                  )}
                </button>
                
                <button 
                  type="button"
                  onClick={() => window.location.reload()}
                  className="btn btn-secondary btn-lg"
                  disabled={isSubmitting}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>Limpiar Formulario
                </button>
                
                <a href="/Dashboard" className="btn btn-outline-secondary btn-lg">
                  <i className="bi bi-arrow-left me-2"></i>Volver al Dashboard
                </a>
                
                <button 
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn btn-info btn-lg"
                  disabled={isSubmitting}
                >
                  <i className="bi bi-eye me-2"></i>Vista Previa
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Vista previa */}
        {showPreview && (
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-secondary text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-eye me-2"></i>Vista Previa de los Datos
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <h6 className="fw-bold">{formData.nombre_completo || 'Sin nombre'}</h6>
                  <div className="row g-2 small">
                    <div className="col-md-6"><strong>Cédula:</strong> {formatCedula(formData.cedula) || 'No proporcionada'}</div>
                    <div className="col-md-6"><strong>Género:</strong> {formData.genero || 'No especificado'}</div>
                    <div className="col-md-6"><strong>Fecha Nac:</strong> {formData.fecha_nacimiento || 'No especificada'}</div>
                    <div className="col-md-6"><strong>Estado Civil:</strong> {formData.estado_civil || 'No especificado'}</div>
                    <div className="col-md-6"><strong>Teléfono:</strong> {formData.telefono || 'No proporcionado'}</div>
                    <div className="col-md-6"><strong>Email:</strong> {formData.email || 'No proporcionado'}</div>
                    <div className="col-12">
                      <strong>Dirección:</strong> {formData.direccion_completa || 'No especificada'}, {formData.municipio}, {formData.departamento}
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  {formData.nivel_prioridad && (
                    <span className={`badge bg-${priorityLevels.find(p => p.key === formData.nivel_prioridad)?.color} fs-6`}>
                      <i className={`${priorityLevels.find(p => p.key === formData.nivel_prioridad)?.icon} me-1`}></i>
                      {priorityLevels.find(p => p.key === formData.nivel_prioridad)?.title}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}