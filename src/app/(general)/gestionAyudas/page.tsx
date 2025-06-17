"use client";
import React, { useState, useEffect } from 'react';
import Navigation from "../../components/Navigation";


interface Solicitud {
  id: number;
  persona_id: number;
  nombre_completo: string;
  cedula: string;
  telefono: string;
  nivel_prioridad: string;
  tipo_ayuda_nombre: string;
  tipo_ayuda_desc: string;
  monto_estimado: number;
  urgencia: string;
  descripcion: string;
  fecha_esperada: string;
  estado: string;
  fecha_solicitud: string;
  observaciones?: string;
}

interface AyudaOtorgada {
  id: number;
  solicitud_id: number;
  nombre_completo: string;
  cedula: string;
  telefono: string;
  tipo_ayuda_nombre: string;
  monto_otorgado: number;
  fecha_otorgada: string;
  fecha_entrega: string;
  estado_entrega: string;
  notas: string;
  solicitud_desc: string;
  urgencia: string;
}

interface FormAyuda {
  solicitud_id: number;
  monto_otorgado: number;
  fecha_otorgada: string;
  fecha_entrega: string;
  notas: string;
}

export default function GestionAyudas() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [ayudasOtorgadas, setAyudasOtorgadas] = useState<AyudaOtorgada[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroUrgencia, setFiltroUrgencia] = useState('');
  const [vistaActiva, setVistaActiva] = useState<'solicitudes' | 'ayudas'>('solicitudes');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<Solicitud | null>(null);
  const [accion, setAccion] = useState<'aprobar' | 'rechazar' | 'ver'>('ver');
  const [procesando, setProcesando] = useState(false);
  const [formAyuda, setFormAyuda] = useState<FormAyuda>({
    solicitud_id: 0,
    monto_otorgado: 0,
    fecha_otorgada: new Date().toISOString().split('T')[0],
    fecha_entrega: '',
    notas: ''
  });

  useEffect(() => {
    cargarDatos();
  }, [filtroEstado, filtroUrgencia]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      await Promise.all([
        cargarSolicitudes(),
        cargarAyudasOtorgadas()
      ]);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setMessage({type: 'error', text: 'Error cargando datos del sistema'});
    } finally {
      setLoading(false);
    }
  };

  const cargarSolicitudes = async () => {
    try {
      const params = new URLSearchParams();
      if (filtroEstado) params.append('estado', filtroEstado);
      if (filtroUrgencia) params.append('urgencia', filtroUrgencia);
      params.append('limite', '50');

      const response = await fetch(`/api/solicitudes?${params}`);
      const data = await response.json();
      if (data.success) {
        setSolicitudes(data.data);
      }
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    }
  };

  const cargarAyudasOtorgadas = async () => {
    try {
      const response = await fetch('/api/ayudas?limite=50');
      const data = await response.json();
      if (data.success) {
        setAyudasOtorgadas(data.data);
      }
    } catch (error) {
      console.error('Error cargando ayudas:', error);
    }
  };

  const abrirModal = (solicitud: Solicitud, tipoAccion: 'aprobar' | 'rechazar' | 'ver') => {
    setSolicitudSeleccionada(solicitud);
    setAccion(tipoAccion);
    setModalAbierto(true);
    
    if (tipoAccion === 'aprobar') {
      setFormAyuda({
        solicitud_id: solicitud.id,
        monto_otorgado: solicitud.monto_estimado,
        fecha_otorgada: new Date().toISOString().split('T')[0],
        fecha_entrega: solicitud.fecha_esperada || '',
        notas: ''
      });
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setSolicitudSeleccionada(null);
  };

  const getPrioridadInfo = (prioridad: string) => {
    const prioridades = {
      'high': { color: 'danger', texto: 'ALTA', icon: 'bi-exclamation-triangle-fill' },
      'medium': { color: 'warning', texto: 'MEDIA', icon: 'bi-dash-circle-fill' },
      'low': { color: 'success', texto: 'BAJA', icon: 'bi-check-circle-fill' }
    };
    return prioridades[prioridad as keyof typeof prioridades] || prioridades.medium;
  };

  const getEstadoInfo = (estado: string) => {
    const estados = {
      'Pendiente': { color: 'warning', icon: 'bi-clock' },
      'En revisión': { color: 'info', icon: 'bi-eye' },
      'Aprobado': { color: 'success', icon: 'bi-check-circle' },
      'Rechazado': { color: 'danger', icon: 'bi-x-circle' },
      'Procesando': { color: 'primary', icon: 'bi-gear' }
    };
    return estados[estado as keyof typeof estados] || estados.Pendiente;
  };

  const getUrgenciaInfo = (urgencia: string) => {
    const urgencias = {
      'Alta': { color: 'danger', icon: 'bi-exclamation-triangle' },
      'Media': { color: 'warning', icon: 'bi-exclamation-circle' },
      'Baja': { color: 'success', icon: 'bi-check-circle' }
    };
    return urgencias[urgencia as keyof typeof urgencias] || urgencias.Media;
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-HN', {
      style: 'currency',
      currency: 'HNL',
      minimumFractionDigits: 0
    }).format(monto);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormAyuda(prev => ({
      ...prev,
      [name]: name === 'monto_otorgado' ? parseFloat(value) || 0 : value
    }));
  };

  const aprobarSolicitud = async () => {
    if (!solicitudSeleccionada) return;

    if (formAyuda.monto_otorgado <= 0) {
      setMessage({type: 'error', text: 'El monto otorgado debe ser mayor a 0'});
      return;
    }

    setProcesando(true);
    try {
      const response = await fetch('/api/ayudas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formAyuda),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success', 
          text: `Ayuda aprobada exitosamente para ${solicitudSeleccionada.nombre_completo}`
        });
        cerrarModal();
        await cargarDatos();
      } else {
        setMessage({type: 'error', text: data.error || 'Error al aprobar la ayuda'});
      }
    } catch (error) {
      console.error('Error aprobando solicitud:', error);
      setMessage({type: 'error', text: 'Error de conexión al aprobar la solicitud'});
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navigation activeSection="gestionAyudas" />
        <div className="container py-5">
          <div className="d-flex justify-content-center align-items-center" style={{minHeight: '60vh'}}>
            <div className="text-center">
              <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted fs-5">Cargando gestión de ayudas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navigation activeSection="gestionAyudas" />

      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/Dashboard" className="text-decoration-none">
                <i className="bi bi-house-door me-1"></i>Dashboard
              </a>
            </li>
            <li className="breadcrumb-item active">Gestión de Ayudas</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h1 className="display-6 fw-bold text-primary mb-2">
                  <i className="bi bi-hand-thumbs-up me-2"></i>
                  Gestión de Ayudas
                </h1>
                <p className="lead text-muted">
                  Administre solicitudes pendientes y ayudas otorgadas
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

        {/* Pestañas de navegación */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-transparent">
            <ul className="nav nav-pills card-header-pills">
              <li className="nav-item">
                <button 
                  className={`nav-link ${vistaActiva === 'solicitudes' ? 'active' : ''}`}
                  onClick={() => setVistaActiva('solicitudes')}
                >
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Solicitudes ({solicitudes.length})
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${vistaActiva === 'ayudas' ? 'active' : ''}`}
                  onClick={() => setVistaActiva('ayudas')}
                >
                  <i className="bi bi-hand-thumbs-up me-2"></i>
                  Ayudas Otorgadas ({ayudasOtorgadas.length})
                </button>
              </li>
            </ul>
          </div>

          {/* Filtros */}
          {vistaActiva === 'solicitudes' && (
            <div className="card-body border-top">
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Filtrar por Estado</label>
                  <select 
                    value={filtroEstado} 
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Todos los estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En revisión">En revisión</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Filtrar por Urgencia</label>
                  <select 
                    value={filtroUrgencia} 
                    onChange={(e) => setFiltroUrgencia(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Todas las urgencias</option>
                    <option value="Alta">🔴 Alta</option>
                    <option value="Media">🟡 Media</option>
                    <option value="Baja">🟢 Baja</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <button 
                    onClick={cargarDatos}
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>Actualizar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vista de Solicitudes */}
        {vistaActiva === 'solicitudes' && (
          <div className="row g-4">
            {solicitudes.length > 0 ? (
              solicitudes.map((solicitud) => {
                const prioridadInfo = getPrioridadInfo(solicitud.nivel_prioridad);
                const estadoInfo = getEstadoInfo(solicitud.estado);
                const urgenciaInfo = getUrgenciaInfo(solicitud.urgencia);

                return (
                  <div key={solicitud.id} className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-light d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="card-title mb-1 fw-bold">{solicitud.nombre_completo}</h6>
                          <small className="text-muted">Cédula: {solicitud.cedula}</small>
                        </div>
                        <span className={`badge bg-${prioridadInfo.color}`}>
                          <i className={`${prioridadInfo.icon} me-1`}></i>
                          {prioridadInfo.texto}
                        </span>
                      </div>

                      <div className="card-body">
                        <div className="row g-2 mb-3">
                          <div className="col-6">
                            <strong className="text-primary">{solicitud.tipo_ayuda_nombre}</strong>
                          </div>
                          <div className="col-6 text-end">
                            <strong className="text-success">{formatearMoneda(solicitud.monto_estimado)}</strong>
                          </div>
                        </div>

                        <div className="row g-2 text-sm mb-3">
                          <div className="col-6">
                            <span className="text-muted">Urgencia:</span>
                            <span className={`badge bg-${urgenciaInfo.color} bg-opacity-25 text-${urgenciaInfo.color} ms-1`}>
                              <i className={`${urgenciaInfo.icon} me-1`}></i>
                              {solicitud.urgencia}
                            </span>
                          </div>
                          <div className="col-6">
                            <span className="text-muted">Estado:</span>
                            <span className={`badge bg-${estadoInfo.color} bg-opacity-25 text-${estadoInfo.color} ms-1`}>
                              <i className={`${estadoInfo.icon} me-1`}></i>
                              {solicitud.estado}
                            </span>
                          </div>
                          <div className="col-12">
                            <span className="text-muted">Fecha:</span> {formatearFecha(solicitud.fecha_solicitud)}
                          </div>
                        </div>

                        <p className="card-text small text-muted">
                          {solicitud.descripcion.substring(0, 100)}
                          {solicitud.descripcion.length > 100 ? '...' : ''}
                        </p>
                      </div>

                      <div className="card-footer bg-transparent">
                        <div className="d-flex gap-2 flex-wrap">
                          <button 
                            onClick={() => abrirModal(solicitud, 'ver')}
                            className="btn btn-outline-info btn-sm"
                          >
                            <i className="bi bi-eye me-1"></i>Ver Detalles
                          </button>
                          
                          {(solicitud.estado === 'Pendiente' || solicitud.estado === 'En revisión') && (
                            <>
                              <button 
                                onClick={() => abrirModal(solicitud, 'aprobar')}
                                className="btn btn-success btn-sm"
                              >
                                <i className="bi bi-check-circle me-1"></i>Aprobar
                              </button>
                              <button 
                                onClick={() => abrirModal(solicitud, 'rechazar')}
                                className="btn btn-outline-danger btn-sm"
                              >
                                <i className="bi bi-x-circle me-1"></i>Rechazar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center py-5">
                    <i className="bi bi-inbox text-muted" style={{fontSize: '3rem'}}></i>
                    <p className="text-muted mt-3">No hay solicitudes con los filtros seleccionados</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vista de Ayudas Otorgadas */}
        {vistaActiva === 'ayudas' && (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Beneficiario</th>
                      <th>Tipo de Ayuda</th>
                      <th>Monto Otorgado</th>
                      <th>Fecha Otorgada</th>
                      <th>Fecha Entrega</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ayudasOtorgadas.length > 0 ? (
                      ayudasOtorgadas.map((ayuda) => (
                        <tr key={ayuda.id}>
                          <td>
                            <div>
                              <strong>{ayuda.nombre_completo}</strong>
                              <br />
                              <small className="text-muted">{ayuda.cedula}</small>
                            </div>
                          </td>
                          <td>{ayuda.tipo_ayuda_nombre}</td>
                          <td>
                            <strong className="text-success">{formatearMoneda(ayuda.monto_otorgado)}</strong>
                          </td>
                          <td>{formatearFecha(ayuda.fecha_otorgada)}</td>
                          <td>{ayuda.fecha_entrega ? formatearFecha(ayuda.fecha_entrega) : 'Sin fecha'}</td>
                          <td>
                            <span className={`badge ${
                              ayuda.estado_entrega === 'Entregada' ? 'bg-success' :
                              ayuda.estado_entrega === 'Programada' ? 'bg-warning' : 'bg-secondary'
                            }`}>
                              {ayuda.estado_entrega}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted">
                          No hay ayudas otorgadas registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {modalAbierto && solicitudSeleccionada && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {accion === 'aprobar' && <><i className="bi bi-check-circle me-2"></i>Aprobar Solicitud</>}
                    {accion === 'rechazar' && <><i className="bi bi-x-circle me-2"></i>Rechazar Solicitud</>}
                    {accion === 'ver' && <><i className="bi bi-eye me-2"></i>Detalles de Solicitud</>}
                  </h5>
                  <button type="button" className="btn-close" onClick={cerrarModal}></button>
                </div>

                <div className="modal-body">
                  {/* Información del beneficiario */}
                  <div className="card mb-3">
                    <div className="card-header bg-primary text-white">
                      <h6 className="mb-0"><i className="bi bi-person me-2"></i>Beneficiario</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-2">
                        <div className="col-md-6"><strong>Nombre:</strong> {solicitudSeleccionada.nombre_completo}</div>
                        <div className="col-md-6"><strong>Cédula:</strong> {solicitudSeleccionada.cedula}</div>
                        <div className="col-md-6"><strong>Teléfono:</strong> {solicitudSeleccionada.telefono || 'No disponible'}</div>
                        <div className="col-md-6">
                          <strong>Prioridad:</strong> 
                          <span className={`badge bg-${getPrioridadInfo(solicitudSeleccionada.nivel_prioridad).color} ms-1`}>
                            {getPrioridadInfo(solicitudSeleccionada.nivel_prioridad).texto}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de la solicitud */}
                  <div className="card mb-3">
                    <div className="card-header bg-info text-white">
                      <h6 className="mb-0"><i className="bi bi-clipboard-data me-2"></i>Solicitud</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-2 mb-3">
                        <div className="col-md-6"><strong>Tipo de Ayuda:</strong> {solicitudSeleccionada.tipo_ayuda_nombre}</div>
                        <div className="col-md-6"><strong>Monto Solicitado:</strong> {formatearMoneda(solicitudSeleccionada.monto_estimado)}</div>
                        <div className="col-md-6">
                          <strong>Urgencia:</strong> 
                          <span className={`badge bg-${getUrgenciaInfo(solicitudSeleccionada.urgencia).color} bg-opacity-25 text-${getUrgenciaInfo(solicitudSeleccionada.urgencia).color} ms-1`}>
                            {solicitudSeleccionada.urgencia}
                          </span>
                        </div>
                        <div className="col-md-6">
                          <strong>Estado:</strong> 
                          <span className={`badge bg-${getEstadoInfo(solicitudSeleccionada.estado).color} bg-opacity-25 text-${getEstadoInfo(solicitudSeleccionada.estado).color} ms-1`}>
                            {solicitudSeleccionada.estado}
                          </span>
                        </div>
                        <div className="col-md-6"><strong>Fecha Solicitud:</strong> {formatearFecha(solicitudSeleccionada.fecha_solicitud)}</div>
                        {solicitudSeleccionada.fecha_esperada && (
                          <div className="col-md-6"><strong>Fecha Esperada:</strong> {formatearFecha(solicitudSeleccionada.fecha_esperada)}</div>
                        )}
                      </div>
                      <div>
                        <strong>Descripción:</strong>
                        <p className="mt-2">{solicitudSeleccionada.descripcion}</p>
                      </div>
                    </div>
                  </div>

                  {/* Formulario de aprobación */}
                  {accion === 'aprobar' && (
                    <div className="card">
                      <div className="card-header bg-success text-white">
                        <h6 className="mb-0"><i className="bi bi-cash-coin me-2"></i>Datos de la Ayuda</h6>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Monto a Otorgar *</label>
                            <div className="input-group">
                              <span className="input-group-text">L</span>
                              <input
                                type="number"
                                name="monto_otorgado"
                                value={formAyuda.monto_otorgado}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                                className="form-control"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Fecha de Otorgamiento *</label>
                            <input
                              type="date"
                              name="fecha_otorgada"
                              value={formAyuda.fecha_otorgada}
                              onChange={handleInputChange}
                              className="form-control"
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Fecha de Entrega</label>
                            <input
                              type="date"
                              name="fecha_entrega"
                              value={formAyuda.fecha_entrega}
                              onChange={handleInputChange}
                              className="form-control"
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label">Notas Adicionales</label>
                            <textarea
                              name="notas"
                              value={formAyuda.notas}
                              onChange={handleInputChange}
                              className="form-control"
                              rows={3}
                              placeholder="Observaciones, instrucciones especiales, etc."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Formulario de rechazo */}
                  {accion === 'rechazar' && (
                    <div className="card">
                      <div className="card-header bg-danger text-white">
                        <h6 className="mb-0"><i className="bi bi-chat-text me-2"></i>Motivo del Rechazo</h6>
                      </div>
                      <div className="card-body">
                        <textarea
                          id="observaciones-rechazo"
                          className="form-control"
                          rows={4}
                          placeholder="Explique el motivo del rechazo de la solicitud..."
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  {accion === 'aprobar' && (
                    <>
                      <button 
                        onClick={aprobarSolicitud}
                        className="btn btn-success"
                        disabled={procesando}
                      >
                        {procesando ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Procesando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>Aprobar Ayuda
                          </>
                        )}
                      </button>
                      <button onClick={cerrarModal} className="btn btn-secondary">
                        Cancelar
                      </button>
                    </>
                  )}

                  {accion === 'rechazar' && (
                    <>
                      <button 
                        onClick={() => {
                          const observaciones = (document.getElementById('observaciones-rechazo') as HTMLTextAreaElement)?.value;
                          if (observaciones.trim()) {
                            // rechazarSolicitud(observaciones); // Implementar esta función
                            console.log('Rechazar con observaciones:', observaciones);
                          } else {
                            setMessage({type: 'error', text: 'Debe proporcionar un motivo para el rechazo'});
                          }
                        }}
                        className="btn btn-danger"
                        disabled={procesando}
                      >
                        {procesando ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Procesando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-x-circle me-2"></i>Confirmar Rechazo
                          </>
                        )}
                      </button>
                      <button onClick={cerrarModal} className="btn btn-secondary">
                        Cancelar
                      </button>
                    </>
                  )}

                  {accion === 'ver' && (
                    <button onClick={cerrarModal} className="btn btn-primary">
                      Cerrar
                    </button>
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