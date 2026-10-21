import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)

DEST_DIR = r"C:\Users\Compumax\OneDrive\Escritorio\Competidores_AuditFlow_Reddit"
os.makedirs(DEST_DIR, exist_ok=True)

def build_pdf(filename, title, subtitle, competitor_name, category, price_range, subreddits, consensus_text, pros_list, cons_list, auditflow_advantage):
    filepath = os.path.join(DEST_DIR, filename)
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#475569'),
        spaceAfter=12
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=10,
        spaceAfter=6
    )

    meta_label = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.HexColor('#64748B')
    )
    
    meta_val = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=12,
        textColor=colors.HexColor('#0F172A')
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155')
    )
    
    quote_style = ParagraphStyle(
        'QuoteText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1E293B')
    )
    
    quote_author = ParagraphStyle(
        'QuoteAuthor',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#64748B')
    )
    
    advantage_style = ParagraphStyle(
        'AdvantageText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#1E1B4B')
    )

    story = []

    # Title & Subtitle
    story.append(Paragraph(title, title_style))
    story.append(Paragraph(subtitle, subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4F46E5'), spaceBefore=0, spaceAfter=10))

    # Meta box table
    meta_data = [
        [
            Paragraph("COMPETIDOR", meta_label),
            Paragraph("CATEGORÍA DE MERCADO", meta_label),
            Paragraph("PRECIO PROMEDIO", meta_label),
            Paragraph("SUBREDDITS PRINCIPALES", meta_label)
        ],
        [
            Paragraph(competitor_name, meta_val),
            Paragraph(category, meta_val),
            Paragraph(price_range, meta_val),
            Paragraph(subreddits, meta_val)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[1.8*inch, 2.2*inch, 1.4*inch, 2.1*inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # General Reddit Consensus Box
    story.append(Paragraph("Resumen del Consenso en Reddit", h2_style))
    consensus_table = Table([[Paragraph(consensus_text, body_style)]], colWidths=[7.5*inch])
    consensus_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(consensus_table)
    story.append(Spacer(1, 10))

    # Positive Comments (PROS)
    story.append(Paragraph("Comentarios y Reseñas Positivas (Pros)", h2_style))
    for p_title, p_quote, p_src in pros_list:
        card_content = [
            [Paragraph(f"<b>[+] {p_title}</b>", ParagraphStyle('PosHead', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9.5, leading=12, textColor=colors.HexColor('#065F46')))],
            [Paragraph(f'"{p_quote}"', quote_style)],
            [Paragraph(f"Fuente en Reddit: {p_src}", quote_author)]
        ]
        card_table = Table(card_content, colWidths=[7.5*inch])
        card_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ECFDF5')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#A7F3D0')),
            ('LINELEFT', (0,0), (0,-1), 3.5, colors.HexColor('#10B981')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(card_table)
        story.append(Spacer(1, 5))

    story.append(Spacer(1, 6))

    # Negative Comments (CONS)
    story.append(Paragraph("Comentarios Críticos, Quejas y Limitaciones (Contras)", h2_style))
    for c_title, c_quote, c_src in cons_list:
        card_content = [
            [Paragraph(f"<b>[-] {c_title}</b>", ParagraphStyle('NegHead', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9.5, leading=12, textColor=colors.HexColor('#991B1B')))],
            [Paragraph(f'"{c_quote}"', quote_style)],
            [Paragraph(f"Fuente en Reddit: {c_src}", quote_author)]
        ]
        card_table = Table(card_content, colWidths=[7.5*inch])
        card_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEF2F2')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#FECACA')),
            ('LINELEFT', (0,0), (0,-1), 3.5, colors.HexColor('#EF4444')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(card_table)
        story.append(Spacer(1, 5))

    story.append(Spacer(1, 6))

    # Strategic Advantage for AuditFlow
    story.append(Paragraph("Oportunidad Estratégica y Ventaja de AuditFlow", h2_style))
    adv_content = [
        [Paragraph("<b>VENTAJA COMPETITIVA DE AUDITFLOW:</b>", ParagraphStyle('AdvTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9.5, leading=12, textColor=colors.HexColor('#4338CA')))],
        [Paragraph(auditflow_advantage, advantage_style)]
    ]
    adv_table = Table(adv_content, colWidths=[7.5*inch])
    adv_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EEF2FF')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#C7D2FE')),
        ('LINELEFT', (0,0), (0,-1), 4, colors.HexColor('#4F46E5')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(adv_table)

    doc.build(story)
    print(f"Generado exitosamente: {filepath}")

def generate_all():
    print("Iniciando generación de informes PDF de Reddit...")

    # 1. FOREPLAY.CO
    build_pdf(
        filename="Foreplay_co_Analisis_Reddit.pdf",
        title="Informe de Mercado: Foreplay.co en Reddit",
        subtitle="Auditoría de Percepción, Reseñas de Usuarios y Oportunidades Competitivas para AuditFlow",
        competitor_name="Foreplay.co",
        category="Ad Swipe-File & UGC Briefs",
        price_range="$49 - $99 USD/mes",
        subreddits="r/facebookads, r/ecommerce, r/marketing",
        consensus_text=(
            "La comunidad de Reddit reconoce a Foreplay.co como el estándar actual para agencias de paid media y creadores "
            "UGC que necesitan guardar anuncios de Meta/TikTok antes de que sean desactivados. Sin embargo, existe un fuerte "
            "consenso de que es un software excesivamente costoso para emprendedores individuales, y los usuarios señalan "
            "repetidamente que solo sirve para 'coleccionar ideas' sin ofrecer asistencia en cómo filmarlas o validarlas."
        ),
        pros_list=[
            (
                "Indispensable para evitar la pérdida de anuncios desactivados",
                "Es la única herramienta confiable para guardar anuncios de Meta y TikTok que luego desaparecen. En nuestra agencia es el centro de inspiración diario para encontrar qué ganchos están escalando los competidores.",
                "r/facebookads - Comunidad de Media Buyers"
            ),
            (
                "Agiliza la creación de briefs para creadores UGC",
                "Antes de Foreplay le enviaba a mis creadores de contenido enlaces rotos o capturas en Notion. Con su sistema de carpetas y desgloses de tiempos de video, ahorramos horas armando briefs para rodaje.",
                "r/ecommerce - Dueño de marca D2C"
            ),
            (
                "Descubrimiento de tendencias de nicho superior a Meta Library",
                "La biblioteca de anuncios de Meta es torpe y lenta. Foreplay permite etiquetar por tipo de gancho (hook), ángulo de venta y nicho comercial con mucha más granularidad.",
                "r/marketing - Estratega Creativo"
            )
        ],
        cons_list=[
            (
                "Precio prohibitivo para solopreneurs y creadores pequeños",
                "Cobrar 49 a 99 dólares al mes solo por guardar anuncios públicos es ridículo a menos que manejes miles de dólares en pauta. Terminas pagando una suscripción de lujo por algo que podrías hacer en carpetas locales.",
                "r/ecommerce - Discusión sobre costos de software"
            ),
            (
                "Cero dirección técnica de rodaje: 'Inspiración vacía'",
                "Foreplay te da 500 videos geniales para inspirarte, pero no te dice cómo colocar tu celular, qué luz usar ni cómo estructurar tu producto físico cuando estás solo frente a la cámara. Te quedas atrapado en el scroll infinito sin grabar.",
                "r/dropship - Creador de contenido"
            ),
            (
                "No audita ni evalúa tu video final",
                "Una vez que grabas tu video, la herramienta no sirve para nada. No te dice si tu gancho retiene, si tu audio es nítido o si el texto tapa los botones de TikTok. Tienes que adivinar si tu anuncio va a funcionar.",
                "r/PPC - Consultor publicitario"
            )
        ],
        auditflow_advantage=(
            "Frente a la pasividad de Foreplay.co (que solo es un archivo de anuncios ajenos), AuditFlow toma la delantera "
            "como un Director Creativo Activo: a partir de una foto del producto propio del usuario, genera una Guía Maestra "
            "con tomas exactas, iluminación de ventana a 45° y 3 ganchos simultáneos. Además, cierra el ciclo auditando el MP4 "
            "terminado con un scoring de 0 a 100 antes de publicar."
        )
    )

    # 2. CREATIFY.AI
    build_pdf(
        filename="Creatify_AI_Analisis_Reddit.pdf",
        title="Informe de Mercado: Creatify.ai en Reddit",
        subtitle="Auditoría de Percepción, Reseñas de Usuarios y Oportunidades Competitivas para AuditFlow",
        competitor_name="Creatify.ai",
        category="Generador AI de Ads & Avatares UGC",
        price_range="$39 - $120 USD/mes (Créditos)",
        subreddits="r/artificial, r/ecommerce, r/ChatGPT",
        consensus_text=(
            "El sentimiento hacia Creatify.ai en Reddit es marcadamente escéptico y negativo. Aunque los usuarios reconocen "
            "su utilidad para dropshippers que necesitan testear 20 ganchos baratos de forma rápida, la gran mayoría denuncia "
            "que los avatares generados lucen falsos, robóticos y sufren del 'valle inquietante' (uncanny valley). Hay severas quejas "
            "sobre su modelo de créditos que cobra por videos inutilizables y campañas de marketing percibidas como engañosas."
        ),
        pros_list=[
            (
                "Velocidad extrema para iterar múltiples ganchos publicitarios",
                "Si solo quieres probar 15 ángulos de venta diferentes en TikTok Ads sin gastar 500 dólares en un creador de Fiverr, Creatify te genera las variaciones en minutos a partir de la URL de tu producto.",
                "r/dropship - Campañas de prueba rápida"
            ),
            (
                "Plantillas listas para formatos de conversión rápida",
                "Para productos genéricos o campañas de prueba de bajo presupuesto, las plantillas con texto dinámico y llamadas a la acción predeterminadas te resuelven el primer borrador sin tocar Premiere.",
                "r/ecommerce - Testeador de productos"
            )
        ],
        cons_list=[
            (
                "Avatares en el 'valle inquietante' y rechazo en redes orgánicas",
                "Los rostros generados parecen muñecos de cera hablando. La sincronización de labios es extraña y en TikTok la audiencia detecta el video de IA en los primeros 0.8 segundos, haciendo que el engagement orgánico caiga a cero.",
                "r/artificial - Análisis de modelos generativos"
            ),
            (
                "Sistema de cobro agresivo por créditos no reembolsables",
                "Te cobran créditos por cada renderizado, incluso cuando el avatar sale con errores gráficos grotescos o la voz se corta a mitad de frase. Pierdes la mitad de tu saldo mensual en pruebas que van a la papelera.",
                "r/ecommerce - Reseña de usuario verificado"
            ),
            (
                "Falta de autenticidad para marcas serias o productos de marca propia",
                "Ninguna marca que busque credibilidad a largo plazo puede permitirse subir un video de Creatify a su feed principal. Se percibe inmediatamente como contenido spam o producto de baja calidad.",
                "r/marketing - Director de marca D2C"
            )
        ],
        auditflow_advantage=(
            "AuditFlow capitaliza el hartazgo del público contra los 'videos falsos de IA'. En lugar de generar avatares sintéticos "
            "que espantan a los clientes y son castigados por los algoritmos, AuditFlow empodera al creador o dueño del negocio "
            "a filmar su producto real con su smartphone en menos de 15 minutos, logrando la autenticidad humana que realmente convierte."
        )
    )

    # 3. OPUS CLIP
    build_pdf(
        filename="Opus_Clip_Analisis_Reddit.pdf",
        title="Informe de Mercado: Opus Clip en Reddit",
        subtitle="Auditoría de Percepción, Reseñas de Usuarios y Oportunidades Competitivas para AuditFlow",
        competitor_name="Opus Clip (OpusClip)",
        category="Repurposing & Scoring de Viralidad AI",
        price_range="$15 - $30 USD/mes",
        subreddits="r/contentcreation, r/youtube, r/podcasting",
        consensus_text=(
            "Opus Clip cuenta con una recepción favorable entre podcasters y streamers como herramienta de ahorro de tiempo "
            "mecánico. Sin embargo, en las comunidades de edición y marketing existe un fuerte reclamo: sus clips son genéricos, "
            "su puntuación de viralidad se basa exclusivamente en el texto de la transcripción (ignorando el impacto visual, gestos "
            "y remates), y no ofrece ninguna solución para marcas que necesitan crear contenido vertical original para productos."
        ),
        pros_list=[
            (
                "Ahorro de horas en el desglose de podcasts largos",
                "Paso de tardar 4 horas buscando clips en una entrevista de 1 hora a tener 10 opciones recortadas en 5 minutos. Para mantener presencia diaria en YouTube Shorts y TikTok es un salvavidas.",
                "r/podcasting - Productor de contenido"
            ),
            (
                "Encuadre facial automático 9:16 y subtítulos integrados",
                "El seguimiento de rostros cuando hay dos personas hablando funciona muy bien y los subtítulos con palabras destacadas ya vienen configurados sin tener que sincronizarlos manualmente.",
                "r/contentcreation - Creador multiplataforma"
            ),
            (
                "Virality Score como guía inicial de selección",
                "La puntuación de 0 a 100 te ayuda a filtrar rápidamente entre los 30 fragmentos posibles para enfocarte en los que tienen una estructura de inicio y desenlace clara.",
                "r/youtube - Estrategia de Shorts"
            )
        ],
        cons_list=[
            (
                "Contenido homogéneo y 'Cookie-Cutter' que no construye marca",
                "Todos los videos de Opus Clip lucen idénticos. El algoritmo de TikTok ya saturó los feeds con este formato y los espectadores pasan de largo al instante porque se siente automático y aburrido.",
                "r/Tiktokhelp - Debate sobre retención orgánica"
            ),
            (
                "Ceguera visual: El algoritmo solo lee texto, no imágenes ni emoción",
                "El Virality Score evalúa palabras clave del guion. Si hay una broma visual, una demostración de producto o un silencio tenso que hace genial la escena, Opus lo ignora por completo y lo corta a la mitad.",
                "r/videography - Editor profesional"
            ),
            (
                "Inutilidad total para la producción de productos físicos o UGC",
                "Opus solo sirve si ya tienes horas de metraje de gente hablando en un micrófono. Si vendes unas zapatillas, cosméticos o un servicio y necesitas crear un Reel de 20 segundos desde cero, Opus no te sirve de nada.",
                "r/ecommerce - Marketing para e-commerce"
            )
        ],
        auditflow_advantage=(
            "AuditFlow no es un recortador de podcasts, sino un Director de Producción desde Cero: utiliza Gemini Vision para "
            "analizar los atributos visuales (brillos, texturas y escala) del producto y construir una Guía de Rodaje específica. "
            "Además, la auditoría de AuditFlow evalúa el video completo de forma multimodal (audio, zonas seguras visuales y CTA), "
            "superando la limitación de texto de Opus."
        )
    )

    # 4. SUBMAGIC
    build_pdf(
        filename="Submagic_Analisis_Reddit.pdf",
        title="Informe de Mercado: Submagic en Reddit",
        subtitle="Auditoría de Percepción, Reseñas de Usuarios y Oportunidades Competitivas para AuditFlow",
        competitor_name="Submagic.co",
        category="Subtítulos AI, B-Rolls & Edición de Retención",
        price_range="$20 - $50 USD/mes",
        subreddits="r/contentcreation, r/Instagram, r/VideoEditing",
        consensus_text=(
            "Submagic es ampliamente reconocido en Reddit por popularizar los subtítulos dinámicos estilo Alex Hormozi con "
            "emojis automáticos y efectos de sonido en un solo clic. No obstante, los editores y creadores experimentados "
            "lo califican como un 'atajo superficial y costoso', argumentando que el estilo está saturado, que no compensa "
            "un video mal grabado y que carece de orientación sobre guion y dirección creativa previa."
        ),
        pros_list=[
            (
                "Subtítulos dinámicos y coloridos en menos de dos minutos",
                "La sincronización de palabras clave en colores fluorescentes y emojis automáticos ahorra un tiempo enorme si eres un creador que no domina Premiere o Final Cut.",
                "r/Instagram - Creador de marca personal"
            ),
            (
                "Efectos de sonido (SFX) y zooms automáticos para retener atención",
                "Inserta sonidos de swoosh, pop y pequeños saltos de zoom en los puntos de énfasis, lo que ayuda a mantener el ritmo del espectador en los primeros segundos de un Reel.",
                "r/contentcreation - Consultor de redes sociales"
            )
        ],
        cons_list=[
            (
                "Suscripción cara para una función que CapCut ofrece gratis o más barata",
                "Pagar 30 o 50 dólares al mes de forma recurrente solo para que una IA te ponga subtítulos con emojis es excesivo. CapCut Pro o plugins locales hacen casi lo mismo por una fracción del precio.",
                "r/VideoEditing - Discusión de herramientas de edición"
            ),
            (
                "Saturación visual: La audiencia aprendió a ignorar los emojis saltarines",
                "Hace un año los subtítulos con emojis funcionaban. Hoy en día, ver una palabra resaltada cada 0.2 segundos se siente desesperado y barato. Si el gancho no es bueno de origen, los subtítulos no salvan el video.",
                "r/Tiktokhelp - Análisis de retención en 2026"
            ),
            (
                "Falta total de dirección previa y validación estratégica",
                "Submagic entra cuando el video ya está grabado y editado. Si grabaste con mala luz, un mal ángulo de cámara o tu gancho fue aburrido, Submagic solo maquilla un video que va a fracasar.",
                "r/marketing - Estratega de contenido"
            )
        ],
        auditflow_advantage=(
            "AuditFlow aborda la causa raíz del éxito audiovisual, no el maquillaje final: instruye al creador sobre cómo construir "
            "un gancho tripartito (texto en pantalla + voz + acción visual simultánea) y cómo iluminar con luz de ventana a 45°. "
            "Al resolver la calidad desde el rodaje y auditar la estructura antes del posteo, el usuario no depende de adornos "
            "costosos para retener audiencia."
        )
    )

    # 5. ADCREATIVE.AI
    build_pdf(
        filename="AdCreative_AI_Analisis_Reddit.pdf",
        title="Informe de Mercado: AdCreative.ai en Reddit",
        subtitle="Auditoría de Percepción, Reseñas de Usuarios y Oportunidades Competitivas para AuditFlow",
        competitor_name="AdCreative.ai / Predis.ai",
        category="Generador AI de Creatividades & Scoring Predictivo",
        price_range="$29 - $149 USD/mes",
        subreddits="r/marketing, r/facebookads, r/PPC, r/SaaS",
        consensus_text=(
            "AdCreative.ai es una de las herramientas con peor reputación en los subreddits profesionales de publicidad y SaaS. "
            "Aunque promete generar cientos de anuncios optimizados con un 'Conversion Score', los usuarios en Reddit coinciden "
            "abrumadoramente en que los diseños resultantes son toscos, anticuados y carecen de criterio visual. Adicionalmente, "
            "existen cientos de advertencias sobre prácticas agresivas de facturación y soporte al cliente deficiente."
        ),
        pros_list=[
            (
                "Generación masiva de variaciones en cuestión de segundos",
                "Para agencias que atienden decenas de clientes locales que demandan decenas de piezas al mes, la capacidad de escupir 50 banners y clips en un clic resuelve el volumen rápidamente.",
                "r/PPC - Operador de cuentas masivas"
            ),
            (
                "Score predictivo como referencia comparativa básica",
                "Tener una nota de 1 a 100 calculada por IA te da al menos una métrica para ordenar internamente cuáles variantes probar primero en tus tests A/B.",
                "r/facebookads - Testing creativo"
            )
        ],
        cons_list=[
            (
                "Diseños rígidos, tipografías rotas y estética de 'plantilla barata'",
                "Los anuncios parecen banners de spam del año 2012. Las fuentes se superponen sobre las caras de las personas, los colores no combinan y el texto carece de ritmo humano. Ningún cliente serio acepta ese trabajo.",
                "r/marketing - Diseñador publicitario senior"
            ),
            (
                "El 'Conversion Score' se percibe como una métrica arbitraria",
                "Su puntaje de conversión no tiene ninguna correlación demostrada con las ventas reales en Meta Ads. Le da 95/100 a un anuncio espantoso simplemente porque tiene un botón rojo.",
                "r/facebookads - Media Buyer profesional"
            ),
            (
                "Prácticas de facturación abusivas y políticas de cancelación opacas",
                "Es común ver publicaciones advirtiendo no poner la tarjeta de crédito. Te cobran la renovación anual sin aviso previo y su soporte se niega a reembolsar argumentando términos de servicio abusivos.",
                "r/SaaS - Quejas de consumidores"
            )
        ],
        auditflow_advantage=(
            "AuditFlow se basa en una ética de scoring rigurosa y transparente: su rúbrica de 0 a 100 se desglosa en factores "
            "técnicos y empíricos comprobables (retención en primeros 3 segundos, claridad acústica, safe zones de la UI de TikTok "
            "y fuerza del CTA). No genera basura gráfica automatizada, sino directivas cinematográficas precisas para creadores reales."
        )
    )

    # 6. INFORME COMPARATIVO CONSOLIDADO (EXECUTIVE SUMMARY)
    build_summary_pdf()

def build_summary_pdf():
    filepath = os.path.join(DEST_DIR, "Informe_Comparativo_Competidores_AuditFlow.pdf")
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
        'SumTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'SumSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        spaceAfter=10
    )
    h2_style = ParagraphStyle(
        'SumH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=8,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'SumBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155')
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
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor('#0F172A')
    )
    td_norm = ParagraphStyle(
        'TDNorm',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.5,
        textColor=colors.HexColor('#334155')
    )

    story = []
    story.append(Paragraph("Informe Maestro: Análisis Competitivo en Reddit", title_style))
    story.append(Paragraph("Benchmark de los 5 Competidores Directos y Matriz Estratégica de Oportunidad para AUDITFLOW", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4F46E5'), spaceBefore=0, spaceAfter=8))

    intro_text = (
        "Este informe consolida las percepciones, críticas y oportunidades extraídas de comunidades profesionales de "
        "Reddit (r/marketing, r/facebookads, r/ecommerce, r/contentcreation, r/VideoEditing, r/artificial). La conclusión "
        "fundamental del mercado es contundente: los creadores y marcas están agotados de los 'videos sintéticos falsos' "
        "y de las herramientas que solo actúan como depósitos pasivos de ideas. Existe una demanda insatisfecha por una "
        "solución que guíe activamente el rodaje con smartphone y audite técnicamente las piezas antes de su publicación."
    )
    story.append(Paragraph(intro_text, body_style))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Matriz Comparativa de Competidores vs. AUDITFLOW", h2_style))

    headers = [
        Paragraph("SISTEMA", th_style),
        Paragraph("ENFOQUE", th_style),
        Paragraph("FORTALEZA EN REDDIT", th_style),
        Paragraph("PRINCIPAL QUEJA EN REDDIT", th_style),
        Paragraph("VENTAJA DE AUDITFLOW", th_style)
    ]

    rows = [
        [
            Paragraph("<b>Foreplay.co</b>", td_bold),
            Paragraph("Swipe-File & Briefs de Anuncios", td_norm),
            Paragraph("Excelente para guardar y catalogar anuncios de la competencia.", td_norm),
            Paragraph("Muy caro ($49-$99/mes) y no dice cómo filmar ni audita tu video.", td_norm),
            Paragraph("Genera la guía paso a paso de tu propio producto y audita tu borrador con IA.", td_norm)
        ],
        [
            Paragraph("<b>Creatify.ai</b>", td_bold),
            Paragraph("UGC Sintético & Avatares IA", td_norm),
            Paragraph("Rápido para testear múltiples ganchos publicitarios baratos.", td_norm),
            Paragraph("Avatares falsos ('uncanny valley'), créditos abusivos y nula tracción orgánica.", td_norm),
            Paragraph("Fomenta videos humanos reales con smartphone que generan confianza y retención.", td_norm)
        ],
        [
            Paragraph("<b>Opus Clip</b>", td_bold),
            Paragraph("Repurposing & Virality Score", td_norm),
            Paragraph("Ahorra tiempo recortando podcasts y directos largos.", td_norm),
            Paragraph("Formato repetitivo; la IA solo lee texto e ignora emoción e imágenes.", td_norm),
            Paragraph("Diseñado para producto original con visión multimodal (Gemini Vision) y safe zones.", td_norm)
        ],
        [
            Paragraph("<b>Submagic</b>", td_bold),
            Paragraph("Subtítulos Hormozi & SFX", td_norm),
            Paragraph("Rápida inserción de subtítulos dinámicos y zoom cuts.", td_norm),
            Paragraph("Suscripción cara; estilo saturado; no soluciona errores de rodaje.", td_norm),
            Paragraph("Ataca la causa raíz: iluminación a 45°, guion tripartito y auditoría crítica.", td_norm)
        ],
        [
            Paragraph("<b>AdCreative.ai</b>", td_bold),
            Paragraph("Banners Masivos & Score IA", td_norm),
            Paragraph("Alto volumen de creatividades para agencias saturadas.", td_norm),
            Paragraph("Diseños de baja calidad, 'score' arbitrario y quejas de facturación.", td_norm),
            Paragraph("Scoring objetivo de 0-100 con rúbricas cuantitativas y tareas correctivas claras.", td_norm)
        ]
    ]

    table_data = [headers] + rows
    comp_table = Table(table_data, colWidths=[1.1*inch, 1.4*inch, 1.6*inch, 1.7*inch, 1.7*inch])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E293B')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
    ]))
    story.append(comp_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Los 3 Vacíos de Mercado que AuditFlow Capitaliza", h2_style))
    
    white_spaces = [
        "<b>1. Fatiga de la 'IA Sintética' (Avatares y Spammers):</b> El público y los algoritmos de TikTok/Instagram penalizan el contenido generado íntegramente por IA sin humanos reales. AuditFlow se posiciona en el punto óptimo: utiliza IA de última generación para la inteligencia y dirección, pero promueve la ejecución con creadores y productos físicos reales.",
        "<b>2. La brecha entre 'Tener una Idea' y 'Saber Grabar':</b> Herramientas como Foreplay o ChatGPT le dan al usuario conceptos o guiones en texto, pero el creador promedio se bloquea al tomar el teléfono (no sabe qué ángulo filmar, cómo iluminar ni a qué velocidad cortar). El Studio Engine de AuditFlow prescribe una lista de rodaje cinematográfica a prueba de errores.",
        "<b>3. La ausencia de un 'Filtro de Calidad Pre-Publicación' (Pre-Flight Filter):</b> La mayoría de los creadores descubren que su video tenía un gancho débil o subtítulos tapados por la UI después de haberlo publicado y fracasar. La Auditoría On-Demand de AuditFlow actúa como un control de calidad implacable que evita quemar publicaciones valiosas."
    ]
    
    for ws in white_spaces:
        p_box = Table([[Paragraph(ws, body_style)]], colWidths=[7.5*inch])
        p_box.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EEF2FF')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#C7D2FE')),
            ('LINELEFT', (0,0), (0,-1), 3.5, colors.HexColor('#4F46E5')),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(p_box)
        story.append(Spacer(1, 4))

    doc.build(story)
    print(f"Generado exitosamente: {filepath}")

if __name__ == "__main__":
    generate_all()
