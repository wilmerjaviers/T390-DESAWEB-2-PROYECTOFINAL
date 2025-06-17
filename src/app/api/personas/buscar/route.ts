import { NextRequest, NextResponse } from 'next/server';
import { getPersonas } from '../../../../db/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    console.log('Búsqueda recibida:', query);

    // Validar que hay un término de búsqueda
    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Término de búsqueda muy corto'
      });
    }

    // Buscar personas con el término de búsqueda
    const personas = await getPersonas({
      busqueda: query.trim(),
      limite: 10 // Limitar a 10 resultados para la búsqueda
    });

    console.log('Resultados encontrados:', personas.length);

    return NextResponse.json({
      success: true,
      data: personas,
      count: personas.length
    });

  } catch (error) {
    console.error('Error buscando personas:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor al buscar personas',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}