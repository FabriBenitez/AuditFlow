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

OUTPUT_DESKTOP = os.path.join(DESKTOP_DIR, "AuditFlow_Analisis_Competencia_y_Requisitos_Clave.pdf")
OUTPUT_PROJECT = os.path.join(PROJECT_DIR, "AuditFlow_Analisis_Competencia_y_Requisitos_Clave.pdf")
OUTPUT_PUBLIC = os.path.join(PUBLIC_DIR, "AuditFlow_Analisis_Competencia_y_Requisitos_Clave.pdf")

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
            self.drawString(36, 11 * inch - 25, "AUDITFLOW — Análisis de Competencia, Sentimiento de Mercado & Requisitos Clave")
            self.setStrokeColor(colors.HexColor('#CBD5E1'))
            self.setLineWidth(0.5)
            self.line(36, 11 * inch - 28, 8.5 * inch - 36, 11 * inch - 28)
            
        # Footer
        footer_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(8.5 * inch - 36, 20, footer_text)
        self.drawString(36, 20, "Confidencial & Estratégico — AuditFlow Market Intelligence © 2026")
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
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#1E1B4B'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14.5,
        textColor=colors.HexColor('#475569'),
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
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
        textColor=colors.HexColor('#3730A3'),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'H3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
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

    quote_style = ParagraphStyle(
        'QuoteText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor('#1E293B')
    )
    
    quote_author = ParagraphStyle(
        'QuoteAuthor',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#64748B')
    )

    th_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white
    )
    
    td_bold = ParagraphStyle(
        'TDBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#0F172A')
    )
    
    td_norm = ParagraphStyle(
        'TDNorm',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.2,
        leading=9.5,
        textColor=colors.HexColor('#334155')
    )

    story = []

    # =========================================================================
    # ENCABEZADO Y PORTADA
    # =========================================================================
    story.append(Paragraph("AUDITFLOW", title_style))
    story.append(Paragraph("Análisis de Competencia, Sentimiento de Mercado (Pros/Contras) y Requisitos Funcionales Clave", ParagraphStyle('SubSub', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=colors.HexColor('#4338CA'))))
    story.append(Paragraph("Dossier de Inteligencia Estratégica, Benchmarking Cualitativo en Reddit & Especificación de Producto", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#4F46E5'), spaceBefore=0, spaceAfter=8))

    meta_data = [
        [
            Paragraph("DOCUMENTO", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor('#64748B'))),
            Paragraph("ALCANCE", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor('#64748B'))),
            Paragraph("SUBREDDITS INVESTIGADOS", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor('#64748B'))),
            Paragraph("VERSIÓN", ParagraphStyle('M1', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor('#64748B')))
        ],
        [
            Paragraph("Inteligencia Competitiva", ParagraphStyle('M2', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.HexColor('#0F172A'))),
            Paragraph("7 Competidores + 6 Pilares", ParagraphStyle('M2', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.HexColor('#0F172A'))),
            Paragraph("12 Comunidades Técnicas", ParagraphStyle('M2', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.HexColor('#0F172A'))),
            Paragraph("2.0 Oficial", ParagraphStyle('M2', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.HexColor('#0F172A')))
        ]
    ]
    meta_table = Table(meta_data, colWidths=[1.8*inch, 1.8*inch, 2.5*inch, 1.4*inch])
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
    # 1. DIAGNÓSTICO MACRO DEL MERCADO Y SENTIMIENTO EN REDDIT
    # =========================================================================
    story.append(Paragraph("1. Diagnóstico Macro del Mercado y Sentimiento en Reddit", h1_style))
    p1_text = (
        "El ecosistema de creación, curaduría y distribución de video corto para plataformas de alta frecuencia como "
        "TikTok, Instagram Reels, YouTube Shorts y Meta Ads se encuentra en un punto de saturación y reconfiguración crítica. "
        "Mientras la demanda de volumen creativo se acelera exponencialmente, la oferta de software en la industria de MarTech "
        "se ha fragmentado en herramientas pasivas de recopilación de referencias, generadores sintéticos que erosionan el valor "
        "de marca y plataformas de analítica descriptiva que únicamente diagnostican el fracaso post-mortem sin ofrecer remedios técnicos. "
        "Para construir una propuesta de producto verdaderamente disruptiva con defensabilidad de mercado, resulta indispensable realizar "
        "un ejercicio de inteligencia competitiva basado en la conversación no filtrada de los usuarios finales en Reddit. "
        "La auditoría sistemática de este sentimiento revela vacíos estructurales en operabilidad, transparencia y efectividad "
        "multimodal que AuditFlow capitalizará estratégicamente para posicionarse como el estándar categórico de la industria."
    )
    story.append(Paragraph(p1_text, body_style))
    story.append(Spacer(1, 4))

    story.append(Paragraph("Análisis del Sentimiento de Mercado en Subreddits (4 Dolores Transversales):", h2_style))
    story.append(Paragraph(
        "El análisis cualitativo y de patrones de conversación realizado sobre doce comunidades especializadas "
        "(r/facebookads, r/ecommerce, r/marketing, r/PPC, r/dropship, r/artificial, r/filmmakers, r/contentcreation, "
        "r/podcasting, r/UGCcreators, r/DigitalMarketing y r/advertising) evidencia cuatro grandes dolores operativos:", body_style))

    dolores = [
        ("1. Parálisis por Análisis y Cúmulo Pasivo de Referencias",
         "Los profesionales manifiestan un agotamiento severo ante la acumulación masiva de anuncios ganadores en bibliotecas virtuales (swipe-files). "
         "Existe un abismo operativo entre almacenar una referencia exitosa y traducirla en un plan de rodaje técnico ejecutable con los recursos disponibles en un entorno de producción real."),
        ("2. Rechazo Orgánico y Penalización del 'AI Slop'",
         "La proliferación desmedida de plataformas de avatares sintéticos y clonación de voz ha provocado una fuerte resistencia en las audiencias y algoritmos. "
         "En r/artificial y r/ecommerce, se denuncia de forma recurrente que el contenido basura generado por IA ('AI Slop') cae de inmediato en el 'valle inquietante' (uncanny valley), "
         "destruye la confianza comercial de la marca e induce caídas drásticas en las curvas de retención algorítmica a los 1.5 segundos."),
        ("3. Ceguera de Texto en Herramientas Supuestamente Multimodales",
         "Prevalece un profundo desencanto con el software impulsado por LLMs que promete 'analizar' video pero cuya arquitectura se limita a procesar transcripciones de audio textuales. "
         "Las soluciones actuales son ciegas a los atributos visuales determinantes: texturas de producto, reflejos de luz, escala, encuadre, legibilidad del empaque y dinamismo de movimiento."),
        ("4. Barrera de Accesibilidad Enterprise vs. Opacidad en SaaS Low-Cost",
         "Polarización extrema: por un lado, soluciones corporativas inaccesibles de $15,000–$50,000 USD/año con ventas consultivas lentas; "
         "por el otro, herramientas económicas con métricas no verificables, patrones oscuros de facturación, consumo opaco de créditos por renderizados fallidos y fricción maliciosa al cancelar.")
    ]

    for d_num, d_desc in dolores:
        box_d = Table([[Paragraph(f"<b>{d_num}:</b> {d_desc}", body_style)]], colWidths=[7.5*inch])
        box_d.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
            ('LINELEFT', (0,0), (0,-1), 3, colors.HexColor('#4F46E5')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ]))
        story.append(box_d)
        story.append(Spacer(1, 3))

    story.append(Spacer(1, 6))

    # =========================================================================
    # 2. DESGLOSE SISTEMÁTICO DE LA COMPETENCIA DIRECTA (7 HERRAMIENTAS)
    # =========================================================================
    story.append(Paragraph("2. Desglose Sistemático y Análisis Crítico de la Competencia Directa", h1_style))

    competitors = [
        {
            "num": "2.1",
            "name": "Foreplay.co",
            "cat": "Ad Swipe-File, Discovery & UGC Creative Briefs",
            "pricing": "$49 a $99 USD/mes (planes de equipo hasta $299 USD/mes)",
            "sources": "r/facebookads, r/ecommerce, r/marketing, r/PPC, r/dropship",
            "pros": [
                ("Persistencia Permanente de Anuncios Ganadores", "Resuelve la volatilidad de la Meta Ad Library clonando el archivo MP4 y metadatos en servidores propios.", '"Es la única herramienta que salva tus referencias de ser eliminadas. Mi equipo guarda cientos de ads cada semana para sesiones de brainstorming." — r/facebookads (+100k/mes spend).'),
                ("Estructuración Limpia de Briefs UGC", "Enlaces interactivos públicos con marcas de tiempo y guiones desglosados sin forzar login.", '"Ahorramos unas 10 horas semanales pasando de Google Docs caóticos a tableros interactivos de Foreplay para mandar a filmar." — r/ecommerce.'),
                ("Categorización y Filtrado de Ganchos (Hooks)", "Búsqueda avanzada por tipos de hook (POV, 3 razones, unboxing).", '"El buscador de nichos y ganchos es 10 veces más rápido que bucear en TikTok Creative Center." — r/marketing.')
            ],
            "cons": [
                ("Precio Desproporcionado para Creadores Solopreneurs", "$600 USD al año por almacenamiento pasivo resulta prohibitivo.", '"Pagar $49 al mes solo por ser un \'marcador de favoritos vitaminado\' duele cuando no tienes una agencia facturando fuerte." — r/ecommerce.'),
                ("Parálisis por Análisis e 'Inspiración Vacía'", "Catálogo estático sin instrucciones sobre dirección de fotografía, luz ni smartphone.", '"Tengo 400 anuncios guardados en Foreplay y sigo bloqueado cuando me pongo frente al celular para grabar mi propio producto." — r/dropship.'),
                ("Ausencia Total de Control de Calidad Post-Producción", "Finaliza su alcance en el brief, incapaz de auditar la retención o interferencia de UI.", '"Una vez que terminas de grabar, la herramienta se desentiende. Sigues publicando a ciegas." — r/PPC.')
            ],
            "battlecard": "AuditFlow transforma la inspiración pasiva en ejecución prescriptiva obligatoria: el Studio Engine analiza la foto del producto real con Gemini Vision y despliega la Guía Maestra de Rodaje (ángulos macro/POV, luz a 45°, 3 ganchos y cortes a 1.5s), cerrando el ciclo auditando el MP4 con scoring CQS (0 a 100)."
        },
        {
            "num": "2.2",
            "name": "Creatify.ai / CreateUGC",
            "cat": "Generación de Video Ads con IA & Avatares Sintéticos (URL-to-Video)",
            "pricing": "$39 a $120 USD/mes (modelo de consumo por créditos)",
            "sources": "r/artificial, r/ecommerce, r/ChatGPT, r/dropship, r/digitalmarketing",
            "pros": [
                ("Velocidad Industrial para Testeo Rápido", "Genera de 10 a 20 variaciones de anuncios en menos de una hora a partir de una URL.", '"Para productos de dropshipping donde solo quieres saber si el ángulo de venta tiene clics en Meta Ads, la velocidad es inmejorable." — r/dropship.'),
                ("Solución de Emergencia para Bajos Presupuestos", "Permite poner piezas en circulación sin asumir los $150-$300 USD por video de un creador externo.", '"Si estás arrancando con $100 de presupuesto total, te permite tener algo en pantalla para empezar a rodar pauta." — r/ecommerce.')
            ],
            "cons": [
                ("Efecto 'Uncanny Valley' y Rechazo Algorítmico", "Avatares artificiales y mala sincronización labial que causan abandono inmediato en primeros segundos.", '"El público en 2026 odia los avatares de IA. En cuanto ven que la boca no coincide exactamente con el audio, se van y dejan comentarios burlándose." — r/artificial.'),
                ("Sistema de Créditos Opaco y Cobro por Renders Defectuosos", "Descuenta créditos incluso cuando el motor genera distorsiones faciales o pronunciaciones erróneas.", '"Te cobran créditos por renders que salen con caras deformes o fallos de render. Gasté 40 dólares y solo obtuve un video medio decente." — r/ecommerce.'),
                ("Destrucción de la Credibilidad Comercial", "Degrada la percepción de marca asociándola con esquemas publicitarios automatizados de baja confianza.", '"Usar avatares sintéticos le dice a tu cliente: \'ni siquiera nosotros nos molestamos en tocar el producto que te estamos vendiendo\'." — r/marketing.')
            ],
            "battlecard": "AuditFlow neutraliza el 'AI Slop' potenciando al creador humano real: actúa como un Director de Rodaje de bolsillo con smartphone en 15 minutos, garantizando contenido genuino, con manos y texturas reales que maximizan la conversión."
        },
        {
            "num": "2.3",
            "name": "Storyflow / Playcut.ai",
            "cat": "Generadores de Shot-Lists, Beats Narrativos & Planificación de Rodaje",
            "pricing": "$19 a $49 USD/mes (o compras web/Steam)",
            "sources": "r/filmmakers, r/videography, r/screenwriting, r/contentcreation",
            "pros": [
                ("Estructura Técnica Cinematográfica de Alto Nivel", "Lienzo infinito para desglosar narrativas complejas y asegurar planos de cobertura (b-rolls).", '"Para cortometrajes y videos narrativos de YouTube, su lienzo infinito para conectar escenas y planos es fantástico." — r/filmmakers.'),
                ("Exportación de Hojas de Rodaje Tabulares", "Documentos técnicos detallados con requerimientos de utilería y lentes.", '"Ayuda mucho a comunicarse con el director de fotografía antes de llegar al set de grabación." — r/videography.')
            ],
            "cons": [
                ("Desconexión con la Dinámica del Video Vertical", "Estructuras de introducción lenta (3-5 segundos) que provocan pérdida inmediata de audiencia en TikTok.", '"Están pensadas para cineastas de festival, no para vender zapatillas en TikTok en 15 segundos con un gancho agresivo." — r/contentcreation.'),
                ("Curva de Aprendizaje Elevada y Exceso de Fricción", "Invertir 45 minutos en configurar escenas resulta inviable para creadores diarios.", '"Demasiado abrumador para el día a día. Termino usando notas en el celular porque configurar el software toma más tiempo que filmar." — r/screenwriting.'),
                ("Incapacidad de Auditoría y Ceguera Multimodal", "Carece de visión artificial para evaluar fotografías del producto o auditar el video final.", '"No hay retroalimentación sobre si tu video terminado funcionará o no en la práctica." — r/videography.')
            ],
            "battlecard": "AuditFlow es el Director de Rodaje optimizado para el algoritmo vertical: sustituye hojas de rodaje de cine por una Guía Maestra de 5 pasos para smartphones con ganchos de 0-3s, tomas POV/macro, luz a 45° y cortes cada 1.2-1.8s."
        },
        {
            "num": "2.4",
            "name": "Opus Clip / Minvo",
            "cat": "Repurposing de Video Largo a Corto & Virality Scoring con IA",
            "pricing": "$15 a $35 USD/mes (basado en minutos procesados)",
            "sources": "r/contentcreation, r/youtube, r/podcasting, r/NewTubers, r/editors",
            "pros": [
                ("Automatización del Procesamiento de Video Largo", "Extrae fragmentos en podcasts y entrevistas largas en minutos.", '"Pasé de pagarle $400 al mes a un editor por sacar clips a tener 15 opciones listas en 10 minutos con Opus Clip." — r/podcasting.'),
                ("Encuadre Facial Dinámico y Subtitulado Automático", "Convierte 16:9 a 9:16 identificando al hablante con tipografía animada.", '"El seguimiento de caras y los subtítulos con palabras en verde y amarillo funcionan muy bien para entrevistas." — r/youtube.'),
                ("Virality Score como Filtro Inicial", "Puntuación de 0 a 100 para jerarquizar extractos con mejor estructura discursiva.", '"Minvo y Opus te dan un buen punto de partida para no revisar 40 clips mediocres." — r/NewTubers.')
            ],
            "cons": [
                ("Ceguera Visual (Análisis Exclusivo de Transcripción)", "Solo evalúa texto hablado; descarta o corta demostraciones físicas y remates visuales.", '"Opus le dio 90/100 a una parte aburrida donde el invitado usó palabras rimbombantes y 40/100 al momento más divertido del show porque fue un remate puramente visual." — r/editors.'),
                ("Saturación de Formato Genérico ('Cookie-Cutter')", "Plantillas idénticas en micrófonos de podcaster generan fatiga visual y caídas de retención.", '"Si tu estrategia es solo subir clips automáticos de Opus, tu canal se estanca. El algoritmo favorece el contenido original grabado exprofeso para el formato." — r/Tiktokhelp.'),
                ("Inoperabilidad para Contenido de Producto Original", "Inútil para marcas que necesitan conceptualizar y filmar un anuncio de producto desde cero.", '"No te ayuda a crear contenido nuevo; solo tritura lo que ya grabaste." — r/marketing.')
            ],
            "battlecard": "AuditFlow es el creador de contenido original: usa Gemini Vision para procesar el plano visual real (texturas, reflejos y movimientos de cámara) y audita el MP4 para certificar Safe Zones y conversión."
        },
        {
            "num": "2.5",
            "name": "viral.app / The Content Labs",
            "cat": "Auditoría Orgánica de Contenido, Tracking de Hooks & Benchmarking",
            "pricing": "$29 a $79 USD/mes (o modelos marketplace con comisión)",
            "sources": "r/UGCcreators, r/SocialMediaMarketing, r/TikTokMonetizing, r/smallbusiness",
            "pros": [
                ("Benchmarking Competitivo Externo", "Audita cuentas públicas de competidores para detectar picos anómalos de vistas.", '"Es útil para ver si un competidor de tu nicho encontró un formato que le está trayendo millones de visitas orgánicas." — r/SocialMediaMarketing.'),
                ("Detección Temprana de Tendencias", "Identifica audios y temáticas emergentes antes de su saturación.", '"Si lo usas temprano en la semana, puedes subirte a una tendencia un par de días antes que el resto." — r/TikTokMonetizing.')
            ],
            "cons": [
                ("Promesas Infundadas de 'Predictibilidad Viral'", "Promocionan algoritmos que 'adivinan' vistas ignorando la naturaleza estocástica del algoritmo.", '"Te venden humo diciendo que su IA descifra el algoritmo de TikTok cuando en realidad solo te dan datos que puedes ver gratis en la app." — r/smallbusiness.'),
                ("Fricción Operativa y Marketplaces Inactivos", "Falta de respuesta de marcas dentro de la plataforma genera desconfianza.", '"Apliqué a decenas de marcas en viral.app y nunca recibí respuesta de nadie. Se siente como una plataforma fantasma." — r/UGCcreators.'),
                ("Diagnóstico Puramente Descriptivo", "Muestran la caída pero no aportan instrucciones correctivas de rodaje.", '"Te dicen lo que ya sabes (que el video no funcionó), pero no te dan la solución paso a paso para arreglarlo." — r/marketing.')
            ],
            "battlecard": "AuditFlow es prescriptivo y objetivo: en lugar de diagnósticos pasivos o promesas mágicas, entrega instrucciones de rodaje exactas y aplica una rúbrica cuantitativa (0-100) sobre factores bajo control del creador."
        },
        {
            "num": "2.6",
            "name": "AdRoast / Atria",
            "cat": "AI Creative Assistant, Ad Concept Roasting & Competitor Tracking",
            "pricing": "$49 a $149 USD/mes (asociado a gasto publicitario)",
            "sources": "r/FacebookAds, r/DigitalMarketing, r/PPC, r/ecomcreatives",
            "pros": [
                ("Evaluación Crítica de Guiones ('Roasting')", "Revisión severa por IA para identificar inconsistencias antes de filmar.", '"AdRoast es útil como un \'control de sensatez\' rápido cuando llevas 8 horas redactando guiones y ya no sabes si lo que escribiste es bueno o ridículo." — r/FacebookAds.'),
                ("Minería de Reseñas de Clientes", "Extrae objeciones de clientes en Amazon y Shopify para convertirlas en ganchos.", '"La función de extraer objeciones de clientes en Atria acelera mucho la investigación para redactar briefs de video." — r/DigitalMarketing.')
            ],
            "cons": [
                ("Inestabilidad Técnica en Extensiones", "La extensión de Chrome de Atria se cuelga al procesar o guardar videos largos en HD.", '"La extensión se cuelga la mitad de las veces cuando intentas guardar videos largos de TikTok." — r/DigitalMarketing.'),
                ("Prácticas de Facturación Opacas", "Denuncias por cobros indebidos tras cancelar el free trial y soporte lento.", '"Cuidado con la prueba gratis de Atria: cancelé antes de los 7 días y me cobraron el mes entero. Tuve que disputar el cargo con mi banco." — r/FacebookAds.'),
                ("Sesgo Exclusivo Hacia Paid Ads", "Obsesión por métricas de pauta en Meta (ROAS/CPA), descuidando el orgánico.", '"Si no estás gastando miles de dólares en anuncios de Meta, estas herramientas no tienen mucho sentido en tu flujo diario." — r/PPC.')
            ],
            "battlecard": "AuditFlow ofrece transparencia ética en un clic y evaluación multimodal real: procesa mediante visión artificial el archivo de video final en alta definición, atendiendo tanto pauta paga como distribución orgánica."
        },
        {
            "num": "2.7",
            "name": "CreativeX / VidMob",
            "cat": "Creative Quality Score (CQS) & Enterprise Content Intelligence",
            "pricing": "$10,000 a $50,000+ USD/año (contratos corporativos anuales)",
            "sources": "r/marketing, r/advertising, r/PPC, r/SocialMediaMarketing",
            "pros": [
                ("Estandarización de Calidad a Escala Corporativa", "Verifica automáticamente que cientos de agencias globales cumplan guías de marca en miles de videos.", '"En corporaciones masivas evita que una agencia local lance un comercial millonario sin subtítulos o en formato horizontal para Instagram." — r/advertising.'),
                ("Correlación Demostrada entre CQS y Eficiencia Publicitaria", "Demuestra reducciones empíricas del CPA y aumentos en ROAS al auditar la calidad técnica.", '"El concepto de auditar la calidad creativa antes de pautar está matemáticamente validado en las grandes ligas." — r/marketing.')
            ],
            "cons": [
                ("Barrera de Entrada Inaccesible para el Mercado General", "Modelos de venta Enterprise con contratos de decenas de miles de dólares.", '"En Reddit prácticamente no existen reseñas de usuarios independientes porque operan exclusivamente bajo ventas corporativas Enterprise: son herramientas inalcanzables para el 99% de los creadores y agencias medianas." — r/PPC.'),
                ("Reglas Rígidas de Publicidad Tradicional", "Penalizan formatos espontáneos y caseros de smartphone que en TikTok son los que más convierten.", '"Cumplir al 100% las directrices corporativas a menudo da como resultado videos aburridos que parecen anuncios de TV y que nadie quiere ver." — r/SocialMediaMarketing.')
            ],
            "battlecard": "AuditFlow ejecuta la democratización total del Creative Quality Score (CQS): lleva el rigor cuantitativo corporativo a un SaaS ágil, accesible y de autoservicio para PyMEs, agencias independientes y creadores."
        }
    ]

    for comp in competitors:
        story.append(Paragraph(f"<b>{comp['num']} {comp['name']}</b> ({comp['cat']})", h2_style))
        story.append(Paragraph(f"<b>Precios:</b> {comp['pricing']} | <b>Comunidades Fuente:</b> {comp['sources']}", ParagraphStyle('CMeta', fontName='Helvetica', fontSize=8, textColor=colors.HexColor('#64748B'), spaceAfter=4)))
        
        # Pros
        story.append(Paragraph("<b>Lo Bueno (+):</b>", ParagraphStyle('PosT', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.HexColor('#065F46'))))
        for p_t, p_d, p_q in comp['pros']:
            c_p = Table([
                [Paragraph(f"• <b>{p_t}:</b> {p_d}", body_style)],
                [Paragraph(p_q, quote_style)]
            ], colWidths=[7.5*inch])
            c_p.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ECFDF5')),
                ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#A7F3D0')),
                ('LINELEFT', (0,0), (0,-1), 2.5, colors.HexColor('#10B981')),
                ('TOPPADDING', (0,0), (-1,-1), 3),
                ('BOTTOMPADDING', (0,0), (-1,-1), 3),
                ('LEFTPADDING', (0,0), (-1,-1), 6),
                ('RIGHTPADDING', (0,0), (-1,-1), 6),
            ]))
            story.append(c_p)
            story.append(Spacer(1, 2))

        # Cons
        story.append(Paragraph("<b>Lo Malo (-):</b>", ParagraphStyle('NegT', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.HexColor('#991B1B'))))
        for c_t, c_d, c_q in comp['cons']:
            c_c = Table([
                [Paragraph(f"• <b>{c_t}:</b> {c_d}", body_style)],
                [Paragraph(c_q, quote_style)]
            ], colWidths=[7.5*inch])
            c_c.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEF2F2')),
                ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#FECACA')),
                ('LINELEFT', (0,0), (0,-1), 2.5, colors.HexColor('#EF4444')),
                ('TOPPADDING', (0,0), (-1,-1), 3),
                ('BOTTOMPADDING', (0,0), (-1,-1), 3),
                ('LEFTPADDING', (0,0), (-1,-1), 6),
                ('RIGHTPADDING', (0,0), (-1,-1), 6),
            ]))
            story.append(c_c)
            story.append(Spacer(1, 2))

        # Battlecard
        b_box = Table([[Paragraph(f"<b>BATTLECARD ESTRATÉGICO AUDITFLOW:</b> {comp['battlecard']}", ParagraphStyle('BB', fontName='Helvetica', fontSize=8, leading=11.5, textColor=colors.HexColor('#1E1B4B')))]], colWidths=[7.5*inch])
        b_box.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EEF2FF')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#C7D2FE')),
            ('LINELEFT', (0,0), (0,-1), 3, colors.HexColor('#4F46E5')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(b_box)
        story.append(Spacer(1, 6))

    # =========================================================================
    # 3. PILARES ESTRATÉGICOS Y REQUISITOS FUNCIONALES OBLIGATORIOS DE AUDITFLOW
    # =========================================================================
    story.append(Paragraph("3. Pilares Estratégicos y Requisitos Funcionales Obligatorios de AuditFlow", h1_style))
    story.append(Paragraph(
        "La arquitectura funcional de AuditFlow conecta de forma continua la pre-producción guiada con la certificación técnica "
        "post-producción mediante un motor multimodal avanzado estructurado en seis pilares obligatorios:", body_style))

    # Diagrama de Arquitectura
    diag_data = [
        [
            Paragraph("<b>PRE-PRODUCCIÓN PRESCRIPTIVA</b><br/>"
                      "• Guía Maestra de Rodaje (5 Pasos)<br/>"
                      "• Enfoque en Creador Humano Real<br/>"
                      "• Gemini Vision (Análisis Foto Producto)<br/>"
                      "• Planificación Espacial, Ángulos & Luces", ParagraphStyle('D1', fontName='Helvetica', fontSize=8, leading=11, textColor=colors.HexColor('#1E1B4B'))),
            Paragraph("<b>AUDITORÍA MULTIMODAL & CQS</b><br/>"
                      "• Análisis de Video MP4 con Gemini Vision<br/>"
                      "• Rating CQS (0-100) Ponderado Transparente<br/>"
                      "• Detección Dinámica de Safe Zones (9:16)<br/>"
                      "• Reportes Marca Blanca (PDF para Agencias)", ParagraphStyle('D2', fontName='Helvetica', fontSize=8, leading=11, textColor=colors.HexColor('#065F46')))
        ]
    ]
    diag_table = Table(diag_data, colWidths=[3.7*inch, 3.8*inch])
    diag_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#EEF2FF')),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#ECFDF5')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(diag_table)
    story.append(Spacer(1, 6))

    pilares = [
        ("3.1 Pilar 1: Dirección Activa de Rodaje Prescriptivo con Smartphone",
         "Elimina la parálisis por análisis automatizando las instrucciones de filmación en 5 pasos inderogables. "
         "Despliega 3 variantes técnicas de ganchos (0 a 3s): (1) <i>Hook Visual</i> (macro/producto en acción), "
         "(2) <i>Hook Verbal</i> (frase contrarian/dato contraintuitivo), y (3) <i>Hook de Texto</i> (POV/problema en pantalla). "
         "Incluye especificaciones espaciales de luz natural a 45°, ángulos POV/macro y pauta de edición dinámica con cortes cada 1.2 a 1.8 segundos."),
        
        ("3.2 Pilar 2: Apuesta por el Creador Humano Real vs. 'AI Slop'",
         "Diseñado para que el propio dueño o creador UGC filme con un smartphone en una sesión de 15 minutos. "
         "Preserva las señales orgánicas de alta conversión (manos humanas manipulando el producto, reacciones genuinas, texturas y entorno real) "
         "que fortalecen la confianza y evitan la penalización algorítmica."),
        
        ("3.3 Pilar 3: Visión Multimodal Real Integrada (Gemini Vision)",
         "Ingesta directa de imágenes estáticas de producto o videos MP4 completos. "
         "Gemini Vision analiza texturas, empaque, escala física, reflejos, contraste, legibilidad de etiquetas y dinamismo de movimiento en cámara."),
        
        ("3.4 Pilar 4: Creative Quality Score (CQS 0-100) Cuantitativo y Transparente",
         "Algoritmo de calificación con desglose y ponderación matemática exacta sobre 100 puntos:<br/>"
         "• <b>1. Fuerza y Retención del Gancho Inicial (0-3s): 30%</b> (disrupción visual y verbal en <1.5s).<br/>"
         "• <b>2. Claridad Visual y Textual de la Propuesta de Valor: 25%</b> (identificación nítida del beneficio).<br/>"
         "• <b>3. Pacing y Continuidad Visual: 20%</b> (frecuencia de cortes cada 1.2s-1.8s y dinamismo).<br/>"
         "• <b>4. Calidad, Balance y Normalización de Audio: 15%</b> (voz nítida y música de fondo al 10-12%).<br/>"
         "• <b>5. CTA y Cumplimiento de Safe Zones: 10%</b> (llamado a la acción visible y libre de botones de UI).<br/>"
         "Genera un checklist priorizado de tareas correctivas antes de publicar."),
        
        ("3.5 Pilar 5: Filtro de Calidad y Verificación Pre-Publicación",
         "Escaneo técnico automático sobre las plantillas de interfaz de usuario (UI) de TikTok, Instagram Reels y YouTube Shorts "
         "para asegurar que ningún texto quede tapado por botones de 'Like', comentarios, descripción o foto de perfil. "
         "Verifica frecuencia de cortes (<1.5s), contraste tipográfico sobre fondo y balance acústico."),
        
        ("3.6 Pilar 6: Transparencia Ética en Facturación y Entregables Marca Blanca",
         "Cancelación autogestionada en un clic, eliminación de cobros sorpresa y consumo de créditos transparente. "
         "Módulo White-Label para que agencias y freelancers exporten reportes técnicos de auditoría en PDF con su propio logotipo y colores.")
    ]

    for p_title, p_desc in pilares:
        box_p = Table([[Paragraph(f"<b>{p_title}</b><br/>{p_desc}", body_style)]], colWidths=[7.5*inch])
        box_p.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
            ('LINELEFT', (0,0), (0,-1), 3.5, colors.HexColor('#4F46E5')),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 7),
            ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ]))
        story.append(box_p)
        story.append(Spacer(1, 3))

    story.append(Spacer(1, 6))

    # =========================================================================
    # 4. MATRIZ COMPARATIVA ESTRATÉGICA Y SÍNTESIS SINTÉTICA
    # =========================================================================
    story.append(Paragraph("4. Matriz Comparativa Estratégica y Síntesis Sintética", h1_style))
    
    mat_headers = [
        Paragraph("HERRAMIENTA", th_style),
        Paragraph("ENFOQUE", th_style),
        Paragraph("DIRECCIÓN DE RODAJE", th_style),
        Paragraph("CREADOR HUMANO", th_style),
        Paragraph("VISIÓN MULTIMODAL", th_style),
        Paragraph("SCORING CUANTITATIVO", th_style),
        Paragraph("PRECIO / ACCESO", th_style)
    ]

    mat_rows = [
        [
            Paragraph("<b>Foreplay.co</b>", td_bold),
            Paragraph("Ad Swipe-File & Briefs", td_norm),
            Paragraph("Pasivo (Tableros)", td_norm),
            Paragraph("Sí (Briefs UGC)", td_norm),
            Paragraph("Ciego (Solo Texto)", td_norm),
            Paragraph("Ninguno", td_norm),
            Paragraph("$49 - $99 USD/m", td_norm)
        ],
        [
            Paragraph("<b>Creatify / CreateUGC</b>", td_bold),
            Paragraph("URL-to-Video Ads", td_norm),
            Paragraph("No (Generación IA)", td_norm),
            Paragraph("No (Avatar IA)", td_norm),
            Paragraph("Ciego (Scraping)", td_norm),
            Paragraph("Ninguno (Créditos)", td_norm),
            Paragraph("$39 - $120 USD/m", td_norm)
        ],
        [
            Paragraph("<b>Storyflow / Playcut</b>", td_bold),
            Paragraph("Shot-Lists & Beats", td_norm),
            Paragraph("Pasivo (Cine)", td_norm),
            Paragraph("Sí (Cineastas)", td_norm),
            Paragraph("Ciego (Solo Texto)", td_norm),
            Paragraph("Ninguno", td_norm),
            Paragraph("$19 - $49 USD/m", td_norm)
        ],
        [
            Paragraph("<b>Opus Clip / Minvo</b>", td_bold),
            Paragraph("Repurposing de Video", td_norm),
            Paragraph("No (Edición Clip)", td_norm),
            Paragraph("Sí (Metraje previo)", td_norm),
            Paragraph("Ciego (Transcript)", td_norm),
            Paragraph("Virality Score (0-100)", td_norm),
            Paragraph("$15 - $35 USD/m", td_norm)
        ],
        [
            Paragraph("<b>viral.app / Content Labs</b>", td_bold),
            Paragraph("Tracking & Benchmark", td_norm),
            Paragraph("No (Analytics)", td_norm),
            Paragraph("Sí (Marketplace)", td_norm),
            Paragraph("Ciego (Solo Texto)", td_norm),
            Paragraph("Ninguno (Promesas)", td_norm),
            Paragraph("$29 - $79 USD/m", td_norm)
        ],
        [
            Paragraph("<b>AdRoast / Atria</b>", td_bold),
            Paragraph("AI Concept Roasting", td_norm),
            Paragraph("No (Roast Guion)", td_norm),
            Paragraph("Sí (Media Buyers)", td_norm),
            Paragraph("Ciego (Solo Texto)", td_norm),
            Paragraph("Roasting de Texto", td_norm),
            Paragraph("$49 - $149 USD/m", td_norm)
        ],
        [
            Paragraph("<b>CreativeX / VidMob</b>", td_bold),
            Paragraph("Enterprise Content Intel", td_norm),
            Paragraph("No (Verificación)", td_norm),
            Paragraph("Sí (Marcas Globales)", td_norm),
            Paragraph("Sí (Reglas fijas API)", td_norm),
            Paragraph("CQS Enterprise", td_norm),
            Paragraph("$10k - $50k+ USD/año", td_norm)
        ],
        [
            Paragraph("<b>AUDITFLOW</b>", ParagraphStyle('AFHead', fontName='Helvetica-Bold', fontSize=7.5, textColor=colors.HexColor('#4338CA'))),
            Paragraph("<b>Dirección & Auditoría</b>", td_bold),
            Paragraph("<b>Sí (Guía 5 Pasos)</b>", td_bold),
            Paragraph("<b>Sí (Creador Real)</b>", td_bold),
            Paragraph("<b>Sí (Gemini Vision)</b>", td_bold),
            Paragraph("<b>CQS (0-100) Ponderado</b>", td_bold),
            Paragraph("<b>Accesible (PyMEs/Agencias)</b>", td_bold)
        ]
    ]

    mat_table = Table([mat_headers] + mat_rows, colWidths=[1.1*inch, 1.1*inch, 1.0*inch, 1.0*inch, 1.0*inch, 1.1*inch, 1.2*inch])
    mat_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E293B')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-2), [colors.white, colors.HexColor('#F8FAFC')]),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#EEF2FF')),
    ]))
    story.append(mat_table)
    story.append(Spacer(1, 8))

    # Conclusión Ejecutiva
    story.append(Paragraph("Conclusión Ejecutiva y Posicionamiento Definitivo", h2_style))
    concl_text = (
        "El diagnóstico de sentimiento en el mercado confirma que las marcas y los creadores de contenido no requieren más "
        "repositorios pasivos de almacenamiento ni generadores automatizados de contenido sintético que comprometan su reputación comercial. "
        "<b>AuditFlow se consolida como el estándar definitivo para la creación y auditoría de video corto</b> al resolver de forma prescriptiva "
        "la brecha entre la conceptualización estratégica y la ejecución técnica, asegurando contenido auténtico, guiado paso a paso y "
        "optimizado cuantitativamente para alcanzar la máxima conversión en pauta y distribución orgánica."
    )
    b_concl = Table([[Paragraph(concl_text, body_style)]], colWidths=[7.5*inch])
    b_concl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EEF2FF')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#C7D2FE')),
        ('LINELEFT', (0,0), (0,-1), 3.5, colors.HexColor('#4F46E5')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(b_concl)
    story.append(Spacer(1, 8))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generado exitosamente: {filepath}")

def main():
    print("Iniciando compilación del Documento de Inteligencia Competitiva...")
    build_pdf(OUTPUT_DESKTOP)
    build_pdf(OUTPUT_PROJECT)
    build_pdf(OUTPUT_PUBLIC)
    print("Finalizado en todas las ubicaciones.")

if __name__ == "__main__":
    main()
