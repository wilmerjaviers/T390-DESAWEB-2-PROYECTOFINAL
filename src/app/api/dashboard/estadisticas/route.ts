import { NextRequest, NextResponse } from 'next/server';
import { getEstadisticasDashboard, getActividadesRecientes } from '../../../../db/database';


export async function GET(request: NextRequest) {
  try {
    const estadisticas = await getEstadisticasDashboard();
    const actividades = await getActividadesRecientes();

    return NextResponse.json({
      success: true,
      data: {
        estadisticas,
        actividades
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas dashboard:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}