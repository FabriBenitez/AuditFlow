import { GoogleGenAI } from '@google/genai';
import { 
  ProductInput, 
  ShootingKit, 
  AuditReport, 
  SocialAccountAudit, 
  BusinessArchetype, 
  ArchetypeProfile, 
  ForensicDiagnosis,
  FourPillarsPlan,
  RawIdeaInput,
  RefinedIdeaKit,
  MicroClipTemplate,
  CreatorArchetypeId,
  EmotionalVibe,
  MicroFormatCategory
} from '@/types';
import { fetchRealInstagramProfile, fetchRealTikTokProfile, RealSocialProfile } from './socialScraper';

// Inicializar cliente Gemini con la API Key configurada
const apiKey = process.env.GEMINI_API_KEY || '';
const client = new GoogleGenAI({ apiKey });

export async function generateShootingKitWithGemini(input: ProductInput): Promise<ShootingKit> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no configurada en las variables de entorno.');
  }

  const goalTranslations: Record<string, string> = {
    sales: 'Ventas directas y conversión inmediata',
    viral: 'Máxima viralidad, retención y alcance orgánico',
    authority: 'Autoridad de marca, educación y confianza',
  };

  const productTypeTranslations: Record<string, string> = {
    physical: 'Producto Físico (packaging, textura, dimensiones, unboxing)',
    digital: 'Producto Digital (software, curso, ebook, app o descargable)',
    service: 'Servicio Profesional o Asesoría',
  };

  const promptText = `
Actúas como un Director Creativo Senior de Respuesta Directa y Contenido Orgánico (Viral Video Strategist para TikTok, Reels y Shorts con foco en retención de Alex Hormozi y MrBeast).

Analiza el siguiente producto/servicio:
- Nombre: "${input.name}"
- Descripción: "${input.description || 'Sin descripción adicional'}"
- Tipo: ${productTypeTranslations[input.type] || input.type}
- Objetivo de Campaña: ${goalTranslations[input.goal] || input.goal}

${input.imagePreviewUrl ? 'IMPORTANTE: Examina minuciosamente la imagen adjunta del producto (materiales, empaque, colores, textura, ergonomía y valor percibido) para personalizar los ángulos exactos, los reflejos en la luz y los ganchos visuales.' : ''}

Tu tarea es entregar la Guía Oficial de Rodaje con RECOMENDACIONES DIRECTIVAS Y OBLIGATORIAS (no sugerencias vagas ni opciones de búsqueda, sino instrucciones precisas de lo que el creador DEBE hacer frente a la cámara para no fracasar en retención).

PROTOCOLO ANTI-CLICHÉ Y DIRECCIÓN ESCÉNICA (OBLIGATORIO):
- PROHIBIDO usar fórmulas trilladas de plantilla: "Descubrí el secreto", "Potenciá tu...", "Transformá tu día", "Comentá FUEGO", "Te enseño a escalar", "No te pierdas esto".
- OBLIGATORIO:
  * Lenguaje visceral, crudo y específico de nicho.
  * Ganchos hablados con dolor real, beneficio tangible o polaridad.
  * Acciones visuales en 0-1.5s ultra-específicas (ej: "Golpea la mesa con el producto a 15cm del lente", "Cámara angular 0.5x en descenso rápido", "Macro a 5cm revelando la textura física").
  * Ritmo de edición sin silencios con cortes cada 1.2s - 1.8s.

Debes responder ÚNICAMENTE con un objeto JSON válido (sin formato Markdown adicional, sin backticks \`\`\`json, solo las llaves JSON puras) con la siguiente estructura exacta:

{
  "viralReferences": [
    {
      "id": "ref-1",
      "title": "Nombre de la Estrategia / Formato Viral Recomendado (ej: Formato 'La Prueba de Resistencia Extrema')",
      "formatType": "Categoría de formato (ej: Demostración de Choque, Curiosidad / Anti-Intuición)",
      "hookFormula": "Primera frase o estructura exacta que debe decir/mostrar para abrir el video",
      "whyItWorks": "Por qué esta estrategia psicológica es obligatoria para este producto",
      "targetEmotion": "Emoción primaria que debe detonar (ej: Asombro, Curiosidad Extrema, Alivio)",
      "soundSuggestion": "Tipo de música, BPM y vibra de audio trending mandatorio",
      "searchKeywords": "Palabras clave del arquetipo viral"
    }
  ],
  "hooks": [
    {
      "id": "hook-1",
      "title": "Nombre del gancho (ej: El Error Costoso)",
      "spokenHook": "Lo que debe decir en voz alta en los primeros 3 segundos (entre comillas)",
      "visualHook": "Acción física obligatoria en 0-1.5s frente al lente para detener el scroll",
      "onScreenText": "Texto obligatorio en pantalla en zona segura (Safe Zone)",
      "whyItWorks": "Por qué retiene audiencia"
    }
  ],
  "shotList": [
    {
      "number": 1,
      "timeRange": "0s - 3s",
      "shotType": "Tipo de plano obligatorio (ej: Plano Macro / Detalle)",
      "cameraAngle": "Ángulo exacto (ej: Picado 45°, POV primera persona, Cenital 90°)",
      "action": "Acción física exacta que debe ejecutar con el producto o cámara",
      "movement": "Movimiento obligatorio de la mano o cámara (ej: Zoom in rápido, paneo lateral)"
    }
  ],
  "lighting": {
    "naturalLight": "Instrucción obligatoria de luz natural (dónde pararse respecto a la ventana y cómo evitar contraluz)",
    "indoorSetup": "Instrucción obligatoria de iluminación casera/noche para evitar sombras duras o reflejos feos",
    "proTip": "Regla de oro obligatoria antes de presionar REC"
  },
  "editing": {
    "pacing": "Ritmo de cortes obligatorio (ej: Cortar cada 1.2s a 1.8s sin silencios)",
    "audioStyle": "Volumen y estilo sonoro obligatorio (ej: Música trending al 12%, voz clara)",
    "captionStyle": "Estilo obligatorio de subtítulos de alto impacto (palabra por palabra, color resaltado)",
    "exportSettings": "1080x1920 (Vertical 9:16) a 30fps o 60fps"
  }
}

Genera exactamente 2 a 3 viralReferences (la primera es la principal y recomendada), 3 hooks de alta retención, y entre 4 a 5 shotList items ordenados cronológicamente. Sé sumamente imperativo, práctico y directo.
`;

  // Preparar inputs para Interactions API
  const interactionInputs: Array<{ type: 'text'; text: string } | { type: 'image'; data: string; mime_type: string }> = [
    { type: 'text', text: promptText }
  ];

  // Si hay imagen en base64 o URL remota, adjuntarla
  if (input.imagePreviewUrl) {
    try {
      let mimeType = 'image/jpeg';
      let base64Data = '';

      if (input.imagePreviewUrl.startsWith('data:image/')) {
        const parts = input.imagePreviewUrl.split(';base64,');
        mimeType = parts[0].replace('data:', '') || 'image/jpeg';
        base64Data = parts[1];
      } else if (input.imagePreviewUrl.startsWith('http')) {
        const imgRes = await fetch(input.imagePreviewUrl);
        const arrayBuf = await imgRes.arrayBuffer();
        base64Data = Buffer.from(arrayBuf).toString('base64');
        mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
      }

      if (base64Data) {
        interactionInputs.push({
          type: 'image',
          data: base64Data,
          mime_type: mimeType,
        });
      }
    } catch (e) {
      console.warn('No se pudo procesar la imagen adjunta, continuando solo con texto:', e);
    }
  }

  // Intentar primero con gemini-flash-lite-latest (alta disponibilidad y rapidez)
  // y fallback a gemini-3.8-flash si es necesario
  const modelsToTry = ['gemini-flash-lite-latest', 'gemini-3.8-flash'];
  let rawText = '';

  for (const modelName of modelsToTry) {
    try {
      const response = await client.interactions.create(
        {
          model: modelName,
          input: interactionInputs,
        },
        {
          retries: { strategy: 'none' },
        }
      );
      rawText = response.output_text || '';
      if (rawText) break;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`Aviso: Intento con ${modelName} no disponible (${msg}). Probando siguiente...`);
    }
  }

  if (!rawText) {
    console.warn("Gemini temporalmente no disponible, usando generador inteligente de respaldo con recomendaciones obligatorias.");
    return generateDynamicFallback(input);
  }
  
  // Limpiar posibles bloques ```json o texto circundante
  const cleanedText = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleanedText);

    return {
      id: `kit-${Date.now()}`,
      productName: input.name,
      productType: input.type,
      goal: input.goal,
      createdAt: new Date().toISOString(),
      status: 'to_film',
      viralReferences: parsed.viralReferences || [],
      hooks: parsed.hooks || [],
      shotList: parsed.shotList || [],
      lighting: parsed.lighting || {
        naturalLight: 'Obligatorio: Ubícate a 45° de una ventana lateral para luz suave.',
        indoorSetup: 'Obligatorio: Rebota la luz contra una pared blanca para eliminar sombras duras.',
        proTip: 'Regla de oro: Limpia la lente de tu teléfono con paño antes de presionar REC.',
      },
      editing: parsed.editing || {
        pacing: 'Obligatorio: Cortes rápidos cada 1.2s a 1.8s sin silencios.',
        audioStyle: 'Obligatorio: Audio trending al 12% con voz protagónica.',
        captionStyle: 'Obligatorio: Subtítulos dinámicos de alto CTR en zona segura.',
        exportSettings: 'Obligatorio: 1080x1920 (Vertical 9:16) a 30fps o 60fps.',
      },
    };
  } catch (parseError) {
    console.error('Error parseando JSON de Gemini:', parseError, 'Respuesta cruda:', rawText);
    return generateDynamicFallback(input);
  }
}

function generateDynamicFallback(input: ProductInput): ShootingKit {
  const isPhysical = input.type === 'physical';
  const name = input.name;

  return {
    id: `kit-${Date.now()}`,
    productName: name,
    productType: input.type,
    goal: input.goal,
    createdAt: new Date().toISOString(),
    status: 'to_film',
    viralReferences: [
      {
        id: 'ref-1',
        title: isPhysical ? "Formato 'La Prueba de Resistencia Extrema'" : "Formato 'POV: El Método que Nadie Te Cuenta'",
        formatType: isPhysical ? "Demostración de Choque" : "Storytelling de Revelación",
        hookFormula: isPhysical 
          ? `"Pusimos a prueba ${name} para ver si realmente cumple lo que promete..."`
          : `"Si estás perdiendo horas intentando resolver esto solo... mira este método."`,
        whyItWorks: "Atrapa al espectador abriendo un bucle de curiosidad en menos de 1.5 segundos.",
        targetEmotion: "Curiosidad Extrema y Asombro",
        soundSuggestion: "Audio trending rítmico con beat constante y volumen al 12%",
        searchKeywords: `${name} review, ${name} hacks, viral test`
      },
      {
        id: 'ref-2',
        title: isPhysical ? "Formato 'ASMR / Sensorial sin Relleno'" : "Formato 'Antes vs Después en 3 Pasos'",
        formatType: "Demostración Sensorial",
        hookFormula: isPhysical
          ? `"El acabado y detalles reales de ${name} que nadie te muestra en fotos."`
          : `"De 0 a resultados reales con ${name}: paso a paso."`,
        whyItWorks: "Elimina la fricción visual y genera deseo inmediato.",
        targetEmotion: "Deseo y Satisfacción",
        soundSuggestion: "Audio envolvente Lo-Fi o acústico moderno",
        searchKeywords: `${name} aesthetic, ${name} transformation`
      }
    ],
    hooks: [
      {
        id: 'hook-1',
        title: 'El Error Costoso de Fabricación/Uso',
        spokenHook: `"Si estás usando ${name} de esta manera... estás tirando tu plata a la basura."`,
        visualHook: isPhysical 
          ? 'Golpe seco sobre la mesa con el producto a 15cm del lente angular 0.5x en 0.4s.'
          : 'Pantalla grabada con zoom rápido al error crítico en segundo 0.5.',
        onScreenText: `EL ERROR EN ${name.toUpperCase()} ⚠️`,
        whyItWorks: 'Activa la aversión a la pérdida inmediata y detiene el scroll sin preámbulos.'
      },
      {
        id: 'hook-2',
        title: 'La Comparativa Incómoda vs Imitación',
        spokenHook: `"¿Por qué la versión barata de esto se deforma y ${name} no? Mirá la prueba."`,
        visualHook: 'Comparación lado a lado en pantalla partida o prueba de resistencia en plano picado.',
        onScreenText: `COMPARATIVA REAL: ¿VALE LA PENA? 🤔`,
        whyItWorks: 'Posiciona la honestidad técnica y justifica el valor económico real.'
      },
      {
        id: 'hook-3',
        title: 'El Detalle Técnico que Define la Calidad',
        spokenHook: `"Este único detalle de textura en ${name} es lo que define si es genuino o una copia."`,
        visualHook: 'Acercamiento macro a 5cm revelando la textura física o función crítica.',
        onScreenText: `LA PRUEBA DEL DETALLE REAL 🔍`,
        whyItWorks: 'Genera exclusividad y elimina la percepción de producto genérico.'
      }
    ],
    shotList: [
      {
        number: 1,
        timeRange: '0s - 3s',
        shotType: 'Plano Macro / Detalle Rápido (Obligatorio)',
        cameraAngle: 'Picado 45° con movimiento de acercamiento',
        action: isPhysical 
          ? `Muestra el detalle principal o empaque de ${name} rompiendo la inercia con un movimiento dinámico.`
          : 'Primer plano a la pantalla o rostro reaccionando con energía.',
        movement: 'Acercamiento rápido de 25cm a 8cm'
      },
      {
        number: 2,
        timeRange: '3s - 8s',
        shotType: 'Plano en Primera Persona (POV)',
        cameraAngle: 'A la altura del pecho en ángulo de uso real',
        action: isPhysical
          ? `Toma ${name} con tus manos en su contexto de uso natural (mesa limpia, luz natural).`
          : 'Pantalla dividida mostrando la herramienta en acción.',
        movement: 'Movimiento fluido y estable'
      },
      {
        number: 3,
        timeRange: '8s - 15s',
        shotType: 'Plano Cenital / Interacción Detallada',
        cameraAngle: 'Cenital 90° o frontal directo',
        action: `Demuestra la funcionalidad o resultado clave que resuelve ${name}.`,
        movement: 'Cámara fija o rotación sutil de 15 grados'
      },
      {
        number: 4,
        timeRange: '15s - 22s',
        shotType: 'Plano Medio + Llamado a la Acción (CTA)',
        cameraAngle: 'Frontal a la altura de los ojos',
        action: 'Muestra el producto frente a cámara y señala el link en el perfil con energía.',
        movement: 'Acercamiento suave hacia la lente'
      }
    ],
    lighting: {
      naturalLight: 'Obligatorio: Ubícate a 45° de una ventana amplia entre las 10:00 y las 14:00. NUNCA a contraluz directo.',
      indoorSetup: 'Obligatorio: Rebota una lámpara o foco contra una pared blanca para generar luz difusa sin sombras duras en el producto.',
      proTip: 'Regla de oro: Limpia la lente de tu smartphone con un paño de microfibra antes de filmar. El 90% de los videos borrosos son solo grasa acumulada.'
    },
    editing: {
      pacing: 'Obligatorio: Cortes rápidos cada 1.2s a 1.8s en los primeros 6 segundos. Cero pausas de respiración entre frases.',
      audioStyle: 'Obligatorio: Música trending al 10-12% de volumen. La voz debe ser la protagonista absoluta.',
      captionStyle: 'Obligatorio: Subtítulos dinámicos palabra por palabra en el tercio inferior seguro (Safe Zone), con palabra clave resaltada en amarillo neón.',
      exportSettings: 'Obligatorio: Exportar en 1080x1920 (Vertical 9:16) a 30 o 60 fps.'
    }
  };
}

export interface AuditInput {
  igUsername?: string;
  ttUsername?: string;
  niche?: string;
  archetype?: BusinessArchetype;
}

export const ARCHETYPE_CONFIGS: Record<BusinessArchetype, {
  label: string;
  badge: string;
  description: string;
  operationalRules: string[];
  clinicalPattern: string;
  symptom: string;
  rootCause: string;
  prescribedAction: string;
  bioOptions: { authority: string; directBenefit: string; minimalist: string };
  links: string[];
  highlights: { title: string; description: string; coverColor: string }[];
  storiesRoutine: { day: string; dayType: string; description: string }[];
  reels: { category: 'Educativo' | 'Rompiendo un mito/dolor' | 'Storytelling / Detrás de escena'; hook0to3s: string; developmentPacing: string; cta: string }[];
}> = {
  ecommerce_physical: {
    label: 'E-Commerce & Producto Físico',
    badge: '🛍️ Retail & D2C',
    description: 'Marcas con productos tangibles donde la textura, el packaging y el unboxing mandan sobre las palabras vacías.',
    operationalRules: [
      'Macro a 10cm en segundo 0 para detener el scroll sin preámbulos',
      'Sonido ASMR real sin música tapando la textura física',
      'Demostración de uso real vs alternativa barata de la competencia'
    ],
    clinicalPattern: 'Síndrome del Perfil Folleto',
    symptom: 'Feed compuesto por fotos estáticas de producto sobre fondo neutro, sin movimiento humano ni contexto de uso real.',
    rootCause: 'El visitante no compra un objeto inanimado, compra la transformación sensorial. Las fotos estáticas tienen 0 retención algorítmica.',
    prescribedAction: 'Reemplazar fotos por videos de 12 segundos mostrando la textura física y la prueba de resistencia o aroma real.',
    bioOptions: {
      authority: 'Acabados artesanales y materias primas grado superior ⭐ | Hecho a mano con garantía | Catálogo exclusivo aquí 👇',
      directBenefit: 'Diseño y durabilidad real para todos tus días 📦 | Envíos express a todo el país en 24/48h | Pedidos y precios directos 👇',
      minimalist: 'Texturas auténticas, diseño honesto y durabilidad garantizada. Mirá nuestro catálogo completo con precios aquí 👇'
    },
    links: [
      'Botón 1: 💬 Chatear por WhatsApp (Atención Directa)',
      'Botón 2: 📦 Ver Catálogo Completo con Precios',
      'Botón 3: ⭐ Reseñas y Unboxings Reales de Clientes'
    ],
    highlights: [
      { title: 'Empezá acá', description: 'Nuestra historia, materiales y por qué no usamos alternativas baratas.', coverColor: '#F59E0B' },
      { title: 'Catálogo', description: 'Modelos disponibles con detalles de textura y medidas reales.', coverColor: '#10B981' },
      { title: 'Clientes', description: 'Fotos y videos reales de compradores recibiendo sus paquetes.', coverColor: '#6366F1' },
      { title: 'Envíos', description: 'Tiempos de entrega, embalaje seguro y políticas de cambio.', coverColor: '#EC4899' }
    ],
    storiesRoutine: [
      { day: 'Lunes', dayType: 'ASMR / Textura & Unboxing', description: 'Grabación macro abriendo un paquete o mostrando el material de cerca sin hablar, solo sonido real crujiente.' },
      { day: 'Miércoles', dayType: 'Comparativa de Resistencia', description: 'Poné a prueba el producto frente a una imitación barata: mostrá por qué el tuyo no se deforma ni se rompe.' },
      { day: 'Viernes', dayType: 'Despachos & Stock Limitado', description: 'Mostrá las cajas listas para el correo: "Últimos 5 pedidos que salen hoy para el fin de semana. Respondé este story si querés el tuyo".' }
    ],
    reels: [
      {
        category: 'Educativo',
        hook0to3s: '"Si tu producto se desgasta o rompe a los 3 meses... estás comprando este material barato sin saberlo."',
        developmentPacing: 'Cortes cada 1.4s mostrando la diferencia entre costuras/materiales reales vs copias industriales.',
        cta: 'Guardá este video para revisar los materiales antes de tu próxima compra.'
      },
      {
        category: 'Rompiendo un mito/dolor',
        hook0to3s: '"Pusimos a prueba esto bajo calor y peso extremo para ver si el marketing era real."',
        developmentPacing: 'Prueba de estrés rápida con cronómetro en pantalla y plano picado dinámico.',
        cta: 'Tocá el enlace de nuestra biografía para ver el catálogo con garantía de reemplazo.'
      },
      {
        category: 'Storytelling / Detrás de escena',
        hook0to3s: '"Nos dijeron que era imposible fabricar esto a mano sin bajar la calidad... mirá cómo quedó."',
        developmentPacing: 'Planos macro del proceso artesanal con audio Lo-Fi rítmico al 12%.',
        cta: 'Mirá nuestras historias destacadas para conocer el taller por dentro.'
      }
    ]
  },
  local_gastro_retail: {
    label: 'Negocio Local / Gastronomía & Retail',
    badge: '📍 Local & Gastro',
    description: 'Negocios con tráfico físico donde el apetito sensorial y la eliminación de fricción de reserva definen las ventas.',
    operationalRules: [
      'Slow-motion sensorial en primer plano (queso, corte, textura)',
      'Precios y ubicación claros en el primer toque',
      'Foco en el ciclo de consumo Jueves-Viernes-Sábado'
    ],
    clinicalPattern: 'Miopía de Call-to-Action y Fricción de Reserva',
    symptom: 'Videos tentadores pero biografía sin dirección clara, sin botón de WhatsApp de 1 toque ni menú con precios.',
    rootCause: 'El cliente decide con hambre y en caliente. Si tiene que mandar DM y esperar 2 horas por el precio, pide en otro local.',
    prescribedAction: 'Colocar enlace directo a WhatsApp con mensaje predeterminado de reserva o menú directo sin registros.',
    bioOptions: {
      authority: 'El sabor auténtico que conquistó la ciudad 🏆 | Ingredientes frescos del día | Reservá tu mesa o pedí delivery en 1 clic 👇',
      directBenefit: 'Tu punto de encuentro favorito con amigos 🍔 | Menú del día, opciones veggies y delivery express | Hacé tu pedido aquí 👇',
      minimalist: 'Café de especialidad, cocina honesta y buen ambiente. Abierto de Mar a Dom. Menú y reservas directas aquí 👇'
    },
    links: [
      'Botón 1: 💬 Reservar Mesa por WhatsApp en 1 Clic',
      'Botón 2: 📋 Ver Carta y Precios Actualizados 2026',
      'Botón 3: 📍 Cómo Llegar (Google Maps)'
    ],
    highlights: [
      { title: 'Menú & Precios', description: 'Platos principales, opciones veggies y promociones vigentes.', coverColor: '#F59E0B' },
      { title: 'El Lugar', description: 'Fotos y videos del ambiente, mesas al aire libre y música.', coverColor: '#10B981' },
      { title: 'Cómo Llegar', description: 'Ubicación exacta, estacionamiento y horarios de atención.', coverColor: '#6366F1' },
      { title: 'Reservas', description: 'Pasos para apartar mesa para cumpleaños o grupos grandes.', coverColor: '#EC4899' }
    ],
    storiesRoutine: [
      { day: 'Jueves', dayType: 'Antojo Sensorial (Food Porn)', description: 'Video en cámara lenta de la preparación del plato estrella hirviendo o recién salido del horno con música trending.' },
      { day: 'Viernes mediodía', dayType: 'Plan Fin de Semana', description: 'Tomas del salón preparándose para la noche: "Últimas mesas disponibles para esta noche. Tocá el link y asegurá la tuya".' },
      { day: 'Sábado tarde', dayType: 'Detrás del Mostrador', description: 'El equipo en acción a toda velocidad, frescura de ingredientes y gente disfrutando.' }
    ],
    reels: [
      {
        category: 'Educativo',
        hook0to3s: '"La razón por la que nunca deberías pedir un café/plato sin fijarte en este detalle clave."',
        developmentPacing: 'Cortes cada 1.2s mostrando la técnica del barista/cocinero en primer plano.',
        cta: 'Guardá este Reel para saber qué pedir en tu próxima visita.'
      },
      {
        category: 'Rompiendo un mito/dolor',
        hook0to3s: '"¿Te dijeron que comer increíble en la ciudad te iba a costar una fortuna? Mirá esta mesa para dos."',
        developmentPacing: 'Paneo cenital revelando los 3 platos con el precio real transparente en pantalla.',
        cta: 'Mandale este Reel al amigo con el que tenés que venir este fin de semana.'
      },
      {
        category: 'Storytelling / Detrás de escena',
        hook0to3s: '"El plato que casi sacamos de la carta hasta que cambiamos este único ingrediente..."',
        developmentPacing: 'Tomas de cocina en tiempo real con música con beat dinámico y voz en off cercana.',
        cta: 'Vení a probarlo antes de que se agote la tanda del fin de semana.'
      }
    ]
  },
  b2b_services_high_ticket: {
    label: 'Servicios B2B / Consultoría & Agencias',
    badge: '💼 B2B & High-Ticket',
    description: 'Empresas y profesionales donde la autoridad técnica, los números auditables y el desmantelamiento de errores venden.',
    operationalRules: [
      'Cero bailecitos ni trends vacíos',
      'Desglose de números, márgenes y pantalla grabada',
      'Foco en ciclo de compra Martes-Miércoles-Jueves'
    ],
    clinicalPattern: 'Bio Narcisista y Ceguera de Transformación',
    symptom: 'Biografía que habla de pasiones y títulos propios en lugar del beneficio económico tangible que recibe el cliente.',
    rootCause: 'A un director o dueño de negocio no le importan tus títulos; le importa saber cuánto tiempo o dinero va a ganar contratándote.',
    prescribedAction: 'Reescribir biografía con fórmula de valor directa: "Ayudamos a marcas de [X] a resolver [Y] sin [Z] en [N] días".',
    bioOptions: {
      authority: 'Optimizamos la rentabilidad de marcas B2B 📈 | Más de $2M auditados y procesos escalados | Agendá tu sesión diagnóstica 👇',
      directBenefit: 'Dejá de perder margen en procesos manuales obsoletos ⚡ | Estrategia, sistemas y soporte directo | Caso de estudio y contacto aquí 👇',
      minimalist: 'Consultoría estratégica y sistemas operativos para negocios en crecimiento. Ver casos de estudio y agendar llamada aquí 👇'
    },
    links: [
      'Botón 1: 📅 Agendar Llamada de Diagnóstico de 15 Min',
      'Botón 2: 📊 Ver Caso de Estudio con Métricas Reales',
      'Botón 3: 💬 Escribir al WhatsApp del Equipo'
    ],
    highlights: [
      { title: 'Resultados', description: 'Capturas de métricas reales, ROI y testimonios de clientes B2B.', coverColor: '#F59E0B' },
      { title: 'Método', description: 'Los 3 pasos exactos con los que implementamos nuestras soluciones.', coverColor: '#10B981' },
      { title: 'Para Quién', description: 'Requisitos para trabajar juntos y quién NO califica para el servicio.', coverColor: '#6366F1' },
      { title: 'Contacto', description: 'Cómo agendar una sesión inicial y tiempos de respuesta.', coverColor: '#EC4899' }
    ],
    storiesRoutine: [
      { day: 'Martes', dayType: 'Desmantelar Error Costoso', description: 'Captura o pizarrón explicando el error que le cuesta miles de dólares al mes al 90% de las empresas del rubro.' },
      { day: 'Miércoles', dayType: 'Caso de Estudio con Métricas', description: 'Pantalla compartida mostrando el antes y después de un cliente real sin censurar los números clave.' },
      { day: 'Jueves', dayType: 'Opinión Impopular / Roasting', description: 'Crítica técnica a una práctica estándar de la industria que ya no funciona: "Por qué deberías dejar de hacer X hoy mismo".' }
    ],
    reels: [
      {
        category: 'Educativo',
        hook0to3s: '"Si tu empresa sigue gestionando esto de forma manual... estás perdiendo el 30% de tu margen operativo."',
        developmentPacing: 'Gráficos simples o pantalla compartida con cortes cada 1.5s directo al grano.',
        cta: 'Guardá este Reel para presentárselo a tu equipo en la próxima reunión.'
      },
      {
        category: 'Rompiendo un mito/dolor',
        hook0to3s: '"La mentira que te dijeron las agencias tradicionales para cobrarte un retainer mensual infinito."',
        developmentPacing: 'Mirada fija a cámara con voz firme y texto en amarillo bold resaltando las palabras clave.',
        cta: 'Tocá el enlace de la bio si querés auditar tu proceso actual sin costo.'
      },
      {
        category: 'Storytelling / Detrás de escena',
        hook0to3s: '"El cliente que llegó al borde de cerrar operaciones y el único ajuste que salvó sus números."',
        developmentPacing: 'Relato cronológico en 45 segundos con evidencia en pantalla y lección final.',
        cta: 'Mirá el caso de estudio completo en el link de nuestro perfil.'
      }
    ]
  },
  personal_brand_creator: {
    label: 'Marca Personal & Creador de Contenido',
    badge: '👤 Creador & Filosofía',
    description: 'Creadores y referentes donde la polaridad, el criterio propio y la retención en los primeros 1.5s construyen lealtad.',
    operationalRules: [
      'Cero saludos ni introducciones lentas',
      'Cortes de cámara en el segundo 1.0',
      'Puntos de vista con postura firme y no tibia'
    ],
    clinicalPattern: 'Fuga Crítica en los 3 Segundos',
    symptom: 'Videos que arrancan con saludos lentos ("Hola comunidad", suspiros o acomodándose frente a cámara).',
    rootCause: 'El usuario promedio desliza en 1.2s. Cualquier preámbulo o titubeo destruye la retención del algoritmo.',
    prescribedAction: 'Cortar el primer segundo muerto. Arrancar hablando en el milisegundo 0 con texto en pantalla llamativo.',
    bioOptions: {
      authority: 'Comparto lo que funciona sin filtro ni humo ⚡ | Más de 5 años documentando el proceso | Accedé a mis recursos gratuitos aquí 👇',
      directBenefit: 'Aprendé a pensar y ejecutar mejor sin perder años cometiendo errores básicos 🧠 | Newsletter y contenidos clave abajo 👇',
      minimalist: 'Ideas, aprendizajes y experimentos sin filtro. Recursos gratuitos y newsletter semanal en el enlace 👇'
    },
    links: [
      'Botón 1: 📬 Leer mi Newsletter Semanal Gratuita',
      'Botón 2: 🎙️ Escuchar el Último Episodio del Podcast',
      'Botón 3: 🚀 Unirse a la Comunidad Privada'
    ],
    highlights: [
      { title: 'Filosofía', description: 'Por qué hago lo que hago y cuáles son mis principios innegociables.', coverColor: '#F59E0B' },
      { title: 'Recursos', description: 'Plantillas, guías y documentos gratuitos para descargar.', coverColor: '#10B981' },
      { title: 'Preguntas', description: 'Respuestas a las dudas más complejas y polémicas de la audiencia.', coverColor: '#6366F1' },
      { title: 'Comunidad', description: 'Historias y logros de las personas que siguen el método.', coverColor: '#EC4899' }
    ],
    storiesRoutine: [
      { day: 'Lunes', dayType: 'Opinión Polar / Debate', description: 'Sticker de votación binario con una tesis polémica del nicho: "La mayoría piensa A, pero en realidad es B. ¿Vos de qué lado estás?".' },
      { day: 'Miércoles', dayType: 'Fracaso Real & Lección', description: 'Foto o video corto contando un error reciente propio y la lección práctica que dejó: cero poses de gurú perfecto.' },
      { day: 'Viernes', dayType: 'Recurso Descargable', description: 'Demostración en pantalla del recurso o plantilla gratuita de la semana con llamado a tocar el link de la bio.' }
    ],
    reels: [
      {
        category: 'Educativo',
        hook0to3s: '"3 lecciones duras que tardé 5 años en aprender y que te van a ahorrar miles de dólares en errores."',
        developmentPacing: 'Cortes cada 1.2s con zoom in en cada número clave y subtítulos dinámicos.',
        cta: 'Guardá este Reel para volver a escucharlo cuando tengas que tomar una decisión difícil.'
      },
      {
        category: 'Rompiendo un mito/dolor',
        hook0to3s: '"Por qué deberías dejar de hacer lo que todos en este nicho te recomiendan hacer."',
        developmentPacing: 'Argumentación lógica y contraintuitiva respaldada con ejemplos tangibles.',
        cta: 'Dejá tu opinión en los comentarios: ¿estás de acuerdo o crees que me equivoco?'
      },
      {
        category: 'Storytelling / Detrás de escena',
        hook0to3s: '"El día que casi lo dejo todo porque nada parecía funcionar... y lo que cambió todo."',
        developmentPacing: 'Voz en off emotiva pero sobria con tomas de trabajo cotidiano sin poses artificiales.',
        cta: 'Mirá la historia completa en el enlace de mi perfil.'
      }
    ]
  },
  saas_tech_digital: {
    label: 'SaaS, Software & Productos Digitales',
    badge: '💻 SaaS & Tech',
    description: 'Herramientas de software y productos digitales donde mostrar la pantalla en acción y el ahorro de tiempo/dinero es ley.',
    operationalRules: [
      'Pantalla grabada en acción en los primeros 2 segundos',
      'Comparativa de tiempo: Método manual vs 1 Clic',
      'Roasting del dolor que soluciona la herramienta'
    ],
    clinicalPattern: 'Síndrome de la Explicación Abstracta',
    symptom: 'Textos llenos de jerga técnica ("solución cloud integral") sin mostrar la interfaz resolviendo el problema en 5 segundos.',
    rootCause: 'El usuario no compra tecnología, compra no tener que hacer una tarea aburrida. Si no ve la pantalla, no entiende qué hace.',
    prescribedAction: 'Grabar pantalla con zoom a la acción concreta: "Mirá cómo pasa de esto a esto en 1 clic".',
    bioOptions: {
      authority: 'Automatizá tu flujo de trabajo sin saber programar ⚡ | Más de 10,000 horas ahorradas a creadores | Probalo gratis hoy 👇',
      directBenefit: 'Dejá de perder 4 horas por día en tareas repetitivas 🚀 | Probá la herramienta en tu navegador en 1 clic 👇',
      minimalist: 'Software simple para resultados rápidos. Probá la demo interactiva sin tarjeta de crédito aquí 👇'
    },
    links: [
      'Botón 1: 🚀 Probar la Herramienta Gratis (Sin Tarjeta)',
      'Botón 2: 📺 Ver Demo en Video de 60 Segundos',
      'Botón 3: 💡 Changelog y Novedades del Producto'
    ],
    highlights: [
      { title: 'Demo Rápida', description: 'Cómo funciona la herramienta en 3 simples pasos en menos de 1 minuto.', coverColor: '#F59E0B' },
      { title: 'Tutoriales', description: 'Trucos avanzados para aprovechar las funciones ocultas.', coverColor: '#10B981' },
      { title: 'Comparativa', description: 'Cuánto tardas con el método tradicional vs usando nuestro software.', coverColor: '#6366F1' },
      { title: 'Planes', description: 'Precios transparentes y qué incluye cada membresía.', coverColor: '#EC4899' }
    ],
    storiesRoutine: [
      { day: 'Lunes', dayType: 'Roasting del Método Manual', description: 'Grabación de pantalla mostrando lo frustrante que es hacer el proceso a mano en hojas de cálculo vs 1 clic en la app.' },
      { day: 'Miércoles', dayType: 'Feature Drop / Truco Oculto', description: 'Video de 15 segundos mostrando una funcionalidad específica que pocos conocen pero que ahorra mucho tiempo.' },
      { day: 'Viernes', dayType: 'Comparativa de Costo / ROI', description: 'Cálculo transparente en pantalla: "Lo que te cuesta una hora de trabajo vs lo que te cuesta el software al mes".' }
    ],
    reels: [
      {
        category: 'Educativo',
        hook0to3s: '"La función oculta que hace en 10 segundos lo que a tu equipo le toma 4 horas enteras."',
        developmentPacing: 'Zoom rápido al cursor haciendo clic y resultado generándose en tiempo real.',
        cta: 'Tocá el enlace de nuestro perfil para probarlo gratis ahora mismo.'
      },
      {
        category: 'Rompiendo un mito/dolor',
        hook0to3s: '"Seguir haciendo esto de forma manual en 2026 es regalarle tus clientes a la competencia."',
        developmentPacing: 'Comparativa de pantalla dividida: a la izquierda el dolor manual, a la derecha el software en 3 segundos.',
        cta: 'Guardá este Reel para cuando vayas a optimizar tu flujo de trabajo.'
      },
      {
        category: 'Storytelling / Detrás de escena',
        hook0to3s: '"Creamos esta herramienta porque estábamos hartos de pagar $500/mes por programas que no funcionaban."',
        developmentPacing: 'Capturas del código o diseño original con evolución hasta la versión actual.',
        cta: 'Probá la demo en vivo en el enlace de la bio.'
      }
    ]
  }
};

export function detectArchetype(input: {
  username: string;
  bio?: string;
  niche?: string;
  explicitArchetype?: BusinessArchetype;
}): BusinessArchetype {
  if (input.explicitArchetype) return input.explicitArchetype;

  const text = `${input.username} ${input.bio || ''} ${input.niche || ''}`.toLowerCase();

  if (/cafe|cafeteria|bar|gastro|food|burger|pizza|sushi|resto|restaurante|pasteleria|bakery|heladeria|cocktail/.test(text)) {
    return 'local_gastro_retail';
  }
  if (/vela|velas|lumiere|indumentaria|ropa|wear|store|shop|joyas|accesorios|deco|decoracion|calzado|zapas|remeras|d2c|unboxing/.test(text)) {
    return 'ecommerce_physical';
  }
  if (/consultor|agencia|coach|growth|scale|abogad|legal|estudio|contador|finanzas|b2b|marketing|dev|software house/.test(text)) {
    return 'b2b_services_high_ticket';
  }
  if (/app|ai|bot|saas|software|platform|tech|tool|flow|automation|digital product/.test(text)) {
    return 'saas_tech_digital';
  }
  return 'personal_brand_creator';
}

export async function generateAuditReportWithGemini(input: AuditInput): Promise<AuditReport> {
  const cleanIg = (input.igUsername || '')
    .replace(/^@/, '')
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/\/$/, '')
    .trim();

  const cleanTt = (input.ttUsername || '')
    .replace(/^@/, '')
    .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/i, '')
    .replace(/\/$/, '')
    .trim();

  if (!cleanIg && !cleanTt) {
    throw new Error('Debes ingresar al menos un usuario de Instagram o TikTok.');
  }

  // 1. Extraer datos 100% REALES en vivo directamente de Instagram y TikTok
  const [realIg, realTt] = await Promise.all([
    cleanIg ? fetchRealInstagramProfile(cleanIg) : Promise.resolve(null),
    cleanTt ? fetchRealTikTokProfile(cleanTt) : Promise.resolve(null),
  ]);

  // Generar reporte base hiper-específico de respaldo
  const baselineReport = generateDynamicAuditFallback({
    igUsername: cleanIg,
    ttUsername: cleanTt,
    niche: input.niche,
    archetype: input.archetype,
    realIg,
    realTt
  });

  if (!apiKey) {
    console.warn('GEMINI_API_KEY no detectada, utilizando motor heurístico calibrado.');
    return baselineReport;
  }

  const promptText = `
Actúas como un Director Senior de Crecimiento Orgánico, Auditor de Redes Sociales y Consultor Estratégico de Video Vertical (TikTok, Reels, Shorts).

PROTOCOLO ANTI-CLICHÉ Y CONSULTORÍA DE ÉLITE (OBLIGATORIO):
- PROHIBIDO usar fórmulas trilladas de plantilla: "Descubrí el secreto", "Potenciá tu...", "Transformá tu día", "Comentá FUEGO", "Te enseño a escalar", "Apasionados por el diseño".
- OBLIGATORIO:
  * Diagnóstico forense con nombres clínicos claros (ej: "Síndrome del Perfil Folleto", "Fuga en los 3 Segundos", "Bio Narcisista", "Miopía de Call-to-Action").
  * Lenguaje visceral, técnico y realista.
  * Consejos accionables milimétricos (acciones físicas en segundo 0-1.5s, llamadas a la acción sin fricción).
  * Adaptar las rutinas y ganchos al arquetipo real del negocio (${baselineReport.detectedArchetype?.label || 'Específico'}).

DATOS REALES EN VIVO DE LAS CUENTAS AUDITADAS:
${realIg && realIg.isLiveVerified ? `
INSTAGRAM (@${realIg.username}) - [DATOS REALES EXTRAÍDOS EN VIVO]:
- Nombre en Perfil: "${realIg.fullName}"
- Biografía Actual: "${realIg.bio.replace(/\n/g, ' ')}"
- Seguidores: ${realIg.followersCount}
- Siguiendo: ${realIg.followingCount || 0}
- Publicaciones: ${realIg.postsCount || 0}
- Enlace en Bio: ${realIg.hasLinkInBio ? 'SÍ (' + (realIg.linkUrl || 'detectado') + ')' : 'NO (Falta enlace directo de conversión)'}
` : (cleanIg ? `Instagram (@${cleanIg}): No se pudo extraer datos en vivo. Deducir del contexto.` : '- Instagram: No provisto')}

${realTt && realTt.isLiveVerified ? `
TIKTOK (@${realTt.username}) - [DATOS REALES EXTRAÍDOS EN VIVO]:
- Nombre en Perfil: "${realTt.fullName}"
- Biografía Actual: "${realTt.bio.replace(/\n/g, ' ')}"
- Seguidores: ${realTt.followersCount}
- Likes Totales: ${realTt.likesCount || 0}
- Videos Totales: ${realTt.postsCount || 0}
- Enlace en Bio: ${realTt.hasLinkInBio ? 'SÍ (' + (realTt.linkUrl || 'detectado') + ')' : 'NO (Falta enlace directo)'}
` : (cleanTt ? `TikTok (@${cleanTt}): No se pudo extraer datos en vivo. Deducir del contexto.` : '- TikTok: No provisto')}

${input.niche ? `- Nicho declarado: ${input.niche}` : ''}
${input.archetype ? `- Arquetipo solicitado: ${input.archetype}` : ''}

Debes responder ÚNICAMENTE con un objeto JSON válido (sin Markdown, sin backticks \`\`\`json):
{
  "overallScore": ${baselineReport.overallScore},
  "scoreSummary": "Diagnóstico conciso e implacable de 1 o 2 oraciones identificando el patrón clínico.",
  "detectedArchetype": {
    "id": "${baselineReport.detectedArchetype?.id || 'ecommerce_physical'}",
    "label": "${baselineReport.detectedArchetype?.label || 'E-Commerce'}",
    "badge": "${baselineReport.detectedArchetype?.badge || '🛍️ Retail'}",
    "description": "${baselineReport.detectedArchetype?.description || ''}",
    "operationalRules": [
      "Regla operativa 1",
      "Regla operativa 2",
      "Regla operativa 3"
    ]
  },
  "forensicDiagnosis": {
    "clinicalPattern": "${baselineReport.forensicDiagnosis?.clinicalPattern || 'Síndrome del Perfil Folleto'}",
    "symptom": "Qué se observa de inmediato en el perfil que frena las conversiones",
    "rootCause": "Por qué este error destruye la retención y el alcance algorítmico",
    "prescribedAction": "Acción técnica de choque inmediata"
  },
  "cqsBreakdown": {
    "hookRetentionScore": 20,
    "valuePropScore": 17,
    "pacingVisualScore": 13,
    "audioQualityScore": 10,
    "ctaSafeZonesScore": 4
  },
  "profileUnderstanding": {
    "valuePropositionReview": "Evaluación crítica de la regla de los 3 segundos",
    "bioDiagnosis": {
      "negativeElements": ["Elemento que resta autoridad 1", "Elemento que resta autoridad 2"],
      "positiveElements": ["Elemento positivo 1", "Elemento positivo 2"],
      "transformationHook": "Gancho de transformación propuesto sin clichés"
    },
    "brandTone": "authoritative",
    "brandToneDescription": "Tono específico recomendado para este arquetipo"
  },
  "concreteImprovements": {
    "bioOptions": {
      "authority": "Opción 1: Autoridad y Liderazgo (lista para copiar)",
      "directBenefit": "Opción 2: Beneficio Directo al Cliente (lista para copiar)",
      "minimalist": "Opción 3: Minimalista y Directa (lista para copiar)"
    },
    "conversionRoute": {
      "recommendedCta": "Llamada a la acción recomendada hacia el enlace",
      "linkStructure": [
        "Botón 1: 💬 Canal directo prioritario",
        "Botón 2: 📦 Catálogo o prueba social",
        "Botón 3: ⭐ Reseñas o llamada de diagnóstico"
      ]
    },
    "highlightStories": [
      { "title": "Empezá acá", "description": "Qué hace la marca y su diferenciador real", "coverColor": "#F59E0B" },
      { "title": "Oferta / Catálogo", "description": "Productos o servicios explicados al detalle", "coverColor": "#10B981" },
      { "title": "Resultados", "description": "Prueba social y testimonios reales", "coverColor": "#6366F1" },
      { "title": "Contacto", "description": "Pasos para comprar o reservar en 1 toque", "coverColor": "#EC4899" }
    ]
  },
  "actionPlan": {
    "weeklyStoriesRoutine": [
      { "day": "Día 1", "dayType": "Tipo de Story Estratégica", "description": "Instrucción de grabación exacta para la story" },
      { "day": "Día 2", "dayType": "Detrás de Escena & Proceso", "description": "Instrucción de grabación exacta para la story" },
      { "day": "Día 3", "dayType": "Venta Directa Sin Fricción", "description": "Instrucción de grabación exacta para la story" }
    ],
    "viralReelsIdeas": [
      {
        "category": "Educativo",
        "hook0to3s": "Frase hablada exacta y acción en cámara de 0-1.5s",
        "developmentPacing": "Ritmo de cortes cada 1.2s-1.8s",
        "cta": "Llamado a la acción de alto valor útil (sin decir 'comentá INFO')"
      },
      {
        "category": "Rompiendo un mito/dolor",
        "hook0to3s": "Frase hablada exacta y acción en cámara de 0-1.5s",
        "developmentPacing": "Ritmo de cortes cada 1.2s-1.8s",
        "cta": "Llamado a la acción hacia la bio o compartir"
      },
      {
        "category": "Storytelling / Detrás de escena",
        "hook0to3s": "Frase hablada exacta y acción en cámara de 0-1.5s",
        "developmentPacing": "Ritmo de cortes cada 1.2s-1.8s",
        "cta": "Llamado a la acción hacia historias destacadas"
      }
    ]
  },
  "weeklyPriorities": [
    {
      "id": 1,
      "title": "Optimizar Biografía y Enlace Directo",
      "description": "Copia la biografía sugerida y activa tu enlace de ventas.",
      "category": "profile",
      "completed": false
    },
    {
      "id": 2,
      "title": "Grabar Reel #1 con el Studio Engine",
      "description": "Utiliza la guía de rodaje para filmar con luz natural y cortes rápidos.",
      "category": "content",
      "completed": false
    },
    {
      "id": 3,
      "title": "Activar Ciclo de Stories Semanal",
      "description": "Publica la rutina semanal adaptada al ciclo de compra de tu arquetipo.",
      "category": "consistency",
      "completed": false
    }
  ]
}
`;

  const modelsToTry = ['gemini-flash-lite-latest', 'gemini-3.8-flash'];
  const interactionInputs: Array<{ type: 'text'; text: string }> = [
    { type: 'text', text: promptText }
  ];
  let rawText = '';

  for (const modelName of modelsToTry) {
    try {
      const response = await client.interactions.create(
        {
          model: modelName,
          input: interactionInputs,
        },
        {
          retries: { strategy: 'none' },
        }
      );

      rawText = response.output_text || '';
      if (rawText) break;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`Aviso Gemini Audit: Intento con ${modelName} no disponible (${msg}).`);
    }
  }

  if (!rawText) {
    console.warn("Gemini temporalmente no disponible, retornando diagnóstico calibrado.");
    return baselineReport;
  }

  const cleanedText = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleanedText);

    const igAudit: SocialAccountAudit | undefined = cleanIg ? {
      platform: 'instagram',
      username: realIg?.username || cleanIg,
      fullName: realIg?.fullName || parsed.instagram?.fullName || cleanIg,
      bio: realIg?.bio || parsed.instagram?.bio || '',
      suggestedBio: parsed.concreteImprovements?.bioOptions?.directBenefit || parsed.instagram?.suggestedBio || baselineReport.instagram?.suggestedBio || '',
      followersCount: realIg?.isLiveVerified ? realIg.followersCount : (parsed.instagram?.followersCount || baselineReport.instagram?.followersCount || 0),
      followingCount: realIg?.followingCount,
      postsCount: realIg?.postsCount,
      avatarUrl: realIg?.avatarUrl,
      isLiveVerified: realIg?.isLiveVerified || false,
      hasLinkInBio: realIg?.isLiveVerified ? realIg.hasLinkInBio : Boolean(parsed.instagram?.hasLinkInBio),
      linkUrl: realIg?.linkUrl || parsed.instagram?.linkUrl,
      lastPostDaysAgo: parsed.instagram?.lastPostDaysAgo || 5,
      reelsRatioPercentage: parsed.instagram?.reelsRatioPercentage || 45,
      healthStatus: parsed.instagram?.healthStatus || baselineReport.instagram?.healthStatus || 'warning',
      statusLabel: parsed.instagram?.statusLabel || baselineReport.instagram?.statusLabel || '🟡 Requiere Optimización',
      recommendations: parsed.instagram?.recommendations || baselineReport.instagram?.recommendations || []
    } : undefined;

    const ttAudit: SocialAccountAudit | undefined = cleanTt ? {
      platform: 'tiktok',
      username: realTt?.username || cleanTt,
      fullName: realTt?.fullName || parsed.tiktok?.fullName || cleanTt,
      bio: realTt?.bio || parsed.tiktok?.bio || '',
      suggestedBio: parsed.concreteImprovements?.bioOptions?.minimalist || parsed.tiktok?.suggestedBio || baselineReport.tiktok?.suggestedBio || '',
      followersCount: realTt?.isLiveVerified ? realTt.followersCount : (parsed.tiktok?.followersCount || baselineReport.tiktok?.followersCount || 0),
      followingCount: realTt?.followingCount,
      postsCount: realTt?.postsCount,
      likesCount: realTt?.likesCount,
      avatarUrl: realTt?.avatarUrl,
      isLiveVerified: realTt?.isLiveVerified || false,
      hasLinkInBio: realTt?.isLiveVerified ? realTt.hasLinkInBio : Boolean(parsed.tiktok?.hasLinkInBio),
      linkUrl: realTt?.linkUrl || parsed.tiktok?.linkUrl,
      lastPostDaysAgo: parsed.tiktok?.lastPostDaysAgo || 8,
      reelsRatioPercentage: parsed.tiktok?.reelsRatioPercentage || 90,
      healthStatus: parsed.tiktok?.healthStatus || baselineReport.tiktok?.healthStatus || 'warning',
      statusLabel: parsed.tiktok?.statusLabel || baselineReport.tiktok?.statusLabel || '🟡 Cuenta con Potencial',
      recommendations: parsed.tiktok?.recommendations || baselineReport.tiktok?.recommendations || []
    } : undefined;

    return {
      ...baselineReport,
      overallScore: typeof parsed.overallScore === 'number' ? parsed.overallScore : baselineReport.overallScore,
      scoreSummary: parsed.scoreSummary || baselineReport.scoreSummary,
      detectedArchetype: parsed.detectedArchetype || baselineReport.detectedArchetype,
      forensicDiagnosis: parsed.forensicDiagnosis || baselineReport.forensicDiagnosis,
      cqsBreakdown: parsed.cqsBreakdown || baselineReport.cqsBreakdown,
      instagram: igAudit || baselineReport.instagram,
      tiktok: ttAudit || baselineReport.tiktok,
      weeklyPriorities: (parsed.weeklyPriorities && parsed.weeklyPriorities.length > 0) ? parsed.weeklyPriorities : baselineReport.weeklyPriorities,
      profileUnderstanding: parsed.profileUnderstanding || baselineReport.profileUnderstanding,
      concreteImprovements: parsed.concreteImprovements || baselineReport.concreteImprovements,
      actionPlan: parsed.actionPlan || baselineReport.actionPlan,
    };
  } catch (err) {
    console.error('Error parseando JSON de Gemini Audit:', err, 'Respuesta cruda:', rawText);
    return baselineReport;
  }
}

export function generateDynamicAuditFallback(input: { 
  igUsername?: string; 
  ttUsername?: string; 
  niche?: string;
  archetype?: BusinessArchetype;
  realIg?: RealSocialProfile | null;
  realTt?: RealSocialProfile | null;
}): AuditReport {
  const mainUsername = input.igUsername || input.ttUsername || 'marca';
  const realIg = input.realIg;
  const realTt = input.realTt;

  const formattedName = realIg?.fullName || realTt?.fullName || mainUsername
    .replace(/[._-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const bioCombined = `${realIg?.bio || ''} ${realTt?.bio || ''}`;
  const detectedArchetypeId = detectArchetype({
    username: mainUsername,
    bio: bioCombined,
    niche: input.niche,
    explicitArchetype: input.archetype
  });

  const cfg = ARCHETYPE_CONFIGS[detectedArchetypeId];

  // Scoring CQS
  const hasLink = Boolean(realIg?.hasLinkInBio || realTt?.hasLinkInBio);
  const score = hasLink ? 68 : 52;
  const cqsBreakdown = hasLink ? {
    hookRetentionScore: 21,
    valuePropScore: 19,
    pacingVisualScore: 14,
    audioQualityScore: 10,
    ctaSafeZonesScore: 4
  } : {
    hookRetentionScore: 17,
    valuePropScore: 13,
    pacingVisualScore: 11,
    audioQualityScore: 8,
    ctaSafeZonesScore: 3
  };

  const detectedArchetypeProfile: ArchetypeProfile = {
    id: detectedArchetypeId,
    label: cfg.label,
    badge: cfg.badge,
    description: cfg.description,
    operationalRules: cfg.operationalRules
  };

  const forensicDiagnosis: ForensicDiagnosis = {
    clinicalPattern: cfg.clinicalPattern,
    symptom: cfg.symptom,
    rootCause: cfg.rootCause,
    prescribedAction: cfg.prescribedAction
  };

  const igAudit: SocialAccountAudit | undefined = input.igUsername ? {
    platform: 'instagram',
    username: realIg?.username || input.igUsername,
    fullName: realIg?.fullName || formattedName,
    bio: realIg?.bio || `${formattedName} • Cuenta oficial.`,
    suggestedBio: `${cfg.bioOptions.directBenefit}`,
    followersCount: realIg?.isLiveVerified ? realIg.followersCount : 1500,
    followingCount: realIg?.followingCount,
    postsCount: realIg?.postsCount,
    avatarUrl: realIg?.avatarUrl,
    isLiveVerified: realIg?.isLiveVerified || false,
    hasLinkInBio: realIg?.isLiveVerified ? realIg.hasLinkInBio : false,
    linkUrl: realIg?.linkUrl,
    lastPostDaysAgo: 5,
    reelsRatioPercentage: 35,
    healthStatus: 'warning',
    statusLabel: realIg?.hasLinkInBio ? '🟢 Perfil con Enlace' : '🟡 Requiere Optimización',
    recommendations: [
      hasLink 
        ? 'Tu enlace está activo pero optimiza el mensaje de llegada: envía al usuario directo a WhatsApp o catálogo en 1 toque.'
        : `Tu biografía no tiene enlace directo. Padece de ${cfg.clinicalPattern}: los clientes no tienen dónde comprar o pedir rápido.`,
      `Aplica las reglas operativas de ${cfg.label}: ${cfg.operationalRules[0]}.`,
      `Eleva la frecuencia de Reels verticales al 80%+ eliminando preámbulos y usando cortes cada 1.4s.`
    ]
  } : undefined;

  const ttAudit: SocialAccountAudit | undefined = input.ttUsername ? {
    platform: 'tiktok',
    username: realTt?.username || input.ttUsername,
    fullName: realTt?.fullName || formattedName,
    bio: realTt?.bio || `Contenido de ${formattedName}`,
    suggestedBio: `${cfg.bioOptions.minimalist}`,
    followersCount: realTt?.isLiveVerified ? realTt.followersCount : 800,
    followingCount: realTt?.followingCount,
    postsCount: realTt?.postsCount,
    likesCount: realTt?.likesCount,
    avatarUrl: realTt?.avatarUrl,
    isLiveVerified: realTt?.isLiveVerified || false,
    hasLinkInBio: realTt?.isLiveVerified ? realTt.hasLinkInBio : false,
    linkUrl: realTt?.linkUrl,
    lastPostDaysAgo: 8,
    reelsRatioPercentage: 90,
    healthStatus: 'warning',
    statusLabel: realTt?.hasLinkInBio ? '🟢 Cuenta Activa' : '🟡 Cuenta con Potencial Desaprovechado',
    recommendations: [
      `En TikTok la retención se gana en los primeros 1.2s: ${cfg.operationalRules[1]}.`,
      'Nunca comiences diciendo tu nombre ni saludando a la cámara.',
      'Música trending rítmica al 12% con voz frontal nítida.'
    ]
  } : undefined;

  return {
    overallScore: score,
    cqsBreakdown,
    detectedArchetype: detectedArchetypeProfile,
    forensicDiagnosis,
    scoreSummary: `El perfil de @${mainUsername} presenta ${cfg.clinicalPattern}. Arquetipo asignado: ${cfg.label}.`,
    instagram: igAudit,
    tiktok: ttAudit,
    weeklyPriorities: [
      {
        id: 1,
        title: `Corregir ${cfg.clinicalPattern}`,
        description: cfg.prescribedAction,
        category: 'profile',
        completed: false
      },
      {
        id: 2,
        title: `Grabar Reel #1 (${cfg.reels[0].category})`,
        description: `Gancho en 0-1.5s: ${cfg.reels[0].hook0to3s}`,
        category: 'content',
        completed: false
      },
      {
        id: 3,
        title: `Activar Ciclo de Stories (${cfg.storiesRoutine[0].day})`,
        description: `${cfg.storiesRoutine[0].dayType}: ${cfg.storiesRoutine[0].description}`,
        category: 'consistency',
        completed: false
      }
    ],
    profileUnderstanding: {
      valuePropositionReview: `Evaluación 3s: El perfil actual dispersa al visitante con generalidades. Debe comunicar el beneficio exclusivo de ${cfg.label} de inmediato sin preámbulos.`,
      bioDiagnosis: {
        negativeElements: [
          'Falta de un gancho de transformación claro en la primera línea.',
          'Ausencia de llamado a la acción imperativo hacia un canal directo.',
          'Uso de clichés o frases pasivas que no convierten.'
        ],
        positiveElements: [
          `Identidad de marca reconocible para @${mainUsername}.`,
          `Potencial en el arquetipo de ${cfg.label}.`
        ],
        transformationHook: `La solución directa y comprobada de ${formattedName} para tu día a día.`
      },
      brandTone: detectedArchetypeId === 'b2b_services_high_ticket' ? 'authoritative' : (detectedArchetypeId === 'personal_brand_creator' ? 'educational' : 'empathetic'),
      brandToneDescription: `Tono calibrado para ${cfg.label} con foco en cero clichés y alta conversión.`
    },
    concreteImprovements: {
      bioOptions: {
        authority: cfg.bioOptions.authority,
        directBenefit: cfg.bioOptions.directBenefit,
        minimalist: cfg.bioOptions.minimalist
      },
      conversionRoute: {
        recommendedCta: 'Ruta de conversión sin fricción (máximo 3 botones directos):',
        linkStructure: cfg.links
      },
      highlightStories: cfg.highlights
    },
    actionPlan: {
      weeklyStoriesRoutine: cfg.storiesRoutine,
      viralReelsIdeas: cfg.reels
    }
  };
}

// =========================================================================
// GENERADOR DE LOS 4 PILARES: ENTRE RETENCIÓN, VALOR, CONFIANZA Y MONETIZACIÓN
// =========================================================================
export async function generateFourPillarsPlanWithGemini(input: ProductInput): Promise<FourPillarsPlan> {
  const archetype = input.selectedArchetype || 'creator_founder';
  const isDigital = input.type === 'digital' || input.type === 'service';
  const digitalInfo = input.digitalDetails;

  const archetypesDict: Record<CreatorArchetypeId, string> = {
    creator_founder: 'Creator Founder (Construye en público, muestra el negocio detrás de escena, decisiones difíciles y visión)',
    industry_specialist: 'Especialista de Nicho (Autoridad implacable, datos duros, desgloses paso a paso y tutoriales de alta densidad)',
    relatable_entertainer: 'Espejo Cómico / Relatable (Sketches de situaciones cotidianas del cliente, ironía sana y contrastes)',
    curator_experimenter: 'Curador y Experimentador (Pruebas de estrés, comparativas A vs B, auditorías de terceros)',
    storyteller_visionary: 'Narrador Visionario (Historias de transformación humana, antes y después emocional, épica del cliente)'
  };

  const entityDescription = isDigital && digitalInfo
    ? `SERVICIO O PRODUCTO DIGITAL:
- Categoría: ${digitalInfo.category}
- Promesa de transformación: "${digitalInfo.transformationPromise || input.description}"
- Dolor crítico que resuelve: "${digitalInfo.painPointSolved || 'Pérdida de tiempo y fricción'}"
- Público objetivo: "${digitalInfo.targetAudience || 'Profesionales o negocios'}"
- Formato de entrega: "${digitalInfo.deliveryFormat || 'Online / Asesoría'}"
- URL de referencia: "${digitalInfo.websiteUrl || 'No especificada'}"`
    : `PRODUCTO FÍSICO:
- Nombre: "${input.name}"
- Descripción: "${input.description}"`;

  const promptText = `
Actúas como el Director Creativo de mayor nivel para creadores de video vertical en TikTok, Instagram Reels y YouTube Shorts (con las mecánicas de retención de Alex Hormozi y MrBeast).

Tu misión es crear el PLAN ESTRATÉGICO DE LOS 4 PILARES DE REDES SOCIALES para esta oferta:
Nombre: "${input.name}"
Tipo: ${input.type.toUpperCase()}
Arquetipo de Voz: ${archetypesDict[archetype]}

DETALLE DE LA OFERTA:
${entityDescription}

REGLAS DE ORO DE LOS 4 PILARES:
1. PILAR 1 - ENTRETENIMIENTO (ALCANCE / TOFU):
   - Misión: Atrapar a extraños que nunca te vieron. Cero autobombo.
   - Formato: Mito roto, POV relatable, ironía o demostración de choque.
2. PILAR 2 - EDUCACIÓN (VALOR / MOFU):
   - Misión: Que el usuario guarde el video. Utilidad quirúrgica en 20 segundos.
   - Formato: 3 errores silenciosos, regla contra-intuitiva o paso a paso sin relleno.
3. PILAR 3 - NARRACIÓN (CONFIANZA / MOFU):
   - Misión: Conectar con la persona detrás de la marca (clave para ${archetypesDict[archetype]}).
   - Formato: Por qué creamos esto, la decisión que casi me arruina, o el detrás de escena sin filtro.
4. PILAR 4 - CONVERSIÓN (MONETIZACIÓN / BOFU):
   - Misión: Facturación directa con fricción mínima.
   - Formato: Desarme de objeción + prueba irrefutable + llamada a la acción irresistible (ej: "Comenta PALABRA").

INSTRUCCIÓN DE RODAJE CON CELULAR:
- Si es FÍSICO: planos macro a 10cm, plano cenital 90°, luz natural a 45°.
- Si es DIGITAL / SERVICIO: plano medio mirando al lente con gestos firmes, captura de pantalla de laptop o tablet, B-roll escribiendo o mostrando el resultado en pantalla dividida.

Genera ÚNICAMENTE un objeto JSON válido con esta estructura:
{
  "entertainment": {
    "title": "Título corto y magnético",
    "hook0to3s": {
      "spokenText": "Frase exacta para decir en 0-3s",
      "visualAction": "Acción física en 0-1.5s frente a la cámara",
      "onScreenText": "Texto en zona segura de TikTok/IG",
      "psychologicalTrigger": "Curiosidad extrema / Romper expectativa"
    },
    "scriptOutline": [
      { "section": "Gancho", "time": "0s - 3s", "whatToSay": "...", "whatToShow": "..." },
      { "section": "Quiebre", "time": "3s - 12s", "whatToSay": "...", "whatToShow": "..." },
      { "section": "Remate", "time": "12s - 20s", "whatToSay": "...", "whatToShow": "..." }
    ],
    "directorNotes": {
      "shotAngle": "Ángulo exacto de celular",
      "domesticLighting": "Instrucción de luz casera",
      "pacingAndCuts": "Frecuencia de corte (ej: cada 1.2s)",
      "recommendedSoundtrack": "Estilo de audio viral o BPM"
    },
    "callToAction": {
      "spokenCta": "Frase final de cierre",
      "onScreenText": "Texto final en pantalla",
      "frictionLevel": "ultra_low"
    }
  },
  "education": { /* misma estructura */ },
  "storytelling": { /* misma estructura */ },
  "conversion": { /* misma estructura */ }
}
`;

  try {
    if (!apiKey) throw new Error('No API key');
    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [promptText],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.entertainment || !parsed.conversion) {
      throw new Error('Respuesta incompleta de Gemini');
    }

    return {
      id: `plan-${Date.now()}`,
      entityName: input.name,
      entityType: input.type,
      creatorArchetype: archetype,
      createdAt: new Date().toISOString(),
      entertainment: {
        id: 'pill-ent',
        pillar: 'entertainment',
        pillarLabel: '1. Entretenimiento (Alcance Masivo)',
        ...parsed.entertainment
      },
      education: {
        id: 'pill-edu',
        pillar: 'education',
        pillarLabel: '2. Educación (Autoridad y Valor)',
        ...parsed.education
      },
      storytelling: {
        id: 'pill-sto',
        pillar: 'storytelling',
        pillarLabel: '3. Narración (Confianza y Conexión)',
        ...parsed.storytelling
      },
      conversion: {
        id: 'pill-con',
        pillar: 'conversion',
        pillarLabel: '4. Conversión (Venta y Monetización)',
        ...parsed.conversion
      }
    };
  } catch (err) {
    console.warn('Fallback 4 Pilares activado:', err);
    return getFallbackFourPillarsPlan(input);
  }
}

// Fallback determinista para 4 Pilares
function getFallbackFourPillarsPlan(input: ProductInput): FourPillarsPlan {
  const isDigital = input.type === 'digital' || input.type === 'service';
  const name = input.name || 'tu proyecto';

  return {
    id: `plan-${Date.now()}`,
    entityName: name,
    entityType: input.type,
    creatorArchetype: input.selectedArchetype || 'creator_founder',
    createdAt: new Date().toISOString(),
    entertainment: {
      id: 'pill-ent',
      pillar: 'entertainment',
      pillarLabel: '1. Entretenimiento (Alcance Masivo)',
      title: `El error que el 90% comete con ${name}`,
      hook0to3s: {
        spokenText: `"Si todavía hacés esto en 2026, estás perdiendo plata todos los días."`,
        visualAction: isDigital 
          ? 'Mirada atónita a la pantalla de la laptop, golpe suave en el escritorio y giro rápido hacia el lente.'
          : 'Sostener el producto a 10cm de la cámara, sacarlo de cuadro de golpe y traer el reemplazo.',
        onScreenText: 'PAREN DE HACER ESTO ⚠️',
        psychologicalTrigger: 'Disrupción cognitiva instantánea y miedo a perder ventaja'
      },
      scriptOutline: [
        { section: 'Gancho', time: '0s - 3s', whatToSay: 'Si todavía haces esto, estás tirando tiempo a la basura.', whatToShow: 'Primer plano expresivo.' },
        { section: 'Quiebre', time: '3s - 14s', whatToSay: 'Todo el mundo cree que más esfuerzo significa más resultados, pero la realidad es otra.', whatToShow: isDigital ? 'Screen recording mostrando el dolor habitual.' : 'Plano detalle del producto en acción rápida.' },
        { section: 'Remate', time: '14s - 22s', whatToSay: 'Guardá esto antes de que cometas el mismo error mañana.', whatToShow: 'Mirada directa con micro-zoom.' }
      ],
      directorNotes: {
        shotAngle: 'Plano Medio a la altura de los ojos (45° respecto a ventana)',
        domesticLighting: 'Luz natural de ventana lateral con cortina blanca como difusor casero',
        pacingAndCuts: 'Corte rápido cada 1.4s en los primeros 5 segundos',
        recommendedSoundtrack: 'Trending beat de suspenso / Phonk sutil al 12% de volumen'
      },
      callToAction: {
        spokenCta: 'Guardalo para cuando te pase.',
        onScreenText: 'Guardar 📌',
        frictionLevel: 'ultra_low'
      }
    },
    education: {
      id: 'pill-edu',
      pillar: 'education',
      pillarLabel: '2. Educación (Autoridad y Valor)',
      title: `3 reglas no negociables de ${name}`,
      hook0to3s: {
        spokenText: `"Acá tenés la fórmula exacta para resolver esto en menos de 2 minutos."`,
        visualAction: 'Mano levantando 3 dedos rápido mientras te acercas a la cámara.',
        onScreenText: '3 REGLAS CLAVE 🧠',
        psychologicalTrigger: 'Promesa de utilidad tangible de alta densidad'
      },
      scriptOutline: [
        { section: 'Regla 1', time: '0s - 7s', whatToSay: 'Regla 1: Cortá lo que no suma. Menos es más.', whatToShow: 'Paso 1 en pantalla con texto grande.' },
        { section: 'Regla 2', time: '7s - 15s', whatToSay: 'Regla 2: El orden importa más que la velocidad.', whatToShow: 'B-roll en plano cenital mostrando el método.' },
        { section: 'Regla 3', time: '15s - 24s', whatToSay: 'Regla 3: Si no lo mides, no existe.', whatToShow: 'Cierre con resumen en 1 frase.' }
      ],
      directorNotes: {
        shotAngle: 'Plano Picado 45° a la mesa de trabajo o monitor',
        domesticLighting: 'Lámpara de escritorio rebotada contra pared blanca para evitar brillos',
        pacingAndCuts: 'Corte exacto cada vez que cambia el número de regla',
        recommendedSoundtrack: 'Lofi orgánico con ritmo constante sin picos distractores'
      },
      callToAction: {
        spokenCta: 'Compartilo con quien lo necesite hoy.',
        onScreenText: 'Enviar a un amigo ↗️',
        frictionLevel: 'ultra_low'
      }
    },
    storytelling: {
      id: 'pill-sto',
      pillar: 'storytelling',
      pillarLabel: '3. Narración (Confianza y Conexión)',
      title: `Por qué creé ${name} (La historia sin filtro)`,
      hook0to3s: {
        spokenText: `"Casi nadie sabe esto, pero hace unos meses estuve a punto de mandar todo al diablo."`,
        visualAction: 'Sentado en el taller o escritorio en posición relajada y vulnerable, acomodando el celular.',
        onScreenText: 'Casi lo dejo acá... 💭',
        psychologicalTrigger: 'Vulnerabilidad real y empatía de Founder'
      },
      scriptOutline: [
        { section: 'Crisis', time: '0s - 8s', whatToSay: 'Estaba cansado de ver productos que prometían todo y no cumplían nada.', whatToShow: 'Plano cerrado al rostro, iluminación más cálida.' },
        { section: 'Punto de Inflexión', time: '8s - 18s', whatToSay: 'Ahí fue cuando decidí hacer las cosas a mi manera, aunque fuera más difícil.', whatToShow: 'Metraje real del trabajo, bocetos o el taller.' },
        { section: 'Misión', time: '18s - 28s', whatToSay: 'Hoy esto no es solo un negocio, es una obsesión por hacer las cosas bien.', whatToShow: 'Plano medio sonriendo con el producto o equipo en mano.' }
      ],
      directorNotes: {
        shotAngle: 'Plano Primer Plano (Close-up) mirando a cámara',
        domesticLighting: 'Iluminación cálida lateral, ambiente íntimo sin luces de techo directas',
        pacingAndCuts: 'Tomas más largas (2.5s - 3.5s) dejando respirar la emoción',
        recommendedSoundtrack: 'Piano o cuerdas emotivas cinemáticas al 8% de volumen'
      },
      callToAction: {
        spokenCta: 'Contame en los comentarios si te sentiste identificado alguna vez.',
        onScreenText: '¿Te pasó alguna vez? Dejalo en comentarios 👇',
        frictionLevel: 'low'
      }
    },
    conversion: {
      id: 'pill-con',
      pillar: 'conversion',
      pillarLabel: '4. Conversión (Venta y Monetización)',
      title: `Cómo conseguir ${name} antes de que se agote`,
      hook0to3s: {
        spokenText: `"Si estabas buscando una solución definitiva para esto, tenés que ver esto antes de que cerremos cupos."`,
        visualAction: isDigital 
          ? 'Split screen: a la izquierda tu rostro hablando, a la derecha el chat de un cliente feliz o el software funcionando.'
          : 'Plano cenital con el producto en mano mostrando el unboxing limpio y empaque prémium.',
        onScreenText: 'SOLO POR HOY 🚀',
        psychologicalTrigger: 'Urgencia legítima y propuesta de valor sin vueltas'
      },
      scriptOutline: [
        { section: 'Beneficio', time: '0s - 7s', whatToSay: `Con ${name} resolvés el problema de raíz en menos de 24 horas.`, whatToShow: 'Demostración del producto en uso.' },
        { section: 'Objeción', time: '7s - 15s', whatToSay: 'Y si tenés dudas, te lo garantizamos al 100%. Cero riesgo para vos.', whatToShow: 'Texto claro con la garantía en pantalla.' },
        { section: 'Cierre', time: '15s - 22s', whatToSay: 'Comentá la palabra "ACCESO" y te paso el enlace directo por privado.', whatToShow: 'Mano señalando hacia el perfil o botón.' }
      ],
      directorNotes: {
        shotAngle: 'Plano Medio Frontal con producto en primer plano',
        domesticLighting: 'Luz limpia y blanca de frente para máxima nitidez de producto o rostro',
        pacingAndCuts: 'Cortes dinámicos cada 1.5s eliminando cualquier segundo muerto',
        recommendedSoundtrack: 'Beat moderno y enérgico de alta frecuencia'
      },
      callToAction: {
        spokenCta: 'Comentá "ACCESO" ahora mismo.',
        onScreenText: 'Comentá "ACCESO" 👇',
        frictionLevel: 'direct'
      }
    }
  };
}

// =========================================================================
// REFINADOR DE IDEAS CRUDAS & CLIMA EMOCIONAL (LABORATORIO)
// =========================================================================
export async function refineIdeaWithGemini(input: RawIdeaInput): Promise<RefinedIdeaKit> {
  const vibesDict: Record<EmotionalVibe, { name: string; style: string }> = {
    peace_minimal: { name: 'Paz / Calma / Minimalismo', style: 'Cortes lentos (3-4s), luz suave natural, música lofi, voz serena y sin estridencias.' },
    energy_hype: { name: 'Energía / Adrenalina', style: 'Cortes cada 1.2s, micro-zooms, gancho disruptivo en el segundo 0.5, beat acelerado.' },
    vulnerability_raw: { name: 'Vulnerabilidad / Intimidad', style: 'Plano cerrado a los ojos, iluminación tenue lateral, confesión sincera, sin música estridente.' },
    urgency_alert: { name: 'Urgencia / Advertencia', style: 'Movimiento rápido hacia la cámara, textos en amarillo/rojo en Safe Zone, tono imperativo.' },
    humor_relatable: { name: 'Humor / Sarcasmo / Relatable', style: 'Contraste entre expectativa y realidad, remate seco, silencios cómicos de 0.5s.' }
  };

  const selectedVibe = vibesDict[input.targetVibe] || vibesDict.energy_hype;

  const promptText = `
Actúas como un Director de Rodaje de Élite para videos verticales (TikTok, Reels, Shorts).
El creador tiene esta IDEA CRUDA en mente:
"${input.rawThought}"

OBJETIVO EMOCIONAL Y CLIMA SELECCIONADO:
${selectedVibe.name}
Guía de estilo del clima: ${selectedVibe.style}

Tu trabajo es transformar esa idea suelta en un KIT DE RODAJE PASO A PASO LISTO PARA FILMAR CON EL CELULAR.
Devuelve ÚNICAMENTE un JSON con esta estructura:
{
  "hookTitle": "Título gancho del video",
  "hook0to3s": {
    "spokenText": "Frase exacta para detener el scroll",
    "visualAction": "Acción física frente al lente",
    "onScreenText": "Texto en Safe Zone"
  },
  "development": [
    { "step": 1, "title": "Paso 1", "spokenText": "...", "visualAction": "...", "durationSeconds": "3s - 7s" },
    { "step": 2, "title": "Paso 2", "spokenText": "...", "visualAction": "...", "durationSeconds": "7s - 14s" },
    { "step": 3, "title": "Paso 3", "spokenText": "...", "visualAction": "...", "durationSeconds": "14s - 22s" }
  ],
  "lightingAndSet": "Instrucción de luz y fondo casero adaptada al clima",
  "cameraAngles": ["Plano 1", "Plano 2", "Plano 3"],
  "editingFormula": {
    "cutFrequency": "Cada cuánto cortar",
    "sfxSuggestions": ["Sonido 1 (ej: Whoosh)", "Sonido 2 (ej: Pop)"],
    "bgMusicStyle": "Vibra y género musical recomendado",
    "captionStyling": "Estilo y color de subtítulos"
  },
  "callToAction": "Frase de cierre accionable"
}
`;

  try {
    if (!apiKey) throw new Error('No API key');
    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [promptText],
      config: { responseMimeType: 'application/json' }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      id: `idea-${Date.now()}`,
      originalIdea: input.rawThought,
      targetVibe: input.targetVibe,
      ...parsed
    };
  } catch (err) {
    console.warn('Fallback Idea Lab activado:', err);
    return {
      id: `idea-${Date.now()}`,
      originalIdea: input.rawThought,
      targetVibe: input.targetVibe,
      hookTitle: 'De la idea a la pantalla viral',
      hook0to3s: {
        spokenText: `"Esto es exactamente lo que nadie te dice sobre ${input.rawThought.slice(0, 30)}..."`,
        visualAction: 'Movimiento rápido hacia la cámara con expresión firme y gesto de atención.',
        onScreenText: 'PRESTÁ ATENCIÓN A ESTO ⚠️'
      },
      development: [
        { step: 1, title: 'El Quiebre', spokenText: input.rawThought, visualAction: 'Plano medio frontal con luz lateral suave.', durationSeconds: '0s - 6s' },
        { step: 2, title: 'La Demostración', spokenText: 'Cuando aplicás esta perspectiva, todo el resultado cambia radicalmente.', visualAction: 'B-roll en plano detalle mostrando la acción concreta.', durationSeconds: '6s - 15s' },
        { step: 3, title: 'La Conclusión', spokenText: 'Guardalo antes de que te olvides.', visualAction: 'Mirada fija al lente y micro-zoom.', durationSeconds: '15s - 22s' }
      ],
      lightingAndSet: selectedVibe.style,
      cameraAngles: ['Plano Medio a la altura de los ojos (45°)', 'Plano Detalle Macro a 15cm', 'Primer Plano enfático'],
      editingFormula: {
        cutFrequency: 'Corte cada 1.5s',
        sfxSuggestions: ['Whoosh al entrar el texto', 'Pop sutil al cambiar de plano'],
        bgMusicStyle: 'Lofi orgánico o beat moderno al 10%',
        captionStyling: 'Subtítulos palabra por palabra en el tercio medio'
      },
      callToAction: 'Dejame en comentarios tu opinión sobre esto.'
    };
  }
}

// =========================================================================
// BÓVEDA DE MICRO-CLIPS & DINÁMICAS DE CAMEO
// =========================================================================
export async function generateMicroClipsWithGemini(context: { productName?: string; category?: MicroFormatCategory }): Promise<MicroClipTemplate[]> {
  const name = context.productName || 'tu producto o servicio';

  return [
    {
      id: 'clip-1',
      title: 'El Loop Infinito de 7 Segundos con Texto Largo',
      category: 'loop_7s_text',
      categoryLabel: 'Micro-Short de Retención 200%',
      durationSeconds: '7 segundos',
      algorithmicReason: 'El video dura 7s pero el texto toma 9s en leerse. El usuario lo lee en bucle dos veces, logrando un 200% de retención algorítmica y forzando a TikTok/Reels a viralizarlo.',
      filmingSteps: [
        'Grabá 7 segundos de un B-roll estético de tu producto o de vos trabajando concentrado (sin hablar).',
        'Caminá despacio o mostrá una textura en movimiento continuo que no tenga un inicio y fin obvio para que el loop sea invisible.',
        'Colocá un texto en pantalla de 4 líneas con una reflexión profunda, lección dura o secreto del rubro.'
      ],
      soundAndEditingRecipe: {
        sfxCue: 'Audio en tendencia sutil sin voz humana',
        musicVibe: 'Audio etéreo / Lofi looping track',
        zoomEffect: 'Lento zoom in digital del 3% a lo largo de los 7s'
      }
    },
    {
      id: 'clip-2',
      title: 'El Cameo Doble: "Yo vs Mi Yo del Pasado"',
      category: 'cameo_dual_role',
      categoryLabel: 'Cameo de Dos Personajes',
      durationSeconds: '20 segundos',
      algorithmicReason: 'La comedia de identificación personal genera picos de comentarios y compartidos en WhatsApp entre colegas.',
      filmingSteps: [
        'Personaje 1 (Tu yo del pasado): Te ponés una gorra o campera y mirás hacia la izquierda. Hacés la pregunta ingenua o te quejás del dolor típico.',
        'Personaje 2 (Tu yo actual): Te sacás la gorra y mirás hacia la derecha respondiéndole con la solución obvia.',
        'Cambiá de lado con un corte limpio sin mover la cámara del trípode o taza.'
      ],
      scriptDialogue: [
        { character: 'Yo del Pasado (Gorra)', dialogue: `"Che, ¿cómo hacés para conseguir resultados con ${name} sin volverte loco?"`, cameraAngle: 'Plano Medio mirando a la izquierda' },
        { character: 'Yo Actual (Normal)', dialogue: `"Fácil: dejé de hacer lo que hace todo el mundo y apliqué esta sola regla..."`, cameraAngle: 'Plano Medio mirando a la derecha' },
        { character: 'Yo del Pasado (Gorra)', dialogue: `"¿En serio era tan simple? No te puedo creer."`, cameraAngle: 'Primer Plano sorprendido' }
      ],
      soundAndEditingRecipe: {
        sfxCue: 'Sonido "Whoosh" cada vez que cambiás de personaje',
        musicVibe: 'Beat cómico / Bassline juguetón',
        zoomEffect: 'Corte seco con ligero cambio de encuadre'
      }
    },
    {
      id: 'clip-3',
      title: 'El Cliente Escéptico que se Sorprende en Vivo',
      category: 'cameo_skeptic',
      categoryLabel: 'Cameo con Interacción Real',
      durationSeconds: '18 segundos',
      algorithmicReason: 'Desarma la objeción más difícil de tu negocio mostrando la reacción genuina de otra persona.',
      filmingSteps: [
        'Pedile a un cliente, socio o amigo que te haga la crítica más dura de tu producto o servicio en voz alta.',
        'Mostrale la solución en 3 segundos en vivo (el producto funcionando o la pantalla).',
        'Capturá el primerísimo primer plano de su reacción honesta de sorpresa.'
      ],
      scriptDialogue: [
        { character: 'Amigo / Cliente', dialogue: `"Todo muy lindo, pero esto seguro tarda un montón o sale carísimo."`, cameraAngle: 'Plano medio de lado' },
        { character: 'Vos', dialogue: `"Mirá esto. Hacé clic acá... fijate cuánto tardó."`, cameraAngle: 'Plano subjetivo (POV) mostrando la prueba' },
        { character: 'Amigo / Cliente', dialogue: `"Ah no... pará, ¿en serio? ¿Así de rápido?"`, cameraAngle: 'Primer plano al rostro de asombro' }
      ],
      soundAndEditingRecipe: {
        sfxCue: 'Click o efecto de sonido táctil en la demostración',
        musicVibe: 'Silencio en la objeción, beat ascendente en la sorpresa',
        zoomEffect: 'Snap zoom rápido en la reacción de sorpresa'
      }
    },
    {
      id: 'clip-4',
      title: 'Match Cut Sensorial: Del Embalaje al Resultado',
      category: 'match_cut_sensory',
      categoryLabel: 'Transición Cinemática Viral',
      durationSeconds: '12 segundos',
      algorithmicReason: 'Las transiciones táctiles impecables disparan la tasa de repetición (rewatch rate) en TikTok.',
      filmingSteps: [
        'Toma 1: Tirás el producto o abres la laptop hacia abajo en un movimiento rápido.',
        'Toma 2: Cortás exactamente en el momento de mayor velocidad y empatás con el producto abierto o el software listo.',
        'El sonido del golpe debe coincidir con el golpe de batería de la música.'
      ],
      soundAndEditingRecipe: {
        sfxCue: 'Efecto de sonido "Boom" o "Impact" sincronizado con el corte',
        musicVibe: 'Beat electrónico o Trap rítmico con caída pesada (drop)',
        zoomEffect: 'Flash blanco de 2 fotogramas en el punto de corte'
      }
    }
  ];
}

