import { NextRequest, NextResponse } from 'next/server';
import { generateShootingKitWithGemini } from '@/lib/gemini';
import { ProductInput } from '@/types';

export const maxDuration = 60; // Permitir hasta 60s si es necesario

export async function POST(req: NextRequest) {
  try {
    const body: ProductInput = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: 'El nombre del producto o servicio es requerido.' },
        { status: 400 }
      );
    }

    const kit = await generateShootingKitWithGemini(body);

    return NextResponse.json(kit, { status: 200 });
  } catch (error: unknown) {
    console.error('Error en /api/studio/generate:', error);
    const message = error instanceof Error ? error.message : 'Error interno al generar la guía de rodaje con Gemini.';
    return NextResponse.json(
      { 
        error: message,
      },
      { status: 500 }
    );
  }
}
