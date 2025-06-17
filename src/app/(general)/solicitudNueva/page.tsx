"use client";
import React, { useState, useEffect } from 'react';
import Navigation from "../../components/Navigation";


interface Persona {
  id: number;
  nombre_completo: string;
  cedula: string;
  telefono: string;
  nivel_prioridad: string;
  departamento: string;
  municipio: string;
  direccion_completa: string;
}

interface TipoAyuda {
  id: number;
  nombre: string;
  descripcion: string;
  monto_minimo: number;
  monto_maximo: number;
}

interface SolicitudFormData {
  persona_id: number;
  tipo_ayuda_id: number;
  monto_estimado: number;
  urgencia: string;
  descripcion: string;
  fecha_esperada: string;
}

export default function NuevaSolicitud() {
  // Estados principales
  const [personaSeleccionada, setPersonaSeleccionada] = useState<Persona | null>(null);
  const [tiposAyuda, setTiposAyuda] = useState<TipoAyuda[]>([]);

  // Estados de búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState<Persona[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [buscando, setBuscando] = useState(false);

  // Estados del formulario
  const [solicitudData, setSolicitudData] = useState<SolicitudFormData>({
    persona_id: 0,
    tipo_ayuda_id: 0,
    monto_estimado: 0,
    urgencia: 'Media',
    descripcion: '',
    fecha_esperada: ''
  });

  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [tipoAyudaSeleccionado, setTipoAyudaSeleccionado] = useState<TipoAyuda | null>(null);

  useEffect(() => {
    cargarTiposAyuda();
  }, []);

  const cargarTiposAyuda = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tipos-ayuda');
      const data = await response.json();
      if (data.success) {
        setTiposAyuda(data.data);
      } else {
        setMessage({type: 'error', text: 'Error cargando tipos de ayuda'});
      }
    } catch (error) {
      console.error('Error cargando tipos de ayuda:', error);
      setMessage({type: 'error', text: 'Error de conexión al cargar tipos de ayuda'});
    } finally {
      setLoading(false);
    }
  };

  const buscarPersonas = async (query: string) => {
    if (query.length < 2) {
      setResultadosBusqueda([]);
      setMostrarResultados(false);
      return;
    }

    setBuscando(true);
    try {
      const response = await fetch(`/api/personas/buscar?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.success) {
        setResultadosBusqueda(data.data);
        setMostrarResultados(true);
      } else {
        setMessage({type: 'error', text: 'Error en la búsqueda'});
      }
    } catch (error) {
      console.error('Error buscando personas:', error);
      setMessage({type: 'error', text: 'Error de conexión en la búsqueda'});
    } finally {
      setBuscando(false);
    }
  };

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBusqueda(valor);
    buscarPersonas(valor);
  };

  const seleccionarPersona = (persona: Persona) => {
    setPersonaSeleccionada(persona);
    setSolicitudData(prev => ({ ...prev, persona_id: persona.id }));
    setBusqueda(persona.nombre_completo);
    setMostrarResultados(false);
    setMessage(null);
  };

  const quitarPersona = () => {
    setPersonaSeleccionada(null);
    setSolicitudData(prev => ({ ...prev, persona_id: 0 }));
    setBusqueda('');
    setMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSolicitudData(prev => ({
      ...prev,
      [name]: name === 'monto_estimado' || name === 'tipo_ayuda_id' || name === 'persona_id' 
        ? parseInt(value) || 0 
        : value
    }));

    if (name === 'tipo_ayuda_id') {
      const tipoSeleccionado = tiposAyuda.find(t => t.id === parseInt(value));
      setTipoAyudaSeleccionado(tipoSeleccionado || null);
      
      if (tipoSeleccionado && solicitudData.monto_estimado === 0) {
        const montoSugerido = Math.round((tipoSeleccionado.monto_minimo + tipoSeleccionado.monto_maximo) / 2);
        setSolicitudData(prev => ({ ...prev, monto_estimado: montoSugerido }));
      }
    }

    if (message) {
      setMessage(null);
    }
  };

  const getPrioridadInfo = (prioridad: string) => {
    const prioridades = {
      'high': { color: 'danger', texto: 'ALTA', icon: 'bi-exclamation-triangle-fill' },
      'medium': { color: 'warning', texto: 'MEDIA', icon: 'bi-dash-circle-fill' },
      'low': { color: 'success', texto: 'BAJA', icon: 'bi-check-circle-fill' }
    };
    return prioridades[prioridad as keyof typeof prioridades] || prioridades.medium;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personaSeleccionada) {
      setMessage({type: 'error', text: 'Debe seleccionar una persona beneficiaria'});
      return;
    }

    if (!solicitudData.tipo_ayuda_id) {
      setMessage({type: 'error', text: 'Debe seleccionar un tipo de ayuda'});
      return;
    }

    if (!solicitudData.monto_estimado || solicitudData.monto_estimado <= 0) {
      setMessage({type: 'error', text: 'Debe ingresar un monto estimado válido'});
      return;
    }

    if (!solicitudData.descripcion.trim()) {
      setMessage({type: 'error', text: 'Debe proporcionar una descripción detallada'});
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitudData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success', 
          text: `Solicitud enviada exitosamente. ID: ${data.data.id}`
        });
        
        // Limpiar formulario
        setSolicitudData({
          persona_id: 0,
          tipo_ayuda_id: 0,
          monto_estimado: 0,
          urgencia: 'Media',
          descripcion: '',
          fecha_esperada: ''
        });
        setPersonaSeleccionada(null);
        setBusqueda('');
        setTipoAyudaSeleccionado(null);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setMessage({type: 'error', text: data.error || 'Error al procesar solicitud'});
      }
    } catch (error) {
      console.error('Error enviando solicitud:', error);
      setMessage({type: 'error', text: 'Error de conexión. Intente nuevamente.'});
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 0
    }).format(monto);
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navigation activeSection="solicitudNueva" />
        <div className="container py-5">
          <div className="d-flex justify-content-center align-items-center" style={{minHeight: '60vh'}}>
            <div className="text-center">
              <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted fs-5">Cargando sistema de solicitudes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navigation activeSection="solicitudNueva" />

      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/Dashboard" className="text-decoration-none">
                <i className="bi bi-house-door me-1"></i>Dashboard
              </a>
            </li>
            <li className="breadcrumb-item active">Nueva Solicitud de Ayuda</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h1 className="display-6 fw-bold text-primary mb-2">
                  <i className="bi bi-file-earmark-plus me-2"></i>
                  Crear Nueva Solicitud de Ayuda
                </h1>
                <p className="lead text-muted">
                  Complete la información para generar la solicitud de ayuda para un beneficiario
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

        <form onSubmit={handleSubmit}>
          {/* Selección de beneficiario */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-person-check me-2"></i>Seleccionar Beneficiario
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <i className="bi bi-search me-1"></i>Buscar Persona *
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="🔍 Buscar por nombre o cédula de identidad"
                    value={busqueda}
                    onChange={handleBusquedaChange}
                    disabled={isSubmitting}
                  />
                  {buscando && (
                    <div className="position-absolute end-0 top-50 translate-middle-y pe-3">
                      <div className="spinner-border spinner-border-sm text-primary"></div>
                    </div>
                  )}
                  
                  {mostrarResultados && resultadosBusqueda.length > 0 && (
                    <div className="position-absolute w-100 bg-white border rounded shadow-lg mt-1" style={{zIndex: 1000, maxHeight: '300px', overflowY: 'auto'}}>
                      {resultadosBusqueda.map((persona) => {
                        const prioridadInfo = getPrioridadInfo(persona.nivel_prioridad);
                        return (
                          <div 
                            key={persona.id}
                            className="p-3 border-bottom cursor-pointer hover-bg-light"
                            onClick={() => seleccionarPersona(persona)}
                            style={{cursor: 'pointer'}}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <h6 className="mb-1 fw-semibold">{persona.nombre_completo}</h6>
                                <small className="text-muted d-block">
                                  Cédula: {persona.cedula} | Tel: {persona.telefono || 'No disponible'}
                                </small>
                                <small className="text-muted">
                                  {persona.municipio}, {persona.departamento}
                                </small>
                              </div>
                              <span className={`badge bg-${prioridadInfo.color} bg-opacity-25 text-${prioridadInfo.color}`}>
                                <i className={`${prioridadInfo.icon} me-1`}></i>
                                {prioridadInfo.texto}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {mostrarResultados && resultadosBusqueda.length === 0 && !buscando && busqueda.length >= 2 && (
                    <div className="position-absolute w-100 bg-white border rounded shadow-lg mt-1 p-4 text-center" style={{zIndex: 1000}}>
                      <i className="bi bi-search text-muted" style={{fontSize: '2rem'}}></i>
                      <p className="mb-1 mt-2">No se encontraron personas</p>
                      <small className="text-muted">Intente buscar por nombre completo o número de cédula</small>
                    </div>
                  )}
                </div>
              </div>

              {/* Persona seleccionada */}
              {personaSeleccionada && (
                <div className="alert alert-success border-0">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-25 rounded-circle p-2 me-3">
                      <i className="bi bi-person-check text-success" style={{fontSize: '1.5rem'}}></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="alert-heading mb-1">{personaSeleccionada.nombre_completo}</h6>
                      <p className="mb-1">
                        <strong>Cédula:</strong> {personaSeleccionada.cedula} | 
                        <strong> Tel:</strong> {personaSeleccionada.telefono || 'No disponible'}
                      </p>
                      <p className="mb-1">
                        <strong>Ubicación:</strong> {personaSeleccionada.municipio}, {personaSeleccionada.departamento}
                      </p>
                      <span className={`badge bg-${getPrioridadInfo(personaSeleccionada.nivel_prioridad).color}`}>
                        <i className={`${getPrioridadInfo(personaSeleccionada.nivel_prioridad).icon} me-1`}></i>
                        Prioridad: {getPrioridadInfo(personaSeleccionada.nivel_prioridad).texto}
                      </span>
                    </div>
                    <button 
                      type="button"
                      className="btn btn-outline-danger btn-sm" 
                      onClick={quitarPersona}
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-x-lg"></i> Quitar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detalles de la solicitud */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-clipboard-data me-2"></i>Detalles de la Solicitud
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-tags me-1"></i>Tipo de Ayuda *
                  </label>
                  <select 
                    name="tipo_ayuda_id"
                    className="form-select form-select-lg"
                    value={solicitudData.tipo_ayuda_id}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Seleccione el tipo de ayuda necesaria...</option>
                    {tiposAyuda.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre} ({formatearMoneda(tipo.monto_minimo)} - {formatearMoneda(tipo.monto_maximo)})
                      </option>
                    ))}
                  </select>
                  {tipoAyudaSeleccionado && (
                    <div className="form-text">{tipoAyudaSeleccionado.descripcion}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-exclamation-triangle me-1"></i>Nivel de Urgencia *
                  </label>
                  <select 
                    name="urgencia"
                    className="form-select form-select-lg"
                    value={solicitudData.urgencia}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="Alta">🔴 Alta - Caso urgente</option>
                    <option value="Media">🟡 Media - Caso normal</option>
                    <option value="Baja">🟢 Baja - Caso rutinario</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-currency-dollar me-1"></i>Monto Estimado *
                  </label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text">L</span>
                    <input 
                      type="number" 
                      name="monto_estimado"
                      className="form-control" 
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={solicitudData.monto_estimado || ''}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  {tipoAyudaSeleccionado && (
                    <div className="form-text">
                      Rango permitido: {formatearMoneda(tipoAyudaSeleccionado.monto_minimo)} - {formatearMoneda(tipoAyudaSeleccionado.monto_maximo)}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-calendar-event me-1"></i>Fecha Esperada de Entrega
                  </label>
                  <input 
                    type="date" 
                    name="fecha_esperada"
                    className="form-control form-control-lg"
                    value={solicitudData.fecha_esperada}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isSubmitting}
                  />
                  <div className="form-text">Fecha en que se necesita la ayuda (opcional)</div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-card-text me-1"></i>Descripción Detallada de la Necesidad *
                  </label>
                  <textarea
                    name="descripcion"
                    className="form-control"
                    placeholder="Describa detalladamente la situación específica, la necesidad de ayuda, circunstancias especiales, y cualquier información relevante que ayude a evaluar la solicitud..."
                    rows={4}
                    value={solicitudData.descripcion}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                  <div className="form-text">
                    Caracteres: {solicitudData.descripcion.length} (mínimo 10)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap gap-3 justify-content-center align-items-center">
                <button 
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting || !personaSeleccionada}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>Enviar Solicitud
                    </>
                  )}
                </button>
                
                <a href="/Dashboard" className="btn btn-secondary btn-lg">
                  <i className="bi bi-x-lg me-2"></i>Cancelar
                </a>

                <div className="ms-auto">
                  {personaSeleccionada ? (
                    <span className="badge bg-success fs-6">
                      <i className="bi bi-check-circle me-1"></i>Listo para enviar
                    </span>
                  ) : (
                    <span className="badge bg-warning fs-6">
                      <i className="bi bi-clock me-1"></i>Seleccione beneficiario
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}