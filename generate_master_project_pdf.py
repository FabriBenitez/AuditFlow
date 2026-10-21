import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable, PageBreak
)
from reportlab.pdfgen import canvas

DESKTOP_DIR = r"C:\Users\Compumax\OneDrive\Escritorio"
PROJECT_DIR = r"C:\Fabri\Proyectos\auditflow"
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")

OUTPUT_DESKTOP = os.path.join(DESKTOP_DIR, "AuditFlow_Documento_Maestro_Proyecto_Completo.pdf")
OUTPUT_PROJECT = os.path.join(PROJECT_DIR, "AuditFlow_Documento_Maestro_Proyecto_Completo.pdf")
OUTPUT_PUBLIC = os.path.join(PUBLIC_DIR, "AuditFlow_Documento_Maestro_Proyecto_Completo.pdf")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor('#64748B'))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(36, 11 * inch - 25, "AUDITFLOW — Documento Maestro de Arquitectura, IA y Especificación")
            self.setStrokeColor(colors.HexColor('#CBD5E1'))
            self.setLineWidth(0.5)
            self.line(36, 11 * inch - 28, 8.5 * inch - 36, 11 * inch - 28)
            
        # Footer
        footer_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(8.5 * inch - 36, 20, footer_text)
        self.drawString(36, 20, "Confidencial & Estratégico — AuditFlow Core Team © 2026")
        self.setStrokeColor(colors.HexColor('#CBD5E1'))
        self.setLineWidth(0.5)
        self.line(36, 30, 8.5 * inch - 36, 30)
        
        self.restoreState()

def build_pdf(filepath):
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#3730A3'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#475569'),
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#4338CA'),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    meta_label = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=10.5,
        textColor=colors.HexColor('#64748B')
    )
    
    meta_val = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor('#0F172A')
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155'),
        leftIndent=12,
        spaceAfter=3
    )

    th_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )
    
    td_bold = ParagraphStyle(
        'TDBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.5,
        textColor=colors.HexColor('#0F172A')
    )
    
    td_norm = ParagraphStyle(
        'TDNorm',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.6,
        leading=10.5,
        textColor=colors.HexColor('#334155')
    )

    story = []

    # =========================================================================
    # PORTADA Y ENCABEZADO PRINCIPAL
    # =========================================================================
    story.append(Paragraph("AUDITFLOW", title_style))
    story.append(Paragraph("Director Creativo de Contenido & Auditor de Retención para Redes Sociales", ParagraphStyle('SubSub', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=12, leading=15, textColor=colors.HexColor('#1E293B'))))
    story.append(Paragraph("Plan Maestro de Arquitectura, IA Multimodal, Historias de Usuario, Casos de Uso y Benchmark Competitivo", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#4F46E5'), spaceBefore=0, spaceAfter=8))

    meta_data = [
        [
            Paragraph("VERSIÓN", meta_label),
            Paragraph("ESTADO", meta_label),
            Paragraph("ALCANCE DEL PROYECTO", meta_label),
            Paragraph("FECHA DE PUBLICACIÓN", meta_label)
        ],
        [
            Paragraph("1.2 - Especificación Oficial", meta_val),
            Paragraph("Validado & En Ejecución", meta_val),
            Paragraph("Full Stack MVP + Benchmark", meta_val),
            Paragraph("Octubre 2026", meta_val)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[1.8*inch, 1.8*inch, 2.3*inch, 1.6*inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECCIÓN 1: RESUMEN EJECUTIVO Y PROPUESTA DE VALOR
    # =========================================================================
    story.append(Paragraph("1. Resumen Ejecutivo y Propuesta de Valor", h1_style))
    exec_text = (
        "<b>AuditFlow</b> es una plataforma integral de inteligencia artificial diseñada para creadores de contenido UGC, "
        "marcas de comercio electrónico y agencias de marketing digital. Su misión primordial es resolver el mayor dolor del "
        "contenido orgánico y publicitario en TikTok e Instagram Reels: <b>la falta de retención en los primeros segundos "
        "(0 a 3s)</b> y el <b>bloqueo creativo al momento de grabar productos físicos o servicios</b>.<br/><br/>"
        "A diferencia de los asistentes de texto convencionales (que solo redactan copys genéricos) o las herramientas de video sintético "
        "(que generan avatares falsos repudiados por las audiencias), AuditFlow opera como un <b>Director Creativo de Rodaje</b>. "
        "Analiza las características visuales del producto real mediante visión por computadora (Gemini Vision) y prescribe una "
        "<b>Guía Maestra de Rodaje</b> con reglas obligatorias: qué ángulos filmar con el smartphone, cómo iluminar con luz de ventana a 45°, "
        "qué ganchos de 0 a 3 segundos utilizar y qué ritmo de edición aplicar."
    )
    box_exec = Table([[Paragraph(exec_text, body_style)]], colWidths=[7.5*inch])
    box_exec.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#94A3B8')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(box_exec)
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECCIÓN 2: MATRIZ DE ALCANCES Y LÍMITES (SCOPE MATRIX)
    # =========================================================================
    story.append(Paragraph("2. Matriz de Alcances y Límites (Scope Matrix)", h1_style))
    story.append(Paragraph("A. Lo que SÍ Incluye el Sistema (In-Scope):", h2_style))
    story.append(Paragraph("• <b>Studio Engine Multimodal:</b> Carga de imágenes de productos físicos o servicios digitales, extrayendo texturas, reflejos y escala visual con Google Gemini Vision.", bullet_style))
    story.append(Paragraph("• <b>Ficha Maestra de Producción:</b> Despliegue obligatorio y continuo de Estrategia Viral, 3 Ganchos Simultáneos (0-3s), Shot-List cronológico toma por toma, Iluminación de ventana a 45° y Receta de edición.", bullet_style))
    story.append(Paragraph("• <b>Auditoría Crítica On-Demand:</b> Diagnóstico riguroso sobre videos (vía URL pública o subida directa MP4/MOV) analizando retención de primeros 3 segundos, acústica de voz, zonas seguras (safe zones) y CTA.", bullet_style))
    story.append(Paragraph("• <b>Scoring Cuantitativo (0 a 100):</b> Calificación objetiva con desglose analítico y lista priorizada de tareas correctivas antes de publicar.", bullet_style))
    story.append(Paragraph("• <b>Content Tracker Semanal:</b> Planificador de producción con estados ('Por Grabar', 'Grabado', 'Editado', 'Publicado') y meta semanal visual.", bullet_style))

    story.append(Paragraph("B. Lo que se Excluye del MVP (Out-of-Scope) y su Justificación Estratégica:", h2_style))
    story.append(Paragraph("• <b>Publicación automática desatendida:</b> Se excluye para evitar el alto riesgo de baneo de cuentas de usuario por parte de Meta y TikTok por uso de APIs no oficiales.", bullet_style))
    story.append(Paragraph("• <b>Editor de video integrado pesado:</b> Innecesario y computacionalmente ineficiente cuando existen suites consolidadas en móvil como CapCut o Premiere.", bullet_style))
    story.append(Paragraph("• <b>Generación de avatares sintéticos falsos:</b> Rechazados por el público moderno; AuditFlow fomenta el rodaje humano auténtico.", bullet_style))
    story.append(Paragraph("• <b>Monitoreo continuo 24/7 en segundo plano:</b> Consumo desmedido de ancho de banda y tokens sin aportar valor directo a la toma de decisión del video individual.", bullet_style))
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECCIÓN 3: ARQUITECTURA TÉCNICA Y RESILIENCIA
    # =========================================================================
    story.append(Paragraph("3. Arquitectura Técnica y Estrategia de Resiliencia", h1_style))
    arch_text = (
        "El sistema está construido como una aplicación moderna en <b>Next.js 14 (App Router)</b>, TypeScript y Tailwind CSS, "
        "optimizada bajo un enfoque <b>Mobile-First</b> para permitir el uso directo desde el smartphone del creador mientras graba.<br/><br/>"
        "<b>Arquitectura de Resiliencia Multimodelo (Zero-Downtime Engine):</b><br/>"
        "Para evitar los errores 503 (Service Unavailable) y límites de cuota típicos de proveedores de IA durante picos de tráfico, "
        "AuditFlow implementa una cascada de tolerancia a fallos:<br/>"
        "1. <i>Motor Primario:</i> Google Gemini 2.5/3.8 Flash con esquemas JSON estructurados estrictos.<br/>"
        "2. <i>Motor de Respaldo Automático:</i> Generador Inteligente Determinístico de Producción que responde en menos de 50ms "
        "garantizando que el usuario jamás reciba una pantalla de error o bloqueo en medio de su flujo de trabajo."
    )
    story.append(Paragraph(arch_text, body_style))
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECCIÓN 4: STUDIO ENGINE - LOS 5 PASOS OBLIGATORIOS
    # =========================================================================
    story.append(Paragraph("4. Studio Engine: Los 5 Pasos Obligatorios de la Guía de Rodaje", h1_style))
    
    pasos_data = [
        [Paragraph("PASO", th_style), Paragraph("COMPONENTE", th_style), Paragraph("DESCRIPCIÓN Y DIRECTIVA TÉCNICA", th_style)],
        [
            Paragraph("<b>Paso 1</b>", td_bold),
            Paragraph("Estrategia y Formato Viral", td_bold),
            Paragraph("Arquetipo probado psicológicamente ('Unboxing Sensorial', 'Problema-Solución Extremo', 'Prueba de Estrés'). Sugerencia de audio en tendencia calibrado al 12% de volumen de fondo.", td_norm)
        ],
        [
            Paragraph("<b>Paso 2</b>", td_bold),
            Paragraph("3 Ganchos Simultáneos (0-3s)", td_bold),
            Paragraph("Cada alternativa combina 3 elementos simultáneos: Texto en pantalla llamativo + Guion hablado directo + Acción visual física de alto impacto para detener el scroll.", td_norm)
        ],
        [
            Paragraph("<b>Paso 3</b>", td_bold),
            Paragraph("Shot-List Cronológico", td_bold),
            Paragraph("Desglose toma por toma (Toma 1 a 4+) especificando: tipo de plano (Macro detalle, POV en primera persona, Plano Cenital), ángulo de cámara y movimiento físico del smartphone.", td_norm)
        ],
        [
            Paragraph("<b>Paso 4</b>", td_bold),
            Paragraph("Reglas de Iluminación Específica", td_bold),
            Paragraph("Directiva casera sin equipo costoso: Luz de ventana natural orientada a 45°, rebote difuso en cartulina blanca y regla de oro de limpieza obligatoria de la lente del teléfono.", td_norm)
        ],
        [
            Paragraph("<b>Paso 5</b>", td_bold),
            Paragraph("Receta de Edición y Ritmo", td_bold),
            Paragraph("Pacing agresivo con cortes cada 1.2 a 1.8 segundos, audio calibrado al 12%, subtítulos ubicados en la Safe Zone vertical de TikTok/Reels y exportación en 1080x1920 (9:16).", td_norm)
        ]
    ]
    t_pasos = Table(pasos_data, colWidths=[1.0*inch, 2.0*inch, 4.5*inch])
    t_pasos.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E293B')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
    ]))
    story.append(t_pasos)
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECCIÓN 5: AUDITORÍA CRÍTICA ON-DEMAND (0 A 100)
    # =========================================================================
    story.append(Paragraph("5. Motor de Auditoría Crítica On-Demand", h1_style))
    audit_desc = (
        "El módulo de Auditoría permite evaluar cualquier video terminado antes de publicarlo o espiar piezas de competidores. "
        "Opera bajo dos modalidades de ingesta:<br/>"
        "• <b>Nivel 1 (Subida directa MP4/MOV):</b> Procesamiento directo del archivo de video renderizado desde el smartphone o computadora.<br/>"
        "• <b>Nivel 2 (URL pública de TikTok / Reels):</b> Descarga asistida de videos públicos sin requerir credenciales ni permisos de cuenta.<br/><br/>"
        "<b>Algoritmo Ponderado del Creative Quality Score (CQS 0-100):</b><br/>"
        "1. <i>Fuerza y Retención del Gancho Inicial (0-3s) - 30%:</i> Disrupción visual inmediata (macro/acción) y verbal antes del segundo 1.5.<br/>"
        "2. <i>Claridad Visual y Textual de la Propuesta de Valor - 25%:</i> Identificación del producto y solución concreta sin ambigüedades.<br/>"
        "3. <i>Pacing y Continuidad Visual - 20%:</i> Frecuencia de cortes cada 1.2s a 1.8s y dinamismo de encuadre sin pausas muertas.<br/>"
        "4. <i>Calidad, Balance y Normalización de Audio - 15%:</i> Claridad acústica de la voz y música trending al 10-12% de fondo.<br/>"
        "5. <i>CTA y Cumplimiento de Safe Zones - 10%:</i> Llamado a la acción visible y textos respetando el área segura libre de botones de TikTok/Reels."
    )
    story.append(Paragraph(audit_desc, body_style))
    story.append(Spacer(1, 6))

    # Subsección: Estructura Unificada del Entregable
    story.append(Paragraph("Estructura Unificada del Entregable de Auditoría (Las 3 Secciones Clave):", h2_style))
    deliverable_structure = [
        ("1. ENTENDÉ EL PERFIL (Diagnóstico de Posicionamiento):",
         "• Evaluación de la propuesta de valor bajo la 'Regla de los 3 segundos'.<br/>"
         "• Diagnóstico de biografía: detección de frases cliché y elementos que restan autoridad vs. gancho de transformación.<br/>"
         "• Tono y personalidad: consistencia comunicacional (Autoritario, Empático o Transaccional)."),
        ("2. LA MEJORA Y QUÉ HACER (Propuestas Técnicas Concretas):",
         "• 3 Opciones de Biografía optimizadas: listas para copiar (Autoridad, Beneficio Directo y Minimalista).<br/>"
         "• Ruta de Conversión y CTA: estructura optimizada para enlace múltiple (máximo 3 botones directos).<br/>"
         "• Estructura de 4 Portadas Destacadas (Highlights): 'Empezá acá', 'Productos/Servicios', 'Clientes/Reseñas' y 'Cómo Comprar'."),
        ("3. DESPUÉS HACÉ (Plan Técnico de Contenidos Accionable):",
         "• Rutina Semanal de Stories: Lunes de encuesta e interacción, Miércoles de detrás de escena/proceso y Viernes de venta directa.<br/>"
         "• 3 Ideas de Reels Virales por Rubro con gancho 0-3s, ritmo de 1.5s y CTA (Educativo, Rompiendo un mito/dolor y Storytelling de taller).")
    ]
    for d_title, d_content in deliverable_structure:
        b_deliv = Table([[Paragraph(f"<b>{d_title}</b><br/>{d_content}", body_style)]], colWidths=[7.5*inch])
        b_deliv.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
            ('LINELEFT', (0,0), (0,-1), 3.5, colors.HexColor('#4F46E5')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ]))
        story.append(b_deliv)
        story.append(Spacer(1, 3))

    story.append(Spacer(1, 8))

    # =========================================================================
    # SECCIÓN 6: HISTORIAS DE USUARIO (USER STORIES)
    # =========================================================================
    story.append(Paragraph("6. Historias de Usuario (User Stories)", h1_style))
    
    us_headers = [Paragraph("ID", th_style), Paragraph("COMO [ROL]", th_style), Paragraph("QUIERO [FUNCIONALIDAD]", th_style), Paragraph("PARA [BENEFICIO / IMPACTO]", th_style)]
    us_data = [
        ("US-01", "Creador / Emprendedor", "Subir foto de mi producto con nombre y objetivo", "Obtener al instante una guía de rodaje completa sin bloquearme."),
        ("US-02", "Creador de Contenido", "Recibir 3 alternativas de ganchos simultáneos", "Detener el scroll del espectador en los primeros 1.5s y subir retención."),
        ("US-03", "Grabador con Smartphone", "Ver lista cronológica de tomas con ángulo y movimiento", "Filmar todos los clips en menos de 15 minutos sabiendo qué hacer."),
        ("US-04", "Creador sin Luces Pro", "Recibir directivas prácticas para luz de ventana a 45°", "Evitar sombras duras y videos oscuros sin comprar equipo caro."),
        ("US-05", "Editor en CapCut", "Conocer ritmo de cortes (1.5s), volumen (12%) y safe zones", "Editar el video cumpliendo las reglas del algoritmo de TikTok/Reels."),
        ("US-06", "Dueño de Marca", "Pegar URL pública de un Reel/TikTok sin dar credenciales", "Auditar el rendimiento de mi video o el de un competidor en segundos."),
        ("US-07", "Creador Audiovisual", "Subir archivo MP4 o MOV directamente desde galería", "Auditar un borrador de video antes de publicarlo para corregir errores."),
        ("US-08", "Content Manager", "Ver puntuación global de 0 a 100 desglosada", "Medir objetivamente la probabilidad de éxito de cada pieza de contenido."),
        ("US-09", "Creador en Producción", "Guardar planes en planificador semanal con estados", "Mantener constancia publicando al menos 3 videos semanales organizadamente."),
        ("US-10", "Director de Proyecto", "Descargar documento maestro oficial en Word y PDF", "Revisar arquitectura, compartir con clientes y documentar especificaciones.")
    ]
    
    t_us_rows = [us_headers]
    for uid, urole, uwant, uso in us_data:
        t_us_rows.append([
            Paragraph(f"<b>{uid}</b>", td_bold),
            Paragraph(urole, td_bold),
            Paragraph(uwant, td_norm),
            Paragraph(uso, td_norm)
        ])
    
    t_us = Table(t_us_rows, colWidths=[0.8*inch, 1.8*inch, 2.5*inch, 2.4*inch])
    t_us.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E293B')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
    ]))
    story.append(t_us)
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECCIÓN 7: CASOS DE USO DEL SISTEMA (USE CASES)
    # =========================================================================
    story.append(Paragraph("7. Casos de Uso Formales del Sistema", h1_style))
    
    cus = [
        ("CU-01: Generación de Guía Maestra a partir de Producto (Foto + Datos)",
         "<b>Actor:</b> Creador UGC / Emprendedor.<br/>"
         "<b>Flujo Principal:</b> El usuario sube foto de su producto físico, ingresa el nombre, selecciona objetivo comercial (Ventas/Viralidad) y hace clic en 'Generar Guía'. "
         "El sistema envía la carga multimodal a /api/studio/generate. Gemini Vision analiza la escala y texturas y devuelve la ficha con formato viral, 3 ganchos, tomas 1 a 4+, iluminación y receta de edición. En caso de congestión de red (503), el sistema activa el fallback dinámico en <50ms."),
        
        ("CU-02: Auditoría Crítica de Video On-Demand (Borrador MP4 o URL)",
         "<b>Actor:</b> Content Manager / Dueño de Marca.<br/>"
         "<b>Flujo Principal:</b> El usuario ingresa la URL pública o sube el MP4/MOV de su video. El sistema procesa la tarea de forma asíncrona, evalúa retención de primeros 3 segundos, claridad de voz, respeto de zonas seguras y fuerza del CTA, devolviendo una nota de 0 a 100 con la lista de tareas correctivas antes de publicar."),
        
        ("CU-03: Seguimiento y Planificación en Content Tracker",
         "<b>Actor:</b> Creador de Contenido.<br/>"
         "<b>Flujo Principal:</b> El usuario guarda el ShootingKit generado en su planificador. La tarjeta se almacena con estado 'Por Grabar'. A medida que produce el material, actualiza el estado a 'Grabado', 'Editado' o 'Publicado', monitoreando el avance de su meta semanal de publicaciones."),
        
        ("CU-04: Descarga y Consulta de Documentación Oficial",
         "<b>Actor:</b> Director de Proyecto / Equipo Técnico.<br/>"
         "<b>Flujo Principal:</b> El usuario accede a la pestaña de documentación o rutas de exportación y descarga la especificación completa en formato DOCX o PDF para archivo, control de calidad o presentación a inversores.")
    ]
    
    for c_title, c_desc in cus:
        box_cu = Table([[Paragraph(f"<b>{c_title}</b><br/>{c_desc}", body_style)]], colWidths=[7.5*inch])
        box_cu.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
            ('LINELEFT', (0,0), (0,-1), 3.5, colors.HexColor('#4F46E5')),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(box_cu)
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 4))

    # =========================================================================
    # SECCIÓN 8: BENCHMARK Y MATRIZ DE COMPETIDORES
    # =========================================================================
    story.append(Paragraph("8. Benchmark de Competidores y Ventaja Estratégica", h1_style))
    
    bench_headers = [Paragraph("SISTEMA", th_style), Paragraph("CATEGORÍA", th_style), Paragraph("LO BUENO (REDDIT)", th_style), Paragraph("LO MALO (REDDIT)", th_style), Paragraph("VENTAJA AUDITFLOW", th_style)]
    bench_data = [
        ("Foreplay.co", "Swipe-File & Briefs", "Guarda anuncios antes de que Meta los borre.", "Caro ($49-$99/m); pasivo; no enseña a filmar.", "Crea guía activa de tu producto y audita tu MP4."),
        ("Creatify.ai", "Avatares Sintéticos", "Rápido para testear 15 variantes baratas.", "Avatares falsos ('uncanny valley'), rechazo orgánico.", "Fomenta videos humanos reales de smartphone."),
        ("Storyflow", "Shot-Lists de Cine", "Excelente para cineastas y continuidad.", "Rígido y lento; ignora el ritmo de TikTok.", "Shot-lists de 15 min pensados para el algoritmo."),
        ("Opus Clip", "Repurposing & Score", "Ahorra horas recortando podcasts.", "Repetitivo; IA solo lee texto, no imágenes.", "Diseñado para producto original con visión multimodal."),
        ("viral.app", "Tracking Viral", "Gráficos de picos virales en competidores.", "Promesas vacías de viralidad mágica; saturado.", "Prescriptivo: da guion, iluminación y checklist."),
        ("AdRoast / Atria", "AI Ad Roast", "Buen 'roast' crítico; minería de quejas.", "Cobros fantasma; solo pensado para paid ads.", "Auditoría técnica real de MP4 para orgánico y ads."),
        ("CreativeX", "Creative Quality Score", "Estándar corporativo para Unilever/Nestlé.", "Precios prohibitivos ($15k-$50k/año); reglas viejas.", "Democratiza el CQS para creadores y PyMEs.")
    ]
    
    t_bench_rows = [bench_headers]
    for b_sys, b_cat, b_pro, b_con, b_adv in bench_data:
        t_bench_rows.append([
            Paragraph(f"<b>{b_sys}</b>", td_bold),
            Paragraph(b_cat, td_norm),
            Paragraph(b_pro, td_norm),
            Paragraph(b_con, td_norm),
            Paragraph(b_adv, td_norm)
        ])
    
    t_bench = Table(t_bench_rows, colWidths=[1.1*inch, 1.2*inch, 1.7*inch, 1.7*inch, 1.8*inch])
    t_bench.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E293B')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
    ]))
    story.append(t_bench)
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECCIÓN 9: HOJA DE RUTA Y COSTOS
    # =========================================================================
    story.append(Paragraph("9. Hoja de Ruta de Implementación y Costos Operativos", h1_style))
    story.append(Paragraph("• <b>Fase 1 (Completada):</b> Studio Engine multimodal con Gemini Vision, UI/UX premium mobile-first, motor de tolerancia a fallos con fallback de producción y planificador semanal.", bullet_style))
    story.append(Paragraph("• <b>Fase 2 (Siguiente):</b> Motor asíncrono de auditoría por URL y MP4 con rúbrica estricta (retención 0-3s, acústica, safe zones y CTA) y scoring 0-100.", bullet_style))
    story.append(Paragraph("• <b>Fase 3:</b> Integración con n8n y webhooks para automatizaciones desatendidas y alertas a creadores.", bullet_style))
    story.append(Paragraph("• <b>Fase 4:</b> Cuentas de usuario y sincronización bidireccional con Notion y Google Drive.", bullet_style))
    story.append(Paragraph("<b>Presupuesto Operativo del MVP:</b> $0 a $5 USD mensuales (Next.js en Vercel/Cloudflare + Gemini Free Tier hasta 1,500 solicitudes diarias gratuitas).", body_style))

    story.append(Spacer(1, 10))
    p_end = Paragraph("— Fin del Documento Maestro Oficial —<br/><b>AuditFlow Core Team © 2026</b>", ParagraphStyle('End', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12, alignment=1, textColor=colors.HexColor('#94A3B8')))
    story.append(p_end)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generado exitosamente: {filepath}")

def main():
    print("Iniciando generación del Documento Maestro en PDF...")
    build_pdf(OUTPUT_DESKTOP)
    build_pdf(OUTPUT_PROJECT)
    build_pdf(OUTPUT_PUBLIC)
    print("Completado en todas las ubicaciones.")

if __name__ == "__main__":
    main()
