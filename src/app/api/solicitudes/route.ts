import { NextRequest, NextResponse } from 'next/server';
import { getSolicitudes, crearSolicitud, actualizarEstadoSolicitud } from '../../../db/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filtros = {
      estado: searchParams.get('estado') || undefined,
      urgencia: searchParams.get('urgencia') || undefined,
      tipo_ayuda: searchParams.get('tipo_ayuda') || undefined,
      limite: searchParams.get('limite') ? parseInt(searchParams.get('limite')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    };

    const solicitudes = await getSolicitudes(filtros);

    return NextResponse.json({
      success: true,
      data: solicitudes
    });

  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const solicitudData = await request.json();

    if (!solicitudData.persona_id || !solicitudData.tipo_ayuda_id || !solicitudData.monto_estimado || !solicitudData.descripcion) {
      return NextResponse.json(
        { error: 'Campos requeridos: persona_id, tipo_ayuda_id, monto_estimado, descripcion' },
        { status: 400 }
      );
    }

    const resultado = await crearSolicitud(solicitudData);

    return NextResponse.json({
      success: true,
      data: { id: resultado[0]?.insertId },
      message: 'Solicitud creada exitosamente'
    });

  } catch (error) {
    console.error('Error creando solicitud:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// NUEVO: Método PUT para actualizar estado de solicitudes
export async function PUT(request: NextRequest) {
  try {
    const updateData = await request.json();

    if (!updateData.id || !updateData.estado) {
      return NextResponse.json(
        { error: 'Campos requeridos: id, estado' },
        { status: 400 }
      );
    }

    const resultado = await actualizarEstadoSolicitud(
      updateData.id,
      updateData.estado,
      updateData.observaciones
    );

    return NextResponse.json({
      success: true,
      data: resultado,
      message: 'Estado de solicitud actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando solicitud:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}