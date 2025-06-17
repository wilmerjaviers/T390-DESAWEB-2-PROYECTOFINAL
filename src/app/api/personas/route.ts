import { NextRequest, NextResponse } from 'next/server';
import { getPersonas, crearPersona } from '../../../db/database';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filtros = {
      busqueda: searchParams.get('busqueda') || undefined,
      prioridad: searchParams.get('prioridad') || undefined,
      limite: searchParams.get('limite') ? parseInt(searchParams.get('limite')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    };

    const personas = await getPersonas(filtros);

    return NextResponse.json({
      success: true,
      data: personas
    });

  } catch (error) {
    console.error('Error obteniendo personas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const personaData = await request.json();

    if (!personaData.nombre_completo || !personaData.cedula || !personaData.fecha_nacimiento) {
      return NextResponse.json(
        { error: 'Campos requeridos: nombre_completo, cedula, fecha_nacimiento' },
        { status: 400 }
      );
    }

    const resultado = await crearPersona(personaData);

    // Si crearPersona devuelve un array, toma el primer elemento
    const insertId = Array.isArray(resultado) && resultado.length > 0 && resultado[0].insertId
      ? resultado[0].insertId
      : undefined;

    return NextResponse.json({
      success: true,
      data: { id: insertId },
      message: 'Persona registrada exitosamente'
    });

  } catch (error: any) {
    console.error('Error creando persona:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Ya existe una persona con esta cédula' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}