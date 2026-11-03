import { NextRequest, NextResponse } from 'next/server';
import { auditVideoCreativelyWithGemini } from '@/lib/gemini';
import { ResolvedVideo } from '@/types';

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  try {
    const { video, businessContext } = await req.json();

    if (!video || !video.id || !video.platform) {
      return NextResponse.json(
        { error: 'Datos de video inválidos para auditar.' },
        { status: 400 }
      );
    }

    const audit = await auditVideoCreativelyWithGemini(video as ResolvedVideo, businessContext);

    return NextResponse.json(audit, { status: 200 });
  } catch (error: unknown) {
    console.error('Error en /api/video/audit:', error);
    const message = error instanceof Error ? error.message : 'Error al auditar creativamente el video.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
