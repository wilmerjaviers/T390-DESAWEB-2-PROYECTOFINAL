
import { NextRequest, NextResponse } from 'next/server';
import { getAyudasOtorgadas, crearAyudaOtorgada, actualizarEstadoSolicitud } from '../../../db/database';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filtros = {
      estado_entrega: searchParams.get('estado_entrega') || undefined,
      limite: searchParams.get('limite') ? parseInt(searchParams.get('limite')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    };

    const ayudas = await getAyudasOtorgadas(filtros);

    return NextResponse.json({
      success: true,
      data: ayudas
    });

  } catch (error) {
    console.error('Error obteniendo ayudas:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ayudaData = await request.json();

    if (!ayudaData.solicitud_id || !ayudaData.monto_otorgado || !ayudaData.fecha_otorgada) {
      return NextResponse.json(
        { error: 'Campos requeridos: solicitud_id, monto_otorgado, fecha_otorgada' },
        { status: 400 }
      );
    }

    // Crear la ayuda otorgada
    const resultado = await crearAyudaOtorgada(ayudaData);

    // Actualizar estado de la solicitud a "Aprobado"
    await actualizarEstadoSolicitud(
      ayudaData.solicitud_id,
      'Aprobado',
      'Ayuda otorgada'
    );

    return NextResponse.json({
      success: true,
      data: { id: resultado.insertId },
      message: 'Ayuda otorgada exitosamente'
    });

  } catch (error) {
    console.error('Error otorgando ayuda:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}