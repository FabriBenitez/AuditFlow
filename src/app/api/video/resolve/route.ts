import { NextRequest, NextResponse } from 'next/server';
import { resolveVideo } from '@/lib/videoResolver';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Debes proporcionar una URL válida de TikTok o Instagram.' },
        { status: 400 }
      );
    }

    const cleanUrl = url.trim();
    const video = await resolveVideo(cleanUrl);

    return NextResponse.json(video, { status: 200 });
  } catch (error: unknown) {
    console.error('Error en /api/video/resolve:', error);
    const message = error instanceof Error ? error.message : 'Error al resolver el video.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
