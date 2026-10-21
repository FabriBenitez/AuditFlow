import { NextRequest, NextResponse } from 'next/server';
import { generateMicroClipsWithGemini } from '@/lib/gemini';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const clips = await generateMicroClipsWithGemini(body);
    return NextResponse.json(clips, { status: 200 });
  } catch (error: unknown) {
    console.error('Error en /api/studio/micro-clips:', error);
    const message = error instanceof Error ? error.message : 'Error al obtener plantillas de micro-clips.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const clips = await generateMicroClipsWithGemini({});
    return NextResponse.json(clips, { status: 200 });
  } catch (error: unknown) {
    console.error('Error en GET /api/studio/micro-clips:', error);
    return NextResponse.json({ error: 'Error al cargar micro-clips' }, { status: 500 });
  }
}
