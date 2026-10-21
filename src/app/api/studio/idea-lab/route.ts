import { NextRequest, NextResponse } from 'next/server';
import { refineIdeaWithGemini } from '@/lib/gemini';
import { RawIdeaInput } from '@/types';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body: RawIdeaInput = await req.json();

    if (!body.rawThought || !body.rawThought.trim()) {
      return NextResponse.json(
        { error: 'Por favor ingresa tu idea o frase en el campo de texto.' },
        { status: 400 }
      );
    }

    const refined = await refineIdeaWithGemini(body);
    return NextResponse.json(refined, { status: 200 });
  } catch (error: unknown) {
    console.error('Error en /api/studio/idea-lab:', error);
    const message = error instanceof Error ? error.message : 'Error interno al procesar la idea en el laboratorio.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
