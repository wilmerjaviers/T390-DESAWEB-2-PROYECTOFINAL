import { NextRequest, NextResponse } from 'next/server';
import { getTiposAyuda } from '../../../db/database';

export async function GET(request: NextRequest) {
  try {
    const tiposAyuda = await getTiposAyuda();

    return NextResponse.json({
      success: true,
      data: tiposAyuda
    });

  } catch (error) {
    console.error('Error obteniendo tipos de ayuda:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}