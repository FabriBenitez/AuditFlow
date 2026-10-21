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

def build_exhaustive_pdf(filename, title, subtitle, competitor_name, category, price_range, subreddits, executive_summary, how_it_works, pros_list, cons_list, pricing_breakdown, auditflow_battlecard):
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
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        spaceAfter=10
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=10,
        spaceAfter=5
    )

    h3_style = ParagraphStyle(
        'SectionH3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceBefore=6,
        spaceAfter=3
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
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#0F172A')
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155')
    )
    
    quote_style = ParagraphStyle(
        'QuoteText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1E293B')
    )
    
    quote_author = ParagraphStyle(
        'QuoteAuthor',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#64748B')
    )
    
    card_body = ParagraphStyle(
        'CardBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155')
    )

    story = []

    # Title & Subtitle
    story.append(Paragraph(title, title_style))
    story.append(Paragraph(subtitle, subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4F46E5'), spaceBefore=0, spaceAfter=8))

    # Meta box table
    meta_data = [
        [
            Paragraph("HERRAMIENTA / SISTEMA", meta_label),
            Paragraph("CATEGORÍA DE MERCADO", meta_label),
            Paragraph("RANGO DE PRECIOS", meta_label),
            Paragraph("FUENTES Y SUBREDDITS", meta_label)
        ],
        [
            Paragraph(competitor_name, meta_val),
            Paragraph(category, meta_val),
            Paragraph(price_range, meta_val),
            Paragraph(subreddits, meta_val)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[1.8*inch, 2.3*inch, 1.4*inch, 2.0*inch])
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

    # 1. Resumen Ejecutivo
    story.append(Paragraph("1. Resumen Ejecutivo y Posicionamiento", h2_style))
    box_exec = Table([[Paragraph(executive_summary, body_style)]], colWidths=[7.5*inch])
    box_exec.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#94A3B8')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(box_exec)
    story.append(Spacer(1, 6))

    # 2. Cómo funciona técnicamente
    story.append(Paragraph("2. Arquitectura de Flujo y Modo de Operación", h2_style))
    story.append(Paragraph(how_it_works, body_style))
    story.append(Spacer(1, 6))

    # 3. Lo Bueno (Pros y Citas)
    story.append(Paragraph("3. Lo Bueno: Fortalezas, Casos de Éxito y Reseñas Positivas en Reddit", h2_style))
    for p_title, p_desc, p_quote, p_src in pros_list:
        card_content = [
            [Paragraph(f"<b>[+] {p_title}</b>", ParagraphStyle('PosHead', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=colors.HexColor('#065F46')))],
            [Paragraph(p_desc, card_body)],
            [Paragraph(f'"{p_quote}"', quote_style)],
            [Paragraph(f"Testimonio en Reddit: {p_src}", quote_author)]
        ]
        card_table = Table(card_content, colWidths=[7.5*inch])
        card_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ECFDF5')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#A7F3D0')),
            ('LINELEFT', (0,0), (0,-1), 3.5, colors.HexColor('#10B981')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ]))
        story.append(card_table)
        story.append(Spacer(1, 5))

    story.append(Spacer(1, 4))

    # 4. Lo Malo (Contras y Citas)
    story.append(Paragraph("4. Lo Malo: Puntos Ciegos, Limitaciones Críticas y Quejas de Usuarios en Reddit", h2_style))
    for c_title, c_desc, c_quote, c_src in cons_list:
        card_content = [
            [Paragraph(f"<b>[-] {c_title}</b>", ParagraphStyle('NegHead', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=colors.HexColor('#991B1B')))],
            [Paragraph(c_desc, card_body)],
            [Paragraph(f'"{c_quote}"', quote_style)],
            [Paragraph(f"Queja reportada en Reddit: {c_src}", quote_author)]
        ]
        card_table = Table(card_content, colWidths=[7.5*inch])
        card_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEF2F2')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#FECACA')),
            ('LINELEFT', (0,0), (0,-1), 3.5, colors.HexColor('#EF4444')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ]))
        story.append(card_table)
        story.append(Spacer(1, 5))

    story.append(Spacer(1, 4))

    # 5. Precios y Relación Costo-Beneficio
    story.append(Paragraph("5. Análisis de Precios y Razones de Cancelación (Churn)", h2_style))
    story.append(Paragraph(pricing_breakdown, body_style))
    story.append(Spacer(1, 6))

    # 6. Battlecard frente a AuditFlow
    story.append(Paragraph("6. Battlecard Estratégico: Por Qué AUDITFLOW lo Supera", h2_style))
    adv_content = [
        [Paragraph("<b>VENTAJA DIFERENCIAL Y ÁNGULO DE ATAQUE DE AUDITFLOW:</b>", ParagraphStyle('AdvTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=colors.HexColor('#3730A3')))],
        [Paragraph(auditflow_battlecard, ParagraphStyle('AdvBody', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=12.5, textColor=colors.HexColor('#1E1B4B')))]
    ]
    adv_table = Table(adv_content, colWidths=[7.5*inch])
    adv_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EEF2FF')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#C7D2FE')),
        ('LINELEFT', (0,0), (0,-1), 4, colors.HexColor('#4F46E5')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(adv_table)

    doc.build(story)
    print(f"Generado exitosamente: {filepath}")

def generate_all_7():
    print("Iniciando generación exhaustiva de los 7 competidores de AuditFlow...")

    # =========================================================================
    # 1. FOREPLAY.CO
    # =========================================================================
    build_exhaustive_pdf(
        filename="1_Foreplay_co_Analisis_Exhaustivo.pdf",
        title="Auditoría Exhaustiva: Foreplay.co",
        subtitle="Análisis Profundo de Mercado, Sentimiento en Reddit y Matriz Competitiva frente a AUDITFLOW",
        competitor_name="Foreplay.co",
        category="Ad Swipe-File, Discovery & UGC Creative Briefs",
        price_range="$49 a $99 USD/mes (hasta $299 en planes de equipo)",
        subreddits="r/facebookads, r/ecommerce, r/marketing, r/PPC, r/dropship",
        executive_summary=(
            "Foreplay.co es la herramienta de referencia para agencias de publicidad digital y media buyers que necesitan "
            "guardar permanentemente anuncios de Meta Ads y TikTok Ads antes de que caduquen. Su propuesta se centra en resolver "
            "la volatilidad de la biblioteca de anuncios de Meta (donde los anuncios se borran cuando el anunciante apaga la campaña). "
            "No obstante, en Reddit existe una opinión generalizada de que es un software excesivamente pasivo: funciona como un 'Pinterest "
            "de pago caro', no aporta dirección técnica sobre cómo rodar el video propio y no posee capacidades para auditar el resultado final."
        ),
        how_it_works=(
            "Foreplay opera mediante una extensión de Chrome que 'captura' el video, copy, landing page y metadatos desde la Meta Ad Library "
            "o TikTok Creative Center con un clic. Los almacena en la nube del usuario en tableros organizados con etiquetas (por nicho, "
            "ángulo de venta, formato). Cuenta con una función de 'Brief Generator' para redactar instrucciones a creadores UGC y un módulo "
            "de transcripción de guiones con timestamps."
        ),
        pros_list=[
            (
                "Persistencia de Anuncios: Evita perder creatividades ganadoras",
                "Cuando un competidor apaga un anuncio ganador, Meta lo elimina en horas. Foreplay descarga el video a sus servidores y lo conserva para siempre con su metadata.",
                "Es la única herramienta que salva tus referencias de ser eliminadas. Mi equipo guarda cientos de ads cada semana para sesiones de brainstorming.",
                "r/facebookads - Agencia con +$100k/mes en gasto publicitario"
            ),
            (
                "Estructuración de Briefs para Creadores de Contenido UGC",
                "Permite compartir enlaces públicos a tableros limpios sin obligar a los creadores a tener cuenta, integrando guion desglosado segundo a segundo.",
                "Ahorramos unas 10 horas semanales pasando de Google Docs caóticos a tableros interactivos de Foreplay para mandar a filmar.",
                "r/ecommerce - Brand Manager de E-commerce D2C"
            ),
            (
                "Categorización y Filtrado de Ganchos (Hooks) de Alta Calidad",
                "Permite etiquetar anuncios por tipo de gancho: 'POV', '3 razones por las que...', 'unboxing', 'reacción', acelerando el análisis de patrones virales.",
                "El buscador de nichos y ganchos es 10 veces más rápido que bucear en TikTok Creative Center.",
                "r/marketing - Estratega Creativo"
            )
        ],
        cons_list=[
            (
                "Precio Desproporcionado para Creadores Solopreneurs",
                "El plan básico comienza en $49/mes por un solo usuario y escala rápidamente. Para creadores independientes o marcas con poco presupuesto, pagar $600 anuales solo por guardar videos es difícilmente justificable.",
                "Pagar $49 al mes solo por ser un 'marcador de favoritos vitaminado' duele cuando no tienes una agencia facturando fuerte.",
                "r/ecommerce - Discusión sobre stack de herramientas"
            ),
            (
                "Parálisis por Análisis y Cero Asistencia de Rodaje ('Inspiración Vacía')",
                "Los usuarios caen en el bucle de coleccionar cientos de anuncios sin ejecutar ninguno. Foreplay no enseña qué lente usar, cómo posicionar el smartphone frente a la ventana ni cómo resolver la iluminación de un producto físico.",
                "Tengo 400 anuncios guardados en Foreplay y sigo bloqueado cuando me pongo frente al celular para grabar mi propio producto.",
                "r/dropship - Creador de contenido individual"
            ),
            (
                "Ausencia Total de Control de Calidad Post-Producción",
                "Foreplay no tiene ninguna capacidad de ingesta de video propio para predecir si el gancho retendrá o si los subtítulos están cubiertos por la interfaz de TikTok.",
                "Una vez que terminas de grabar, la herramienta se desentiende. Sigues publicando a ciegas.",
                "r/PPC - Consultor de pauta digital"
            )
        ],
        pricing_breakdown=(
            "Plan Solo: $49/mes ($490/año). Plan Pro: $99/mes (3 usuarios). Planes Agencia: $199-$299/mes. "
            "Motivos principales de cancelación en Reddit: falta de tiempo para organizar los tableros, costo recurrente "
            "innecesario tras terminar la fase de investigación inicial, y redundancia con carpetas gratuitas de Google Drive."
        ),
        auditflow_battlecard=(
            "AUDITFLOW transforma la inspiración pasiva en ACCIÓN OBLIGATORIA: En lugar de obligar al usuario a navegar por miles "
            "de anuncios ajenos, el Studio Engine analiza con Gemini Vision la foto del producto específico y le entrega de inmediato "
            "la Guía Maestra de Rodaje (ángulos macro/POV, luz de ventana a 45°, 3 ganchos simultáneos y receta de pacing a 1.5s). "
            "Y a diferencia de Foreplay, AUDITFLOW cierra el ciclo auditando el video MP4 con un scoring de 0 a 100 antes de publicar."
        )
    )

    # =========================================================================
    # 2. CREATIFY.AI / CREATEUGC
    # =========================================================================
    build_exhaustive_pdf(
        filename="2_Creatify_CreateUGC_Analisis_Exhaustivo.pdf",
        title="Auditoría Exhaustiva: Creatify.ai & CreateUGC",
        subtitle="Análisis Profundo de Mercado, Sentimiento en Reddit y Matriz Competitiva frente a AUDITFLOW",
        competitor_name="Creatify.ai / CreateUGC",
        category="Generación de Video Ads con IA & Avatares Sintéticos (URL-to-Video)",
        price_range="$39 a $120 USD/mes (Basado en créditos por render)",
        subreddits="r/artificial, r/ecommerce, r/ChatGPT, r/dropship, r/digitalmarketing",
        executive_summary=(
            "Creatify.ai y CreateUGC prometen transformar cualquier URL de producto de Shopify o Amazon en un video publicitario listo "
            "para TikTok o Reels en cuestión de minutos, empleando avatares sintéticos y voces clonadas. Sin embargo, en Reddit son objeto "
            "de un rechazo contundente: la comunidad las califica como fábricas de 'AI Slop' (contenido basura de IA), señalando que los avatares "
            "caen en el 'valle inquietante' (uncanny valley), sufren de mala sincronización labial y son penalizados de inmediato por los "
            "algoritmos orgánicos de TikTok y Meta debido a la baja retención del espectador."
        ),
        how_it_works=(
            "El usuario introduce la URL del producto. Un scraper extrae las imágenes, precio y características. Un LLM redacta un guion "
            "promocional en formato problema-solución. Luego, un motor de video sintetiza un avatar digital (humano generado por IA) "
            "que gesticula y mueve los labios sobre una voz sintetizada (ElevenLabs o similar), intercalando las fotos del producto con transiciones básicas."
        ),
        pros_list=[
            (
                "Velocidad Industrial para Testeo Rápido de Hipótesis",
                "Permite generar 10 a 20 variaciones de anuncios para campañas de pauta en una hora sin negociar con creadores de contenido externos.",
                "Para productos de dropshipping donde solo quieres saber si el ángulo de venta tiene clics en Meta Ads, la velocidad es inmejorable.",
                "r/dropship - Campañas de testing masivo"
            ),
            (
                "Solución de Emergencia para Quienes No Tienen Presupuesto",
                "Evita el gasto inicial de $150-$300 por video que cobra un creador UGC promedio en plataformas como Fiverr o Insense.",
                "Si estás arrancando con $100 de presupuesto total, te permite tener algo en pantalla para empezar a rodar pauta.",
                "r/ecommerce - Emprendedor principiante"
            )
        ],
        cons_list=[
            (
                "El Efecto 'Uncanny Valley' y Rechazo Orgánico Inmediato",
                "Los avatares parecen figuras de cera con mirada vacía y movimientos robóticos. La gente en TikTok detecta la IA en menos de un segundo y desliza de inmediato, destruyendo las métricas de retención algorítmica.",
                "El público en 2026 odia los avatares de IA. En cuanto ven que la boca no coincide exactamente con el audio, se van y dejan comentarios burlándose.",
                "r/artificial - Discusión sobre IA generativa de video"
            ),
            (
                "Sistema de Créditos Opaco y Cobro por Videos Fallidos",
                "El modelo de suscripción descuenta créditos por cada intento de generación, incluso cuando el avatar parpadea con distorsiones, el producto sale deformado o la pronunciación es errónea.",
                "Te cobran créditos por renders que salen con caras deformes o fallos de render. Gasté 40 dólares y solo obtuve un video medio decente.",
                "r/ecommerce - Usuario verificado en Reddit"
            ),
            (
                "Destrucción de Marca y Cero Confianza Comercial",
                "Las marcas serias que buscan construir lealtad no pueden usar estos videos porque se asocian directamente con estafas, productos genéricos de baja calidad o tiendas dudosas.",
                "Usar avatares sintéticos le dice a tu cliente: 'ni siquiera nosotros nos molestamos en tocar el producto que te estamos vendiendo'.",
                "r/marketing - Director de marca D2C"
            )
        ],
        pricing_breakdown=(
            "Planes típicos desde $39/mes por un cupo limitado de créditos (unos 10-15 videos exportados). Planes superiores a $99-$120/mes. "
            "Causa número 1 de cancelación: agotamiento rápido de créditos en pruebas inservibles y baja tasa de conversión en campañas reales."
        ),
        auditflow_battlecard=(
            "AUDITFLOW combate el 'AI Slop' devolviéndole el poder al CREADOR HUMANO REAL: En lugar de crear un muñeco sintético "
            "que la audiencia rechaza al instante, AUDITFLOW actúa como un Director de Rodaje de bolsillo. Le dice al dueño del negocio "
            "o al creador exactamente qué decir, cómo iluminar y qué tomas hacer con su propio teléfono móvil en 15 minutos. El resultado "
            "es contenido genuino, con texturas y manos reales, generando una tasa de retención y conversión infinitamente superior."
        )
    )

    # =========================================================================
    # 3. STORYFLOW / PLAYCUT.AI
    # =========================================================================
    build_exhaustive_pdf(
        filename="3_Storyflow_Playcut_Analisis_Exhaustivo.pdf",
        title="Auditoría Exhaustiva: Storyflow & Playcut.ai",
        subtitle="Análisis Profundo de Mercado, Sentimiento en Reddit y Matriz Competitiva frente a AUDITFLOW",
        competitor_name="Storyflow / Playcut.ai",
        category="Generadores de Shot-Lists, Beats Narrativos & Planificación de Rodaje",
        price_range="Desde $19 a $49 USD/mes (o compras puntuales en Steam/Web)",
        subreddits="r/filmmakers, r/videography, r/screenwriting, r/contentcreation",
        executive_summary=(
            "Storyflow y Playcut.ai representan la vertiente de herramientas enfocadas en convertir guiones escritos en listas "
            "de tomas (shot lists) técnicas y estructuras de escenas (beats). Cuentan con gran aprecio entre cineastas independientes "
            "y creadores narrativos por su interfaz tipo lienzo infinito. Sin embargo, su debilidad radica en que fueron concebidas "
            "para cine tradicional y ficción horizontal: son excesivamente complejas para redes sociales, no entienden el ritmo "
            "vertiginoso de TikTok/Reels (cortes en <1.5s, retención de 0 a 3s) y no poseen capacidades de auditoría de video terminado."
        ),
        how_it_works=(
            "El usuario introduce un guion literario o sinopsis. La herramienta desglosa el texto en escenas, identificando personajes, "
            "ubicaciones y tipo de plano sugerido (Plano General, Plano Medio, Primer Plano). Organiza las tomas en un storyboard o "
            "cuadrícula de producción, permitiendo exportar PDFs técnicos de rodaje para equipos de filmación."
        ),
        pros_list=[
            (
                "Estructura Técnica Cinematográfica de Alto Nivel",
                "Permite planificar la continuidad visual de una historia compleja, asegurando que no se olviden planos de cobertura (b-rolls) durante el día de rodaje.",
                "Para cortometrajes y videos narrativos de YouTube, su lienzo infinito para conectar escenas y planos es fantástico.",
                "r/filmmakers - Director independiente"
            ),
            (
                "Exportación de Hojas de Rodaje Profesionales",
                "Genera documentos tabulares con tiempos estimados, necesidades de utilería y tipos de lente de cámara recomendados.",
                "Ayuda mucho a comunicarse con el director de fotografía antes de llegar al set de grabación.",
                "r/videography - Productor audiovisual"
            )
        ],
        cons_list=[
            (
                "Desconexión Total con el Algoritmo de TikTok y Reels",
                "Sus recomendaciones se basan en gramática cinematográfica clásica (establecer escena, planos largos de introducción). En redes verticales, un plano introductorio de 4 segundos significa muerte instantánea del video.",
                "Están pensadas para cineastas de festival, no para vender zapatillas en TikTok en 15 segundos con un gancho agresivo.",
                "r/contentcreation - Creador vertical en TikTok"
            ),
            (
                "Curva de Aprendizaje Elevada y Exceso de Fricción",
                "Exigen configurar escenas, personajes, etiquetas y descripciones exhaustivas. Un emprendedor o creador UGC no dispone de 45 minutos para configurar una hoja de rodaje antes de grabar un Reel rápido.",
                "Demasiado abrumador para el día a día. Termino usando notas en el celular porque configurar el software toma más tiempo que filmar.",
                "r/screenwriting - Usuario de herramientas de pre-producción"
            ),
            (
                "Cero Auditoría y Cero Comprensión Multimodal del Producto",
                "No analizan fotos físicas del producto para detectar reflejos o texturas, ni pueden revisar un video ya grabado para verificar el ritmo o la ubicación de los subtítulos.",
                "No hay retroalimentación sobre si tu video terminado funcionará o no en la práctica.",
                "r/videography - Creador digital"
            )
        ],
        pricing_breakdown=(
            "Precios en el rango de $19-$49/mes o modelos freemium limitados. "
            "Causas principales de cancelación: abandono por exceso de complejidad, falta de plantillas optimizadas para redes verticales "
            "y retorno de los usuarios a métodos más ágiles como Notion o notas de iPhone."
        ),
        auditflow_battlecard=(
            "AUDITFLOW es el 'Director de Rodaje' optimizado específicamente para el ALGORITMO VERTICAL: En vez de hojas de cine "
            "engorrosas, AUDITFLOW prescribe una Guía Maestra ultraconcisa de 5 pasos obligatorios diseñada para smartphones: "
            "3 ganchos simultáneos (0-3s), tomas exactas toma por toma con ángulos POV y macro, luz de ventana a 45° y receta de edición "
            "con cortes cada 1.2 a 1.8 segundos. Es la síntesis entre rigor cinematográfico y viralidad algorítmica."
        )
    )

    # =========================================================================
    # 4. OPUS CLIP / MINVO
    # =========================================================================
    build_exhaustive_pdf(
        filename="4_OpusClip_Minvo_Analisis_Exhaustivo.pdf",
        title="Auditoría Exhaustiva: Opus Clip & Minvo",
        subtitle="Análisis Profundo de Mercado, Sentimiento en Reddit y Matriz Competitiva frente a AUDITFLOW",
        competitor_name="Opus Clip / Minvo (ex Pyramind)",
        category="Repurposing de Video Largo a Corto & Virality Scoring con IA",
        price_range="$15 a $35 USD/mes (basado en minutos de video procesados)",
        subreddits="r/contentcreation, r/youtube, r/podcasting, r/NewTubers, r/editors",
        executive_summary=(
            "Opus Clip y Minvo son los reyes del 'repurposing' (recorte de videos largos a formato corto). Analizan transmisiones, "
            "podcasts o conferencias de YouTube y extraen los fragmentos con mayor potencial viral basándose en un 'Virality Score'. "
            "Aunque ahorran decenas de horas a podcasters y streamers, en Reddit existe un cansancio creciente hacia su estilo: los videos "
            "resultantes son predecibles y genéricos ('cookie-cutter'), el algoritmo solo evalúa el texto de la transcripción (es ciego a las "
            "imágenes y emociones), y son completamente inútiles para marcas que necesitan filmar un producto desde cero."
        ),
        how_it_works=(
            "El usuario pega el enlace de YouTube de un video de 30-60 minutos. El sistema transcribe el audio con whisper/IA, analiza los "
            "párrafos en busca de premisas atractivas y califica cada sección de 0 a 100 con su Virality Score. Aplica reencuadre facial "
            "automático con inteligencia artificial para convertir el video 16:9 a 9:16 y genera subtítulos animados en el centro de la pantalla."
        ),
        pros_list=[
            (
                "Ahorro de Tiempo Mecánico Masivo en Edición de Podcasts",
                "Elimina la necesidad de revisar manualmente una entrevista de 2 horas para encontrar 5 momentos interesantes para TikTok.",
                "Pasé de pagarle $400 al mes a un editor por sacar clips a tener 15 opciones listas en 10 minutos con Opus Clip.",
                "r/podcasting - Host de podcast de negocios"
            ),
            (
                "Encuadre Facial Dinámico y Subtítulos Autogenerados",
                "Su capacidad para detectar quién está hablando y alternar la pantalla o poner diseño dividido (split-screen) ahorra horas en Premiere.",
                "El seguimiento de caras y los subtítulos con palabras en verde y amarillo funcionan muy bien para entrevistas.",
                "r/youtube - Creador en YouTube Shorts"
            ),
            (
                "Virality Score como Filtro Rápido de Contenido",
                "La puntuación de 0 a 100 ayuda a los creadores a priorizar qué fragmentos tienen una estructura argumental completa.",
                "Minvo y Opus te dan un buen punto de partida para no revisar 40 clips mediocres.",
                "r/NewTubers - Creador de contenido emergente"
            )
        ],
        cons_list=[
            (
                "Ceguera Visual: La IA Solo Lee Texto, No Imágenes ni Emociones",
                "El algoritmo solo evalúa si el texto hablado suena a 'gancho'. Si en el video hay una demostración física asombrosa, una reacción visual cómica o un objeto clave, la IA lo corta a la mitad porque no 've' el video, solo lee el transcript.",
                "Opus le dio 90/100 a una parte aburrida donde el invitado usó palabras rimbombantes y 40/100 al momento más divertido del show porque fue un remate puramente visual.",
                "r/editors - Editor profesional de YouTube"
            ),
            (
                "Fatiga de Clips Genéricos ('Cookie-Cutter') en TikTok e Instagram",
                "El público reconoce el formato a la legua: subtítulos centrados con dos personas hablando en micrófonos Shure SM7B. La tasa de retención se ha desplomado porque todos los creadores usan la misma plantilla.",
                "Si tu estrategia es solo subir clips automáticos de Opus, tu canal se estanca. El algoritmo favorece el contenido original grabado exprofeso para el formato.",
                "r/Tiktokhelp - Discusión sobre shadowban y retención"
            ),
            (
                "Cero Utilidad para Creación de Contenido Original de Productos",
                "Si vendes cosméticos, ropa o un software y necesitas filmar un video promocional de 30 segundos, Opus y Minvo no sirven de nada. Requieren metraje previo de larga duración.",
                "No te ayuda a crear contenido nuevo; solo tritura lo que ya grabaste.",
                "r/marketing - Estratega digital"
            )
        ],
        pricing_breakdown=(
            "Planes habituales de $15 a $35/mes que otorgan entre 150 y 300 minutos de procesamiento mensual. "
            "Motivos principales de cancelación: acumulación de minutos no utilizados, estancamiento en el crecimiento de canales "
            "debido a la saturación del formato clip y transición de los creadores hacia producción vertical original."
        ),
        auditflow_battlecard=(
            "AUDITFLOW es el complemento y antídoto a los clippers de podcast: AUDITFLOW nace para CREAR CONTENIDO ORIGINAL DE PRODUCTO "
            "desde cero. Su motor de visión (Gemini Vision) sí entiende texturas, escala, reflejos y movimientos de cámara (no solo texto). "
            "Y su auditoría evalúa el ritmo visual, las safe zones de los botones de TikTok y la claridad del llamado a la acción (CTA), "
            "garantizando que cada video original sea una pieza diseñada exclusivamente para retener y vender."
        )
    )

    # =========================================================================
    # 5. VIRAL.APP / THE CONTENT LABS
    # =========================================================================
    build_exhaustive_pdf(
        filename="5_ViralApp_TheContentLabs_Analisis_Exhaustivo.pdf",
        title="Auditoría Exhaustiva: viral.app & The Content Labs",
        subtitle="Análisis Profundo de Mercado, Sentimiento en Reddit y Matriz Competitiva frente a AUDITFLOW",
        competitor_name="viral.app / The Content Labs",
        category="Auditoría Orgánica de Contenido, Tracking de Hooks & Benchmarking",
        price_range="$29 a $79 USD/mes (o modelos marketplace con comisiones)",
        subreddits="r/UGCcreators, r/SocialMediaMarketing, r/TikTokMonetizing, r/smallbusiness",
        executive_summary=(
            "viral.app y The Content Labs forman parte de la ola de aplicaciones enfocadas en auditar el rendimiento orgánico de videos "
            "y conectar estrategias virales con creadores. Sin embargo, en Reddit enfrentan un escrutinio muy severo: viral.app sufre quejas "
            "en comunidades de creadores por falta de respuesta y saturación en su marketplace, mientras que las herramientas que prometen "
            "'predecir viralidad' o 'hacerte viral con IA' son catalogadas como estrategias de marketing agresivo con consejos genéricos "
            "que no aportan dirección técnica real."
        ),
        how_it_works=(
            "The Content Labs rastrea cuentas de TikTok e Instagram de competidores, extrayendo métricas de vistas, likes y ratios de comentarios. "
            "Genera gráficos comparativos para mostrar qué videos despegaron y etiqueta los primeros segundos como 'ganchos ganadores'. "
            "Por su parte, viral.app combina tableros de analítica con un marketplace para postular a campañas de marcas."
        ),
        pros_list=[
            (
                "Comparativa Competitiva de Rendimiento sin Credenciales",
                "Permite espiar qué videos de la competencia tuvieron picos anormales de visualizaciones en la última semana.",
                "Es útil para ver si un competidor de tu nicho encontró un formato que le está trayendo millones de visitas orgánicas.",
                "r/SocialMediaMarketing - Consultor de redes"
            ),
            (
                "Detección de Tendencias Tempranas en Redes Sociales",
                "Ayuda a identificar temas o sonidos que están empezando a viralizarse antes de que saturen la pestaña 'Para Ti'.",
                "Si lo usas temprano en la semana, puedes subirte a una tendencia un par de días antes que el resto.",
                "r/TikTokMonetizing - Creador de nicho"
            )
        ],
        cons_list=[
            (
                "Falsas Promesas de 'Algoritmos Mágicos de Viralidad'",
                "Muchas de estas plataformas venden la ilusión de que un botón de IA puede predecir exactamente cuántas vistas tendrá un video, lo cual es técnicamente imposible debido a la naturaleza estocástica del algoritmo de TikTok.",
                "Te venden humo diciendo que su IA descifra el algoritmo de TikTok cuando en realidad solo te dan datos que puedes ver gratis en la app.",
                "r/smallbusiness - Dueño de marca e-commerce"
            ),
            (
                "Fricción Severa en la Experiencia de Usuario y Marketplace Saturado",
                "En r/UGCcreators, decenas de usuarios reportan aplicar a cientos de oportunidades sin recibir respuesta alguna, generando desconfianza en la seriedad de la plataforma.",
                "Apliqué a decenas de marcas en viral.app y nunca recibí respuesta de nadie. Se siente como una plataforma fantasma.",
                "r/UGCcreators - Creador de contenido UGC verificado"
            ),
            (
                "Diagnóstico Descriptivo pero No Prescriptivo",
                "Te dicen 'este video falló porque tuvo poca retención', pero no te dicen qué tomas exactas deberías haber filmado, cómo mejorar tu iluminación ni cómo estructurar tu gancho en los primeros 1.5 segundos.",
                "Te dicen lo que ya sabes (que el video no funcionó), pero no te dan la solución paso a paso para arreglarlo.",
                "r/marketing - Estratega de contenido"
            )
        ],
        pricing_breakdown=(
            "Planes de $29 a $79/mes. Gran volumen de bajas debido a que los creadores descubren que las métricas mostradas son "
            "accesibles mediante herramientas de analítica nativas gratuitas o bibliotecas públicas como TikTok Creative Center."
        ),
        auditflow_battlecard=(
            "AUDITFLOW es PRESCRIPTIVO, no solo descriptivo: Mientras viral.app y The Content Labs se limitan a mostrarte gráficos "
            "de lo que ya pasó, AUDITFLOW te dice exactamente qué hacer antes de apretar 'Grabar'. Su Guía Maestra detalla el guion hablado, "
            "el texto en pantalla y la acción física simultánea. Y al auditar un video, AUDITFLOW no hace promesas vacías de 'vistas mágicas': "
            "te entrega una rúbrica técnica cuantitativa (0 a 100) con una lista de tareas prioritarias para corregir encuadre, safe zones, audio y CTA."
        )
    )

    # =========================================================================
    # 6. ADROAST / ATRIA
    # =========================================================================
    build_exhaustive_pdf(
        filename="6_AdRoast_Atria_Analisis_Exhaustivo.pdf",
        title="Auditoría Exhaustiva: AdRoast & Atria",
        subtitle="Análisis Profundo de Mercado, Sentimiento en Reddit y Matriz Competitiva frente a AUDITFLOW",
        competitor_name="AdRoast / Atria (tryatria.com)",
        category="AI Creative Assistant, Ad Concept Roasting & Competitor Tracking",
        price_range="$49 a $149 USD/mes (a menudo ligado a volumen de ad spend)",
        subreddits="r/FacebookAds, r/DigitalMarketing, r/PPC, r/ecomcreatives",
        executive_summary=(
            "AdRoast y Atria son herramientas de reciente hornada diseñadas para estrategas creativos de Meta Ads. AdRoast se especializa "
            "en 'destrozar' o evaluar críticamente (roasting) conceptos de anuncios antes de gastar presupuesto en pauta, mientras que Atria "
            "combina una biblioteca masiva de anuncios con minería de reseñas de clientes (review mining) para redactar guiones. En Reddit "
            "son valoradas como asistentes de lluvia de ideas, pero Atria acumula serias quejas sobre cobros fantasmas, soporte al cliente "
            "inaccesible y extensiones de Chrome con fallos frecuentes."
        ),
        how_it_works=(
            "El usuario introduce el guion o sube el video del anuncio. AdRoast aplica una rúbrica de IA que evalúa la fuerza del gancho, "
            "la claridad de la propuesta de valor y la llamada a la acción, sugiriendo ángulos alternativos. Atria, por su parte, conecta la "
            "cuenta de Meta Ads para rastrear fatiga creativa y minar comentarios de Amazon/Shopify para generar conceptos de copy."
        ),
        pros_list=[
            (
                "Feedback Crítico para Evitar Puntos Ciegos Creativos",
                "El concepto de 'roast' ayuda a los equipos a salir de la cámara de eco interna y recibir críticas honestas sobre ganchos débiles antes de quemar presupuesto en ads.",
                "AdRoast es útil como un 'control de sensatez' rápido cuando llevas 8 horas redactando guiones y ya no sabes si lo que escribiste es bueno o ridículo.",
                "r/FacebookAds - Media Buyer independiente"
            ),
            (
                "Minería de Reseñas de Clientes para Encontrar Ángulos de Dolor",
                "Atria extrae dolores reales de clientes a partir de comentarios de tiendas online para alimentar los ganchos de los videos.",
                "La función de extraer objeciones de clientes en Atria acelera mucho la investigación para redactar briefs de video.",
                "r/DigitalMarketing - Creative Strategist"
            )
        ],
        cons_list=[
            (
                "Grave Problemática de Facturación y Cancelaciones en Atria",
                "En r/FacebookAds abundan advertencias de usuarios que continuaron recibiendo cargos en sus tarjetas tras haber cancelado formalmente la suscripción, con un equipo de soporte que no responde por semanas.",
                "Cuidado con la prueba gratis de Atria: cancelé antes de los 7 días y me cobraron el mes entero. Tuve que disputar el cargo con mi banco.",
                "r/FacebookAds - Queja recurrente de usuario verificado"
            ),
            (
                "Extensiones de Navegador Inestables y Errores Técnicos",
                "Usuarios reportan que la extensión de Chrome de Atria para guardar anuncios falla frecuentemente o ralentiza el navegador.",
                "La extensión se cuelga la mitad de las veces cuando intentas guardar videos largos de TikTok.",
                "r/DigitalMarketing - Operador de campañas"
            ),
            (
                "Foco Exclusivo en Pauta Paga (Paid Ads), Olvidando el Orgánico",
                "Ambas herramientas están obsesionadas con métricas de ROAS y CPA para Facebook Ads. No ofrecen soluciones para el creador orgánico de TikTok/Reels que necesita filmar productos con iluminación casera y smartphone.",
                "Si no estás gastando miles de dólares en anuncios de Meta, estas herramientas no tienen mucho sentido en tu flujo diario.",
                "r/PPC - Consultor publicitario"
            )
        ],
        pricing_breakdown=(
            "Planes entre $49 y $149/mes. "
            "Motivos clave de baja: problemas de soporte técnico, errores en extensiones y tarifas elevadas para equipos que solo "
            "necesitan evaluar unos pocos videos al mes."
        ),
        auditflow_battlecard=(
            "AUDITFLOW democratiza la Auditoría Crítica de Video con MÁXIMA ÉTICA Y PRECISIÓN MULTIMODAL: A diferencia de los problemas "
            "de facturación de Atria, AUDITFLOW es transparente, ágil y centrado en el usuario. Mientras AdRoast solo 'roastea' el texto "
            "del guion, AUDITFLOW audita el video REAL completo (video MP4 o URL pública): analiza visualmente si el producto está enfocado, "
            "si los textos respetan las safe zones de TikTok, si el audio está saturado y si el gancho retiene visualmente. Es el auditor integral "
            "tanto para contenido orgánico como para anuncios."
        )
    )

    # =========================================================================
    # 7. CREATIVEX / VIDMOB
    # =========================================================================
    build_exhaustive_pdf(
        filename="7_CreativeX_VidMob_Analisis_Exhaustivo.pdf",
        title="Auditoría Exhaustiva: CreativeX & VidMob",
        subtitle="Análisis Profundo de Mercado, Sentimiento en Reddit y Matriz Competitiva frente a AUDITFLOW",
        competitor_name="CreativeX / VidMob",
        category="Creative Quality Score (CQS) & Enterprise Content Intelligence",
        price_range="$10,000 a $50,000+ USD/año (Contratos corporativos anuales)",
        subreddits="r/marketing, r/advertising, r/PPC, r/SocialMediaMarketing",
        executive_summary=(
            "CreativeX y VidMob son los titanes corporativos de la inteligencia creativa. Trabajan con gigantes como Unilever, Nestlé "
            "o Heineken para auditar millones de activos publicitarios a escala global mediante su 'Creative Quality Score' (CQS). "
            "Verifican automáticamente directrices de marca, subtítulos accesibles, presencia de logo en primeros 3 segundos y safe zones. "
            "En Reddit prácticamente no existen reseñas de usuarios independientes porque operan exclusivamente bajo ventas corporativas "
            "(Enterprise): son herramientas inaccesibles para el 99% de los creadores y marcas medianas, requiriendo meses de implementación "
            "y contratos de decenas de miles de dólares."
        ),
        how_it_works=(
            "Se conectan mediante APIs a los servidores de agencias globales y servidores de Meta/Google/TikTok. Escanean automáticamente "
            "cada video renderizado por las agencias asociadas y verifican el cumplimiento de una rúbrica corporativa fija: presencia del producto "
            "en <2s, subtítulos para reproducción sin sonido, relación de aspecto 9:16 y ausencia de elementos tapados por botones. Si el video "
            "obtiene un CQS bajo, es rechazado antes de que se inviertan presupuestos millonarios en pauta."
        ),
        pros_list=[
            (
                "Estandarización Rigurosa a Escala Global",
                "Permite a un director global de marketing en Londres asegurarse de que 500 agencias en 40 países cumplan las mismas reglas mínimas de calidad de video.",
                "En corporaciones masivas evita que una agencia local lance un comercial millonario sin subtítulos o en formato horizontal para Instagram.",
                "r/advertising - Director de cuenta en agencia global"
            ),
            (
                "Correlación Demostrada con Eficiencia Publicitaria (ROAS)",
                "Estudios internos de CreativeX demuestran que los videos con alto Creative Quality Score generan mayor recordación de marca y menor costo por clic.",
                "El concepto de auditar la calidad creativa antes de pautar está matemáticamente validado en las grandes ligas.",
                "r/marketing - Analista de medios"
            )
        ],
        cons_list=[
            (
                "Barrera de Entrada Estratosférica: Prohibido para PyMEs y Creadores",
                "Exigen llamadas de ventas comerciales con ejecutivos de cuenta, demostraciones guiadas, contratos mínimos anuales de $15,000-$50,000 USD y procesos de integración técnica que tardan semanas.",
                "Ningún creador de TikTok, dueño de e-commerce o agencia pequeña puede contratar CreativeX. Es un club exclusivo de marcas Fortune 500.",
                "r/PPC - Discusión sobre software de análisis creativo"
            ),
            (
                "Reglas Rígidas que Asfixian la Creatividad Viral Orgánica",
                "Sus rúbricas fueron diseñadas para anuncios televisivos adaptados a digital. A menudo penalizan videos grabados con smartphone que parecen imperfectos o 'feos', cuando justamente ese formato 'lo-fi' y casero es el que mejor funciona en TikTok orgánico.",
                "Cumplir al 100% las directrices corporativas de VidMob a menudo da como resultado videos aburridos que parecen anuncios tradicionales y que nadie quiere ver.",
                "r/SocialMediaMarketing - Content Creator"
            ),
            (
                "Inutilidad en la Fase de Producción Temprana",
                "Solo evalúan el video cuando ya está finalizado. No ayudan a quien está solo en su habitación pensando qué decir frente a la cámara ni proporcionan guías de rodaje prácticas.",
                "Te dicen que tu video está reprobado, pero no te acompañaron en el rodaje para enseñarte cómo hacerlo bien.",
                "r/advertising - Productor audiovisual"
            )
        ],
        pricing_breakdown=(
            "Modelos Enterprise con contratos anuales de $12,000 a $60,000+ USD. Cero transparencia de precios en web. "
            "No existe modelo de autoservicio ni prueba gratuita."
        ),
        auditflow_battlecard=(
            "AUDITFLOW democratiza el 'Creative Quality Score' para el MUNDO REAL: AUDITFLOW toma la mejor premisa de CreativeX "
            "(auditar rigurosamente la calidad de retención, audio, safe zones y gancho antes de publicar) y la pone al alcance de CUALQUIER "
            "creador, agencia o marca de e-commerce por una suscripción accesible y autoservicio. Y a diferencia de CreativeX, AUDITFLOW "
            "comprende la cultura nativa de TikTok e Instagram (valorando la autenticidad del smartphone sobre el pulido corporativo aburrido) "
            "y guía al creador desde la foto del producto hasta el rodaje completo."
        )
    )

    # =========================================================================
    # 8. DOSSIER MAESTRO CONSOLIDADO
    # =========================================================================
    build_mega_summary_pdf()

def build_mega_summary_pdf():
    filepath = os.path.join(DEST_DIR, "Dossier_Maestro_7_Competidores_AuditFlow.pdf")
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        leftMargin=32,
        rightMargin=32,
        topMargin=32,
        bottomMargin=32
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'MegaTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=3
    )
    subtitle_style = ParagraphStyle(
        'MegaSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#475569'),
        spaceAfter=8
    )
    h2_style = ParagraphStyle(
        'MegaH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=7,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'MegaBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor('#334155')
    )
    th_style = ParagraphStyle(
        'MegaTH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white
    )
    td_bold = ParagraphStyle(
        'MegaTDBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#0F172A')
    )
    td_norm = ParagraphStyle(
        'MegaTDNorm',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.2,
        leading=9.5,
        textColor=colors.HexColor('#334155')
    )

    story = []
    story.append(Paragraph("Dossier Maestro: Los 7 Competidores Directos de AUDITFLOW", title_style))
    story.append(Paragraph("Investigación Exhaustiva de Mercado, Sentimiento en Reddit y Estrategia de Diferenciación Total", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4F46E5'), spaceBefore=0, spaceAfter=6))

    intro_text = (
        "Este documento consolida el estudio en profundidad de los 7 sistemas que compiten directa o indirectamente con <b>AUDITFLOW</b>. "
        "El análisis abarca desde herramientas de pre-producción (Foreplay, Creatify, Storyflow) hasta plataformas de auditoría y recorte "
        "(Opus Clip, viral.app, AdRoast, CreativeX). Los hallazgos confirman una tesis central: el mercado de creación de video con IA "
        "está fragmentado entre generadores de contenido falso que los usuarios rechazan, archivos pasivos de inspiración y herramientas "
        "corporativas inaccesibles. AUDITFLOW se posiciona de forma única uniendo la dirección activa de rodaje humano con la auditoría objetiva de calidad."
    )
    story.append(Paragraph(intro_text, body_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Gran Matriz Comparativa: Las 7 Herramientas frente a AUDITFLOW", h2_style))

    headers = [
        Paragraph("SISTEMA", th_style),
        Paragraph("CATEGORÍA", th_style),
        Paragraph("LO BUENO (REDDIT)", th_style),
        Paragraph("LO MALO (REDDIT)", th_style),
        Paragraph("POR QUÉ AUDITFLOW GANA", th_style)
    ]

    rows = [
        [
            Paragraph("<b>1. Foreplay.co</b>", td_bold),
            Paragraph("Ad Swipe-File & UGC Briefs", td_norm),
            Paragraph("Guarda anuncios antes de que Meta los borre. Buenas carpetas.", td_norm),
            Paragraph("Caro ($49-$99/m). Pasivo: no enseña a filmar ni audita tu video.", td_norm),
            Paragraph("Activo: crea la guía de tu propio producto y audita tu MP4 final.", td_norm)
        ],
        [
            Paragraph("<b>2. Creatify / CreateUGC</b>", td_bold),
            Paragraph("UGC Sintético & Avatares IA", td_norm),
            Paragraph("Rápido para testear 15 variantes baratas en dropshipping.", td_norm),
            Paragraph("Avatares falsos ('uncanny valley'), créditos abusivos y nulo engagement.", td_norm),
            Paragraph("Impulsa video humano auténtico con smartphone de alta conversión.", td_norm)
        ],
        [
            Paragraph("<b>3. Storyflow / Playcut</b>", td_bold),
            Paragraph("Shot-Lists & Beats de Cine", td_norm),
            Paragraph("Excelente para cineastas independientes y continuidad narrativa.", td_norm),
            Paragraph("Complejo y rígido; ignora el ritmo vertical y ganchos de TikTok.", td_norm),
            Paragraph("Shot-lists de 15 min pensados 100% para el algoritmo vertical.", td_norm)
        ],
        [
            Paragraph("<b>4. Opus Clip / Minvo</b>", td_bold),
            Paragraph("Repurposing & Virality Score", td_norm),
            Paragraph("Ahorra horas recortando podcasts largos a 9:16.", td_norm),
            Paragraph("Formato repetitivo. La IA es ciega a lo visual (solo lee transcript).", td_norm),
            Paragraph("Diseñado para producto original con visión multimodal (Gemini).", td_norm)
        ],
        [
            Paragraph("<b>5. viral.app / Content Labs</b>", td_bold),
            Paragraph("Auditoría & Tracking Viral", td_norm),
            Paragraph("Buenos gráficos de picos virales en competidores.", td_norm),
            Paragraph("Promesas vacías de viralidad mágica; Marketplace saturado.", td_norm),
            Paragraph("Prescriptivo: da guion exacto, iluminación y checklist técnico.", td_norm)
        ],
        [
            Paragraph("<b>6. AdRoast / Atria</b>", td_bold),
            Paragraph("AI Ad Roast & Research", td_norm),
            Paragraph("Buen 'roast' crítico de guiones; minería de quejas de clientes.", td_norm),
            Paragraph("Graves quejas de cobros fantasma; solo pensado para paid ads.", td_norm),
            Paragraph("Auditoría técnica real de archivo MP4 para orgánico y ads con ética.", td_norm)
        ],
        [
            Paragraph("<b>7. CreativeX / VidMob</b>", td_bold),
            Paragraph("Creative Quality Score (CQS)", td_norm),
            Paragraph("Estándar corporativo global para marcas como Unilever.", td_norm),
            Paragraph("Precios prohibitivos ($15k-$50k/año). Reglas de TV obsoletas.", td_norm),
            Paragraph("Democratiza el CQS para creadores y PyMEs en autoservicio accesible.", td_norm)
        ]
    ]

    table_data = [headers] + rows
    comp_table = Table(table_data, colWidths=[1.1*inch, 1.2*inch, 1.7*inch, 1.7*inch, 1.8*inch])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E293B')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
    ]))
    story.append(comp_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("Conclusión Estratégica: El 'Océano Azul' de AUDITFLOW", h2_style))
    conclusion_text = (
        "El análisis exhaustivo demuestra que los competidores obligan al usuario a elegir entre dos extremos fallidos: "
        "(1) <i>La flojera de la IA completa:</i> herramientas que generan avatares falsos que el público repudia (Creatify); o "
        "(2) <i>El archivo pasivo de datos:</i> herramientas que cobran $50 a $100 dólares al mes por mostrar anuncios o analíticas sin decirte cómo grabar (Foreplay, Atria).<br/><br/>"
        "<b>AUDITFLOW se apropia del centro exacto del mercado:</b> utiliza inteligencia artificial multimodal de vanguardia "
        "(Gemini Vision) para asumir el rol de un <b>Director Creativo de Rodaje</b> que instruye al ser humano a filmar con maestría "
        "(iluminación a 45°, encuadre macro/POV y ganchos de 0-3s), cerrando el círculo con un <b>Auditor Objetivo de Calidad (0-100)</b> "
        "que previene el fracaso del video antes de publicarlo. Este enfoque híbrido (IA inteligente + Producción humana real) es el formato "
        "ganador indiscutible para TikTok, Instagram Reels y YouTube Shorts."
    )
    
    p_box = Table([[Paragraph(conclusion_text, body_style)]], colWidths=[7.5*inch])
    p_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EEF2FF')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#C7D2FE')),
        ('LINELEFT', (0,0), (0,-1), 3.5, colors.HexColor('#4F46E5')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(p_box)

    doc.build(story)
    print(f"Generado exitosamente: {filepath}")

if __name__ == "__main__":
    generate_all_7()
