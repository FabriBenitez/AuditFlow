import { NextRequest, NextResponse } from 'next/server';
import { generateAuditReportWithGemini, AuditInput } from '@/lib/gemini';

export const maxDuration = 60; // Permitir hasta 60s si es necesario

export async function POST(req: NextRequest) {
  try {
    const body: AuditInput = await req.json();

    const ig = (body.igUsername || '').trim();
    const tt = (body.ttUsername || '').trim();

    if (!ig && !tt) {
      return NextResponse.json(
        { error: 'Debes ingresar al menos un usuario de Instagram o TikTok.' },
        { status: 400 }
      );
    }

    const report = await generateAuditReportWithGemini(body);

    return NextResponse.json(report, { status: 200 });
  } catch (error: unknown) {
    console.error('Error en /api/audit/generate:', error);
    const message = error instanceof Error ? error.message : 'Error interno al auditar los perfiles con IA.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
