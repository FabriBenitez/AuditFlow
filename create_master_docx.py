import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    """Establece color de fondo de una celda de tabla."""
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Establece padding interno en una celda."""
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def add_callout(doc, text, title="NOTA ESTRATÉGICA", color_hex="7C3AED", bg_hex="F3E8FF"):
    """Crea una caja de llamada destacada."""
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_hex)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    tcPr = cell._element.get_or_add_tcPr()
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none"/>
            <w:left w:val="single" w:sz="36" w:space="0" w:color="{color_hex}"/>
            <w:bottom w:val="none"/>
            <w:right w:val="none"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    
    r_title = p.add_run(f"📌 {title}: ")
    r_title.bold = True
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(10.5)
    r_title.font.color.rgb = RGBColor.from_string(color_hex)
    
    r_text = p.add_run(text)
    r_text.font.name = "Calibri"
    r_text.font.size = Pt(10)
    r_text.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def style_heading_1(p, text):
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(18)
    run.bold = True
    run.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A) # Slate 900

def style_heading_2(p, text):
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(14)
    run.bold = True
    run.font.color.rgb = RGBColor(0x43, 0x38, 0xCA) # Indigo 700

def style_heading_3(p, text):
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(12)
    run.bold = True
    run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B) # Slate 800

def add_body_p(doc, text, bold_prefix=None, space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.bold = True
        r_pre.font.name = "Calibri"
        r_pre.font.size = Pt(11)
        r_pre.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
    r = p.add_run(text)
    r.font.name = "Calibri"
    r.font.size = Pt(11)
    r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
    return p

def add_bullet_p(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.bold = True
        r_pre.font.name = "Calibri"
        r_pre.font.size = Pt(11)
        r_pre.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
    r = p.add_run(text)
    r.font.name = "Calibri"
    r.font.size = Pt(11)
    r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
    return p

def build_document():
    doc = docx.Document()
    
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
    
    # ==========================================
    # PORTADA / ENCABEZADO PRINCIPAL
    # ==========================================
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(10)
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("AUDITFLOW")
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(28)
    r_title.bold = True
    r_title.font.color.rgb = RGBColor(0x43, 0x38, 0xCA) # Indigo
    
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(12)
    r_sub = p_sub.add_run("Plan Maestro de Arquitectura, IA, Historias de Usuario & Casos de Uso")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(14)
    r_sub.font.color.rgb = RGBColor(0x64, 0x74, 0x8B) # Slate 500
    
    # Meta información en cajita
    tbl_meta = doc.add_table(rows=1, cols=3)
    tbl_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_meta.autofit = False
    col_widths = [Inches(2.2), Inches(2.2), Inches(2.2)]
    
    labels = [
        ("VERSIÓN", "1.1 - Especificación Completa"),
        ("ESTADO", "Validado & En Ejecución"),
        ("ALCANCE", "MVP, Historias & Casos de Uso")
    ]
    for i, (k, v) in enumerate(labels):
        cell = tbl_meta.cell(0, i)
        cell.width = col_widths[i]
        set_cell_background(cell, "F1F5F9")
        set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        rk = p.add_run(f"{k}\n")
        rk.font.name = "Calibri"
        rk.font.size = Pt(8.5)
        rk.bold = True
        rk.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)
        rv = p.add_run(v)
        rv.font.name = "Calibri"
        rv.font.size = Pt(10)
        rv.bold = True
        rv.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # ==========================================
    # RESUMEN EJECUTIVO
    # ==========================================
    p_h = doc.add_paragraph()
    style_heading_1(p_h, "Resumen Ejecutivo")
    
    add_body_p(doc, 
        "Auditflow es una plataforma integral diseñada para creadores de contenido, marcas de comercio electrónico y agencias de marketing digital. "
        "Su objetivo primordial es resolver el mayor problema del contenido orgánico moderno en TikTok e Instagram Reels: la falta de retención en los primeros segundos "
        "y la incertidumbre al momento de grabar productos o servicios.")
    
    add_body_p(doc, 
        "A diferencia de los asistentes de texto convencionales (que solo redactan copys genéricos), Auditflow opera como un Director Creativo de Producción. "
        "Analiza las características visuales del producto y prescribe una Guía Maestra de Rodaje con reglas obligatorias: qué ángulos filmar, cómo iluminar, "
        "qué ganchos de 0 a 3 segundos utilizar y qué ritmo de edición aplicar.")
        
    add_callout(doc, 
        "El sistema no trata las recomendaciones como opciones de búsqueda o sugerencias aisladas. Las presenta como un flujo de producción obligatorio, paso a paso, "
        "listo para que el creador tome su smartphone y comience a rodar inmediatamente.", 
        title="PRINCIPIO CLAVE DE DISEÑO")

    # ==========================================
    # SECCIÓN 1: ALCANCES Y LÍMITES (SCOPE MATRIX)
    # ==========================================
    p_h = doc.add_paragraph()
    style_heading_1(p_h, "1. Límites y Alcances del Sistema (Scope Matrix)")
    
    p_h2 = doc.add_paragraph()
    style_heading_2(p_h2, "A. Lo que SÍ Incluye el Sistema (In-Scope)")
    add_bullet_p(doc, "Carga de fotos de productos físicos o servicios digitales, extrayendo texturas, reflejos y escala visual con Gemini Vision.", "1. Studio Engine Multimodal: ")
    add_bullet_p(doc, "Presentación obligatoria y continua de: Estrategia y formato viral, 3 Ganchos de 0 a 3 segundos, Shot-list cronológico toma por toma, Iluminación específica y Receta de edición.", "2. Ficha Maestra de Producción: ")
    add_bullet_p(doc, "Auditoría crítica sobre videos (vía enlace público o archivo MP4/MOV) midiendo retención, claridad de audio, zonas seguras (safe zones) y llamada a la acción (CTA).", "3. Auditoría On-Demand de Videos: ")
    add_bullet_p(doc, "Calificación cuantitativa Creative Quality Score (CQS 0-100) con 5 métricas ponderadas: Retención Primeros 3s (30%), Claridad de Propuesta de Valor (25%), Ritmo y Continuidad 1.2-1.8s (20%), Calidad de Audio y Normalización (15%), CTA & Safe Zones (10%), complementada con el Entregable Unificado en 3 Secciones: 1. Entendé el Perfil, 2. La Mejora y Qué Hacer, 3. Después Hacé.", "4. Scoring CQS y Diagnóstico: ")
    add_bullet_p(doc, "Diseño mobile-first optimizado para uso directo desde el teléfono del creador.", "5. Experiencia de Usuario Ágil: ")

    p_h2 = doc.add_paragraph()
    style_heading_2(p_h2, "B. Lo que se Excluye del MVP (Out-of-Scope) y su Justificación")
    add_bullet_p(doc, "Riesgo alto de baneo de cuentas de usuario por parte de Meta y TikTok. Además, rompe el objetivo de ser una herramienta de producción previa.", "• Publicación automática desatendida: ")
    add_bullet_p(doc, "El renderizado es computacionalmente pesado e innecesario cuando existen herramientas consolidadas como CapCut o Premiere.", "• Editor de video integrado: ")
    add_bullet_p(doc, "Consumo excesivo de ancho de banda y tokens sin aportar valor directo a la toma de decisión del video individual.", "• Monitoreo continuo 24/7 en segundo plano: ")
    add_bullet_p(doc, "Técnicamente inviable y legalmente riesgoso sin credenciales del propietario.", "• Auditoría de cuentas privadas o historias efímeras: ")

    # ==========================================
    # SECCIÓN 2: ARQUITECTURA TÉCNICA ÓPTIMA
    # ==========================================
    p_h = doc.add_paragraph()
    style_heading_1(p_h, "2. Arquitectura Técnica y Estrategia de Procesamiento")
    add_body_p(doc, 
        "La arquitectura óptima seleccionada es un Monolito Asíncrono con Cola Ligera de Tareas en segundo plano (Next.js + QStash/Inngest). "
        "Permite que el cliente reciba respuesta en menos de 500ms evitando los timeouts de 10-15s típicos de Vercel y Cloudflare, "
        "mientras la inferencia pesada de Gemini se resuelve en background.")

    # ==========================================
    # SECCIÓN 3: MOTOR DE IA Y GEMINI API
    # ==========================================
    p_h = doc.add_paragraph()
    style_heading_1(p_h, "3. Integración con la API de Gemini para el MVP")
    add_body_p(doc, 
        "Google Gemini es el modelo más ventajoso por su comprensión nativa simultánea de imagen, texto en pantalla (OCR) y audio sin necesidad de ensamblar múltiples modelos. "
        "Se implementa con resiliencia multimodelo: primario gemini-flash-lite-latest, secundario gemini-3.8-flash y generador dinámico de respaldo de cero tiempo de inactividad.")

    # ==========================================
    # SECCIÓN 4: ESPECIALIZACIÓN EN MARKETING
    # ==========================================
    p_h = doc.add_paragraph()
    style_heading_1(p_h, "4. Especialización en Marketing (Sin Fine-Tuning)")
    add_body_p(doc, 
        "En lugar de costosos entrenamientos de pesos que quedan obsoletos en semanas, la especialización se logra con Arquitectura de Conocimiento en Inferencia: "
        "rol estricto de Director Creativo Senior (estilo Hormozi/MrBeast), rúbricas cuantitativas (cortes en <1.5s, bucles de curiosidad en <3s), "
        "anclas few-shot de videos 38/100 vs 89/100 y esquemas JSON estrictos.")

    # ==========================================
    # SECCIÓN 5: STUDIO ENGINE
    # ==========================================
    p_h = doc.add_paragraph()
    style_heading_1(p_h, "5. Studio Engine: Los 5 Pasos Obligatorios de la Guía de Rodaje")
    add_bullet_p(doc, "Arquetipo probado, por qué funciona psicológicamente y audio trending sugerido al 12%.", "Paso 1: Estrategia y Formato Viral: ")
    add_bullet_p(doc, "3 alternativas con texto en pantalla, guion hablado y acción visual simultánea para detener el scroll.", "Paso 2: Ganchos de 0 a 3 Segundos: ")
    add_bullet_p(doc, "Toma por toma con tipo de plano (Macro, POV, Cenital), ángulo y movimiento.", "Paso 3: Guía de Tomas y Ángulos (Shot-List): ")
    add_bullet_p(doc, "Luz de ventana a 45°, rebote difuso casero y la regla de oro de limpiar la lente.", "Paso 4: Reglas de Iluminación Específica: ")
    add_bullet_p(doc, "Pacing cada 1.2s-1.8s, volumen de fondo al 12%, subtítulos en Safe Zone y 1080x1920 (9:16).", "Paso 5: Receta de Edición y Ritmo: ")

    # ==========================================
    # SECCIÓN 6: ACCESO REAL A REDES Y AUDITORÍA
    # ==========================================
    p_h = doc.add_paragraph()
    style_heading_1(p_h, "6. Acceso Técnico y Estructura Unificada del Entregable de Auditoría")
    add_body_p(doc, 
        "Las APIs oficiales de Meta y TikTok se descartan para el MVP porque exigen aprobación empresarial compleja y no permiten auditar cuentas de competidores. "
        "El acceso se resuelve en 2 niveles prácticos: Nivel 1 (Subida directa de archivo MP4/MOV, 100% libre de bloqueos) y Nivel 2 (APIs administradas en RapidAPI/Apify con proxies residenciales que resuelven captchas por centavos).")
        
    p_h2 = doc.add_paragraph()
    style_heading_2(p_h2, "Estructura Unificada del Entregable (Las 3 Secciones Clave de Auditoría)")
    add_bullet_p(doc, "Evaluación de la propuesta de valor ('Regla de los 3 segundos'), diagnóstico de biografía (elementos que restan autoridad vs. gancho de transformación) e identificación del tono comunicacional (Autoritario, Empático o Transaccional).", "1. ENTENDÉ EL PERFIL: ")
    add_bullet_p(doc, "3 opciones de biografía optimizadas (Autoridad, Beneficio Directo y Minimalista), ruta de conversión con enlace múltiple (máx. 3 botones) y estructura de las 4 portadas destacadas ('Empezá acá', 'Productos', 'Clientes', 'Cómo Comprar').", "2. LA MEJORA Y QUÉ HACER: ")
    add_bullet_p(doc, "Plan técnico de contenidos 100% accionable: Rutina semanal de stories (Lunes de encuesta, Miércoles de proceso, Viernes de venta) y 3 ideas de Reels virales por rubro con gancho 0-3s, ritmo de 1.5s y CTA claro (Educativo, Mito y Storytelling).", "3. DESPUÉS HACÉ: ")

    p_h2_cqs = doc.add_paragraph()
    style_heading_2(p_h2_cqs, "Algoritmo Cuantitativo: Creative Quality Score (CQS 0-100 Puntos)")
    add_body_p(doc, 
        "Inspirado en el rigor metodológico de CreativeX y VidMob, pero adaptado de forma prescriptiva y accesible para creadores, marcas D2C y agencias, "
        "el algoritmo CQS evalúa cada video o perfil auditado sobre 5 dimensiones ponderadas matemáticamente:")

    tbl_cqs = doc.add_table(rows=6, cols=4)
    tbl_cqs.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_cqs.autofit = False
    cqs_col_widths = [Inches(1.8), Inches(0.8), Inches(3.5), Inches(0.8)]

    cqs_headers = ["Dimensión / Pilar", "Peso", "Criterio Técnico Evaluado", "Pts Máx."]
    for j, h in enumerate(cqs_headers):
        cell = tbl_cqs.cell(0, j)
        cell.width = cqs_col_widths[j]
        set_cell_background(cell, "4338CA")
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    cqs_data = [
        ("Retención en Gancho (0-3s)", "30%", "Acción visual simultánea al texto en pantalla, rotura de patrón y eliminación de preámbulos lentos.", "30 pts"),
        ("Claridad de Propuesta de Valor", "25%", "Explicación inequívoca del beneficio central antes del segundo 5; respuesta clara a '¿por qué me importa?'.", "25 pts"),
        ("Ritmo y Continuidad Visual", "20%", "Cortes y transiciones dinámicas cada 1.2s - 1.8s (B-rolls, cambios de plano, zooms rápidos).", "20 pts"),
        ("Calidad y Normalización de Audio", "15%", "Voz frontal inteligible (>65 dBA), reducción de ruido ambiente y música trending equilibrada al 12%.", "15 pts"),
        ("Llamado a la Acción y Safe Zones", "10%", "CTA unívoco y claro, sin elementos críticos tapados por la interfaz de TikTok / Instagram (Safe Zones 9:16).", "10 pts")
    ]

    for i, row in enumerate(cqs_data):
        bg = "EEF2FF" if i % 2 == 0 else "FFFFFF"
        for j, val in enumerate(row):
            cell = tbl_cqs.cell(i + 1, j)
            cell.width = cqs_col_widths[j]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            p = cell.paragraphs[0]
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
            if j in (0, 1, 3):
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # ==========================================
    # SECCIÓN 7: HISTORIAS DE USUARIO (USER STORIES)
    # ==========================================
    p_h = doc.add_paragraph()
    style_heading_1(p_h, "7. Historias de Usuario del Proyecto (User Stories)")
    
    add_body_p(doc, 
        "Las Historias de Usuario definen las necesidades funcionales desde la perspectiva de los 3 arquetipos clave: "
        "el Creador UGC / Emprendedor Solopreneur, el Dueño de E-Commerce y el Content Manager de Agencia.")

    # Tabla de Historias de Usuario
    tbl_us = doc.add_table(rows=11, cols=4)
    tbl_us.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_us.autofit = False
    
    us_headers = ["ID", "Como [Rol]", "Quiero [Funcionalidad]", "Para [Beneficio / Impacto]"]
    for j, h in enumerate(us_headers):
        cell = tbl_us.cell(0, j)
        set_cell_background(cell, "1E293B")
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        
    us_data = [
        ("US-01", "Creador UGC / Emprendedor", "Subir una foto de mi producto con su nombre y objetivo comercial", "Obtener al instante una guía de rodaje completa sin bloquearme pensando qué filmar."),
        ("US-02", "Creador de Contenido", "Recibir 3 alternativas de ganchos (texto en pantalla + voz + acción simultánea)", "Detener el scroll del espectador en los primeros 1.5 segundos y aumentar la retención."),
        ("US-03", "Grabador con Smartphone", "Ver una lista cronológica toma por toma con ángulo y movimiento de cámara", "Grabar todos los clips en menos de 15 minutos sabiendo exactamente cómo mover el celular."),
        ("US-04", "Creador sin Luces Pro", "Recibir directivas prácticas para luz de ventana a 45° y rebote casero", "Evitar sombras duras y videos oscuros o amateurs sin comprar equipo de iluminación caro."),
        ("US-05", "Editor en CapCut / Celular", "Conocer el ritmo de cortes (1.5s), volumen de música (12%) y zonas seguras", "Editar el video cumpliendo las reglas algorítmicas de TikTok e Instagram."),
        ("US-06", "Dueño de Marca", "Pegar la URL pública de un Reel o TikTok sin dar contraseñas ni permisos", "Auditar el rendimiento de mi video o el de un competidor en pocos segundos."),
        ("US-07", "Creador Audiovisual", "Subir un archivo MP4 o MOV directamente desde mi galería", "Auditar un borrador de video antes de publicarlo en redes sociales para corregir errores."),
        ("US-08", "Content Manager", "Ver una puntuación global de 0 a 100 desglosada por gancho, audio y CTA", "Medir objetivamente la probabilidad de éxito de cada pieza de contenido."),
        ("US-09", "Creador en Producción", "Guardar mis planes de rodaje en un planificador semanal con estados", "Mantener constancia publicando al menos 3 videos semanales organizadamente."),
        ("US-10", "Director de Proyecto", "Descargar el documento maestro en formato Word (.docx) o leerlo en web", "Abrirlo en Google Drive, hacer anotaciones, compartirlo con clientes y editarlo.")
    ]
    
    for i, row in enumerate(us_data):
        bg = "F8FAFC" if i % 2 == 0 else "FFFFFF"
        for j, val in enumerate(row):
            cell = tbl_us.cell(i + 1, j)
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            p = cell.paragraphs[0]
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
            if j == 0:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Detalle de Criterios de Aceptación (Gherkin)
    p_h2 = doc.add_paragraph()
    style_heading_2(p_h2, "Criterios de Aceptación Clave (Gherkin)")
    
    add_body_p(doc, 
        "Dado que el usuario carga una imagen válida y escribe el nombre del producto, "
        "cuando pulsa 'Generar Guía Maestra', "
        "entonces el sistema responde en menos de 5 segundos con una ficha continua que contiene: formato viral, 3 ganchos, tomas 1 a 4+, iluminación y edición. "
        "Y si la API externa experimenta sobrecarga (503), el sistema activa el fallback dinámico garantizando cero tiempo de inactividad.",
        bold_prefix="Criterio de US-01 (Studio Engine): ")
        
    add_body_p(doc, 
        "Dado que el usuario tiene una guía generada, "
        "cuando pulsa el botón 'Copiar Guion' en cualquier gancho, "
        "entonces el texto se copia inmediatamente al portapapeles y el botón cambia temporalmente a '¡Copiado!' durante 2 segundos.",
        bold_prefix="Criterio de US-02 (Copiado Rápido): ")

    # ==========================================
    # SECCIÓN 8: CASOS DE USO DEL SISTEMA
    # ==========================================
    p_h = doc.add_paragraph()
    style_heading_1(p_h, "8. Casos de Uso del Sistema (Use Cases)")
    
    add_body_p(doc, 
        "Los Casos de Uso estructuran las interacciones formales entre los actores (humanos y sistemas externos) "
        "y los componentes de AuditFlow:")

    # CU-01
    p_h2 = doc.add_paragraph()
    style_heading_2(p_h2, "CU-01: Generación de Guía Maestra a partir de Producto (Foto + Datos)")
    add_bullet_p(doc, "Creador UGC / Emprendedor (Usuario Web / Móvil).", "Actor Principal: ")
    add_bullet_p(doc, "Motor Gemini Multimodal (Visión y Lenguaje), Generador Dinámico de Respaldo.", "Actores Secundarios: ")
    add_bullet_p(doc, "El usuario tiene acceso a AuditFlow desde su celular o navegador.", "Precondición: ")
    add_body_p(doc, 
        "1. El usuario selecciona o toma una foto del producto desde su dispositivo.\n"
        "2. Ingresa el nombre del producto y opcionalmente detalles diferenciadores.\n"
        "3. Selecciona el tipo de oferta (Físico / Digital) y el objetivo (Ventas / Viral / Confianza).\n"
        "4. Presiona el botón 'Generar Guía Maestra de Rodaje'.\n"
        "5. El sistema envía la solicitud multimodal a /api/studio/generate.\n"
        "6. Gemini analiza imagen y contexto con el prompt calibrado de marketing.\n"
        "7. El sistema recibe el JSON estructurado tipado (ShootingKit).\n"
        "8. Se despliega la pantalla continua con los 5 pasos obligatorios de rodaje.\n"
        "9. El usuario puede copiar guiones, revisar las tomas o guardar el kit en el Tracker.",
        bold_prefix="Flujo Principal: ")
    add_body_p(doc, 
        "• Flujo Alternativo 1 (Sin foto): El usuario no sube foto; el sistema genera la guía utilizando el nombre y descripción textual.\n"
        "• Flujo Alternativo 2 (Saturación de API 503): Si Gemini no responde, el motor activa el Generador Inteligente de Respaldo en <1 segundo sin mostrar errores al usuario.",
        bold_prefix="Flujos Alternativos: ")
    add_bullet_p(doc, "El usuario dispone de una ficha de producción lista para filmar de inmediato.", "Postcondición: ")

    # CU-02
    p_h2 = doc.add_paragraph()
    style_heading_2(p_h2, "CU-02: Auditoría Crítica de Video On-Demand")
    add_bullet_p(doc, "Content Manager / Creador.", "Actor Principal: ")
    add_bullet_p(doc, "Servicio de Ingesta (RapidAPI / Scraping), Gemini Video API.", "Actores Secundarios: ")
    add_bullet_p(doc, "El usuario dispone de una URL pública de video o un archivo MP4/MOV.", "Precondición: ")
    add_body_p(doc, 
        "1. El usuario navega a la pestaña 'Auditoría'.\n"
        "2. Pega el enlace público del Reel/TikTok o sube el archivo de video.\n"
        "3. Pulsa 'Auditar Video'.\n"
        "4. El sistema crea la tarea asíncrona y responde inmediatamente con un audit_id.\n"
        "5. La interfaz muestra un indicador de estado en tiempo real (Descarga -> Análisis de IA -> Reporte).\n"
        "6. Gemini evalúa las 5 métricas CQS: gancho 0-3s (30%), propuesta de valor (25%), ritmo 1.2-1.8s (20%), audio (15%) y CTA/safe zones (10%).\n"
        "7. Se despliega el reporte final estructurado en el Entregable Unificado (Entendé el Perfil, La Mejora y Qué Hacer, Después Hacé) con puntuación CQS (0-100) y checklist de tareas correctivas.",
        bold_prefix="Flujo Principal: ")
    add_bullet_p(doc, "El usuario obtiene el diagnóstico cuantitativo con las acciones exactas para mejorar el video.", "Postcondición: ")

    # CU-03
    p_h2 = doc.add_paragraph()
    style_heading_2(p_h2, "CU-03: Seguimiento del Flujo de Producción en el Content Tracker")
    add_bullet_p(doc, "Creador de Contenido.", "Actor Principal: ")
    add_bullet_p(doc, "AuditFlow LocalStorage / Base de Datos.", "Actores Secundarios: ")
    add_bullet_p(doc, "Al menos una guía de rodaje creada en el Studio.", "Precondición: ")
    add_body_p(doc, 
        "1. En la vista de ShootingKit, el usuario pulsa 'Guardar Plan'.\n"
        "2. El sistema almacena el plan con estado 'Por Grabar'.\n"
        "3. En la pestaña 'Planificador', el usuario visualiza sus guías y su meta semanal (ej. 1 de 3 videos).\n"
        "4. El usuario actualiza el estado a 'Grabado', 'Editado' o 'Publicado'.\n"
        "5. Puede pulsar sobre cualquier tarjeta para reabrir la guía completa mientras filma.",
        bold_prefix="Flujo Principal: ")
    add_bullet_p(doc, "El estado y la barra de progreso semanal se actualizan en tiempo real.", "Postcondición: ")

    # CU-04
    p_h2 = doc.add_paragraph()
    style_heading_2(p_h2, "CU-04: Descarga y Edición del Documento de Especificación en Google Drive")
    add_bullet_p(doc, "Usuario / Director de Proyecto.", "Actor Principal: ")
    add_bullet_p(doc, "Google Drive / Google Docs, Servidor de AuditFlow.", "Actores Secundarios: ")
    add_body_p(doc, 
        "1. El usuario hace clic en la pestaña 'Documento' o navega a /documento.\n"
        "2. Revisa la especificación completa en la vista web optimizada.\n"
        "3. Hace clic en 'Descargar Word (.docx)'.\n"
        "4. El navegador descarga el archivo oficial con tablas y formato compatible.\n"
        "5. El usuario abre Google Drive (drive.google.com) y sube el archivo con '+ Nuevo' -> 'Subir archivo'.\n"
        "6. Abre el documento en Google Docs para realizar modificaciones, agregar comentarios o compartir con su equipo.",
        bold_prefix="Flujo Principal: ")
    add_bullet_p(doc, "El usuario cuenta con una copia editable en la nube de toda la arquitectura y especificación.", "Postcondición: ")

    # ==========================================
    # SECCIÓN 9: HOJA DE RUTA Y COSTOS
    # ==========================================
    p_h = doc.add_paragraph()
    style_heading_1(p_h, "9. Hoja de Ruta de Implementación y Estimación de Costos")
    add_bullet_p(doc, "Studio Engine con visión multimodal, diseño UX/UI de alta gama y tolerancia a fallos.", "Fase 1 (Completada): ")
    add_bullet_p(doc, "Motor asíncrono de auditoría por URL y MP4 con rúbrica estricta y score 0-100.", "Fase 2 (Siguiente): ")
    add_bullet_p(doc, "Benchmark de perfiles públicos y análisis competitivo.", "Fase 3: ")
    add_bullet_p(doc, "Cuentas de usuario y sincronización automática con Notion y Drive.", "Fase 4: ")
    add_body_p(doc, "Presupuesto operativo del MVP: $0 a $5 USD mensuales (Hosting gratuito + Gemini Free Tier hasta 1,500 req/día).")

    # PIE DE PÁGINA / CIERRE
    doc.add_paragraph().paragraph_format.space_after = Pt(16)
    p_end = doc.add_paragraph()
    p_end.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_end = p_end.add_run("— Fin del Documento Maestro de Especificación —\nAuditFlow Core Team")
    r_end.font.name = "Calibri"
    r_end.font.size = Pt(10)
    r_end.font.italic = True
    r_end.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)
    
    output_path_project = r"C:\Fabri\Proyectos\auditflow\AuditFlow_Documento_Maestro_Estrategia_y_Arquitectura.docx"
    output_path_public = r"C:\Fabri\Proyectos\auditflow\public\AuditFlow_Documento_Maestro.docx"
    output_path_desktop = r"C:\Users\Compumax\OneDrive\Escritorio\AuditFlow_Documento_Maestro_Estrategia_y_Arquitectura.docx"
    
    doc.save(output_path_project)
    doc.save(output_path_public)
    doc.save(output_path_desktop)
    print("Documento actualizado con éxito en las 3 ubicaciones:")
    print(f"1. {output_path_project}")
    print(f"2. {output_path_public}")
    print(f"3. {output_path_desktop}")

if __name__ == "__main__":
    build_document()
