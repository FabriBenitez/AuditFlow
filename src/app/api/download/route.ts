import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'AuditFlow_Documento_Maestro.docx');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="AuditFlow_Documento_Maestro_Estrategia_y_Arquitectura.docx"',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (err: unknown) {
    console.error('Error al descargar archivo:', err);
    return NextResponse.json({ error: 'Error interno al servir el archivo' }, { status: 500 });
  }
}
