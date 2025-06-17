import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Copo.2012',
  database: process.env.DB_NAME || 'anadish_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  charset: 'utf8mb4'
};

let pool: mysql.Pool | null = null;

export function getDbConnection(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      idleTimeout: 300000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }
  return pool;
}


export async function executeQuery<T = any>(
  query: string, 
  params?: any[]
): Promise<T[]> {
  try {
    const connection = getDbConnection();
    
  
    const [results] = await connection.query(query, params || []);
    return results as T[];
  } catch (error) {
    console.error('Error ejecutando query:', error);
    throw new Error(`Error en base de datos: ${error}`);
  }
}

export async function executeQuerySingle<T = any>(
  query: string, 
  params?: any[]
): Promise<T | null> {
  const results = await executeQuery<T>(query, params);
  return results.length > 0 ? results[0] : null;
}

// PERSONAS
export async function getPersonas(filtros?: {
  busqueda?: string;
  prioridad?: string;
  limite?: number;
  offset?: number;
}) {
  try {
    let query = `
      SELECT p.*
      FROM personas p
      WHERE p.estado = 'activo'
    `;
    const params: any[] = [];

    // Agregar filtro de búsqueda si existe
    if (filtros?.busqueda && filtros.busqueda.trim() !== '') {
      query += ` AND (p.nombre_completo LIKE ? OR p.cedula LIKE ?)`;
      const busqueda = `%${filtros.busqueda.trim()}%`;
      params.push(busqueda, busqueda);
    }

    // Agregar filtro de prioridad si existe
    if (filtros?.prioridad && filtros.prioridad.trim() !== '') {
      query += ` AND p.nivel_prioridad = ?`;
      params.push(filtros.prioridad);
    }

    // Ordenamiento
    query += ` ORDER BY 
      CASE p.nivel_prioridad 
        WHEN 'high' THEN 1 
        WHEN 'medium' THEN 2 
        WHEN 'low' THEN 3 
        ELSE 4
      END,
      p.fecha_registro DESC
    `;

    // Agregar LIMIT si se especifica
    if (filtros?.limite && filtros.limite > 0) {
      query += ` LIMIT ${filtros.limite}`;
      
      if (filtros?.offset && filtros.offset > 0) {
        query += ` OFFSET ${filtros.offset}`;
      }
    }

    console.log('Query ejecutada:', query);
    console.log('Parámetros:', params);

    return executeQuery(query, params);
  } catch (error) {
    console.error('Error en getPersonas:', error);
    return [];
  }
}

export async function crearPersona(persona: {
  nombre_completo: string;
  cedula: string;
  genero: string;
  estado_civil?: string;
  fecha_nacimiento: string;
  telefono?: string;
  email?: string;
  departamento: string;
  municipio: string;
  direccion_completa: string;
  nivel_prioridad: string;
}) {
  const query = `
    INSERT INTO personas 
    (nombre_completo, cedula, genero, estado_civil, fecha_nacimiento, 
     telefono, email, departamento, municipio, direccion_completa, 
     nivel_prioridad, usuario_registro)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `;
  
  const params = [
    persona.nombre_completo,
    persona.cedula,
    persona.genero,
    persona.estado_civil || null,
    persona.fecha_nacimiento,
    persona.telefono || null,
    persona.email || null,
    persona.departamento,
    persona.municipio,
    persona.direccion_completa,
    persona.nivel_prioridad
  ];

  return executeQuery(query, params);
}

// SOLICITUDES
export async function getSolicitudes(filtros?: {
  estado?: string;
  urgencia?: string;
  tipo_ayuda?: string;
  limite?: number;
  offset?: number;
}) {
  try {
    let query = `
      SELECT s.*, p.nombre_completo, p.cedula, p.telefono, p.nivel_prioridad,
             ta.nombre as tipo_ayuda_nombre, ta.descripcion as tipo_ayuda_desc
      FROM solicitudes s
      INNER JOIN personas p ON s.persona_id = p.id
      INNER JOIN tipos_ayuda ta ON s.tipo_ayuda_id = ta.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filtros?.estado && filtros.estado.trim() !== '') {
      query += ` AND s.estado = ?`;
      params.push(filtros.estado);
    }

    if (filtros?.urgencia && filtros.urgencia.trim() !== '') {
      query += ` AND s.urgencia = ?`;
      params.push(filtros.urgencia);
    }

    if (filtros?.tipo_ayuda && filtros.tipo_ayuda.trim() !== '') {
      query += ` AND ta.nombre = ?`;
      params.push(filtros.tipo_ayuda);
    }

    query += ` ORDER BY 
      CASE s.urgencia 
        WHEN 'Alta' THEN 1 
        WHEN 'Media' THEN 2 
        WHEN 'Baja' THEN 3 
        ELSE 4
      END,
      s.fecha_solicitud DESC
    `;

    if (filtros?.limite && filtros.limite > 0) {
      query += ` LIMIT ${filtros.limite}`;
      
      if (filtros?.offset && filtros.offset > 0) {
        query += ` OFFSET ${filtros.offset}`;
      }
    }

    return executeQuery(query, params);
  } catch (error) {
    console.error('Error en getSolicitudes:', error);
    return [];
  }
}

export async function crearSolicitud(solicitud: {
  persona_id: number;
  tipo_ayuda_id: number;
  monto_estimado: number;
  urgencia: string;
  descripcion: string;
  fecha_esperada?: string;
}) {
  const query = `
    INSERT INTO solicitudes 
    (persona_id, tipo_ayuda_id, monto_estimado, urgencia, descripcion, 
     fecha_esperada, usuario_solicita)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `;
  
  const params = [
    solicitud.persona_id,
    solicitud.tipo_ayuda_id,
    solicitud.monto_estimado,
    solicitud.urgencia,
    solicitud.descripcion,
    solicitud.fecha_esperada || null
  ];

  return executeQuery(query, params);
}

export async function actualizarEstadoSolicitud(
  solicitudId: number, 
  nuevoEstado: string, 
  observaciones?: string
) {
  const query = `
    UPDATE solicitudes 
    SET estado = ?, observaciones = ?, fecha_actualizacion = NOW()
    WHERE id = ?
  `;
  
  return executeQuery(query, [nuevoEstado, observaciones || null, solicitudId]);
}

// AYUDAS OTORGADAS
export async function getAyudasOtorgadas(filtros?: {
  estado_entrega?: string;
  limite?: number;
  offset?: number;
}) {
  try {
    let query = `
      SELECT ao.*, s.descripcion as solicitud_desc, s.urgencia,
             p.nombre_completo, p.cedula, p.telefono,
             ta.nombre as tipo_ayuda_nombre
      FROM ayudas_otorgadas ao
      INNER JOIN solicitudes s ON ao.solicitud_id = s.id
      INNER JOIN personas p ON s.persona_id = p.id
      INNER JOIN tipos_ayuda ta ON s.tipo_ayuda_id = ta.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filtros?.estado_entrega && filtros.estado_entrega.trim() !== '') {
      query += ` AND ao.estado_entrega = ?`;
      params.push(filtros.estado_entrega);
    }

    query += ` ORDER BY ao.fecha_otorgada DESC`;

    if (filtros?.limite && filtros.limite > 0) {
      query += ` LIMIT ${filtros.limite}`;
      
      if (filtros?.offset && filtros.offset > 0) {
        query += ` OFFSET ${filtros.offset}`;
      }
    }

    return executeQuery(query, params);
  } catch (error) {
    console.error('Error en getAyudasOtorgadas:', error);
    return [];
  }
}

export async function crearAyudaOtorgada(ayuda: {
  solicitud_id: number;
  monto_otorgado: number;
  fecha_otorgada: string;
  fecha_entrega?: string;
  notas?: string;
}) {
  const query = `
    INSERT INTO ayudas_otorgadas 
    (solicitud_id, monto_otorgado, fecha_otorgada, fecha_entrega, notas, usuario_autoriza)
    VALUES (?, ?, ?, ?, ?, 1)
  `;
  
  const params = [
    ayuda.solicitud_id,
    ayuda.monto_otorgado,
    ayuda.fecha_otorgada,
    ayuda.fecha_entrega || null,
    ayuda.notas || null
  ];

  return executeQuery(query, params);
}

// TIPOS DE AYUDA
export async function getTiposAyuda() {
  try {
    return executeQuery(`
      SELECT * FROM tipos_ayuda 
      WHERE activo = true 
      ORDER BY nombre
    `);
  } catch (error) {
    console.error('Error en getTiposAyuda:', error);
    return [];
  }
}

// ESTADÍSTICAS PARA DASHBOARD
export async function getEstadisticasDashboard() {
  try {
    const queries = {
      totalPersonas: `
        SELECT COUNT(*) as total, 
               COUNT(CASE WHEN DATE(fecha_registro) >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 END) as nuevas_mes
        FROM personas WHERE estado = 'activo'
      `,
      solicitudesPendientes: `
        SELECT COUNT(*) as total,
               COUNT(CASE WHEN urgencia = 'Alta' THEN 1 END) as urgentes
        FROM solicitudes WHERE estado IN ('Pendiente', 'En revisión')
      `,
      ayudasMes: `
        SELECT COUNT(*) as total,
               COALESCE(SUM(monto_otorgado), 0) as monto_total
        FROM ayudas_otorgadas 
        WHERE DATE(fecha_otorgada) >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
      `,
      presupuestoUsado: `
        SELECT COALESCE(SUM(CASE WHEN DATE(fecha_otorgada) >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN monto_otorgado ELSE 0 END), 0) as usado_mes
        FROM ayudas_otorgadas
      `
    };

    const [personas, solicitudes, ayudas, presupuesto] = await Promise.all([
      executeQuerySingle(queries.totalPersonas),
      executeQuerySingle(queries.solicitudesPendientes),
      executeQuerySingle(queries.ayudasMes),
      executeQuerySingle(queries.presupuestoUsado)
    ]);

    return { personas, solicitudes, ayudas, presupuesto };
  } catch (error) {
    console.error('Error en getEstadisticasDashboard:', error);
    return {
      personas: { total: 0, nuevas_mes: 0 },
      solicitudes: { total: 0, urgentes: 0 },
      ayudas: { total: 0, monto_total: 0 },
      presupuesto: { usado_mes: 0 }
    };
  }
}

// ACTIVIDADES RECIENTES
export async function getActividadesRecientes() {
  try {
    return executeQuery(`
      SELECT 'registro_persona' as tipo_actividad, 
             CONCAT('Nueva persona: ', nombre_completo) as descripcion,
             fecha_registro as fecha_actividad,
             'Sistema' as usuario_nombre
      FROM personas 
      WHERE estado = 'activo'
      ORDER BY fecha_registro DESC
      LIMIT 5
    `);
  } catch (error) {
    console.error('Error en getActividadesRecientes:', error);
    return [];
  }
}