import { NextRequest, NextResponse } from 'next/server';
import { generateFourPillarsPlanWithGemini } from '@/lib/gemini';
import { ProductInput } from '@/types';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body: ProductInput = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: 'El nombre del producto, servicio o negocio es requerido.' },
        { status: 400 }
      );
    }

    const plan = await generateFourPillarsPlanWithGemini(body);
    return NextResponse.json(plan, { status: 200 });
  } catch (error: unknown) {
    console.error('Error en /api/studio/pillars:', error);
    const message = error instanceof Error ? error.message : 'Error interno al generar el plan de los 4 pilares.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
