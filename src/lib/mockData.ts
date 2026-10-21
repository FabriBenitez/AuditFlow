import { ShootingKit, AuditReport } from '@/types';

export const sampleShootingKit: ShootingKit = {
  id: 'kit-vela-lumiere',
  productName: 'Vela Aromática de Soja (Lavanda & Vainilla)',
  productType: 'physical',
  goal: 'sales',
  createdAt: new Date().toISOString(),
  status: 'to_film',
  viralReferences: [
    {
      id: 'ref-1',
      title: "Formato 'La Prueba de Fuego' (ASMR & Resistencia)",
      formatType: "Demostración Sensorial",
      hookFormula: '"Hice arder esta vela 48 horas seguidas para ver si realmente dura lo que promete..."',
      whyItWorks: "Activa la curiosidad extrema y el morbo de 'poner a prueba' la promesa de la marca.",
      targetEmotion: "Curiosidad y Asombro",
      soundSuggestion: "Audio ASMR crujiente con fuego + beat sutil Lo-Fi de fondo",
      searchKeywords: "candle test asmr, candle burning hack, velas artesanales prueba",
      platform: 'tiktok',
      videoId: '7255909282368949510'
    },
    {
      id: 'ref-2',
      title: "Formato 'POV: Lo que nadie te dice de las velas baratas'",
      formatType: "Educación de Choque / Polarización",
      hookFormula: '"Si te duele la cabeza cuando prendes una vela... mira los ingredientes ahora mismo."',
      whyItWorks: "Rompe una creencia cotidiana y posiciona el producto artesanal como la solución saludable.",
      targetEmotion: "Alerta y Descubrimiento",
      soundSuggestion: "Sonido de suspenso suave o trend de 'Did you know?'",
      searchKeywords: "toxic candles vs soy candles, velas de soja beneficios",
      platform: 'tiktok',
      videoId: '7308945622350712069'
    },
    {
      id: 'ref-3',
      title: "Formato 'Transforma tu cuarto en un Hotel 5 Estrellas'",
      formatType: "Aspiracional / Estilo de Vida",
      hookFormula: '"El truco de 10 segundos que usan los hoteles de lujo para oler increíble todo el día."',
      whyItWorks: "Vende el estatus y la sensación de confort, no las características técnicas del producto.",
      targetEmotion: "Deseo y Satisfacción",
      soundSuggestion: "Música elegante indie-pop o acústica estética",
      searchKeywords: "luxury home aesthetic, hotel room fragrance hack, room makeover",
      platform: 'tiktok',
      videoId: '7295712349887859973'
    }
  ],
  hooks: [
    {
      id: 'hook-1',
      title: 'El Error del "Hueco" (Problema Común)',
      spokenHook: '"Si tus velas siempre se queman solo por el medio y te dejan este pozo horrible... estás cometiendo este error."',
      visualHook: 'Empieza mostrando de cerca una vela mal quemada con un pozo hondo, y luego cortas en seco a tu vela perfecta encendiéndose.',
      onScreenText: 'NO QUEMES TUS VELAS ASÍ 🚫🕯️',
      whyItWorks: 'Activa la curiosidad inmediata mostrando un problema que le pasa al 90% de las personas que compran velas.',
      platform: 'tiktok',
      videoId: '7308945622350712069'
    },
    {
      id: 'hook-2',
      title: 'El Secreto para que tu Casa Huela a Hotel de Lujo',
      spokenHook: '"Un perfumista me enseñó este truco para que toda tu casa huela a hotel 5 estrellas sin gastar una fortuna."',
      visualHook: 'Tomas una cerilla de madera larga, la enciendes en cámara lenta (0.5x) y la acercas a la mecha humeante.',
      onScreenText: 'Tu casa con olor a hotel de lujo ✨🏠',
      whyItWorks: 'Vende un estatus y una emoción de bienestar en lugar de describir el objeto.'
    },
    {
      id: 'hook-3',
      title: 'Detrás de Escena (Artesanal vs Industrial)',
      spokenHook: '"¿Por qué las velas de supermercado te dan dolor de cabeza y esta no? Te muestro la cera real."',
      visualHook: 'Corta un trozo de cera de soja pura con una espátula mostrando la textura cremosa y natural.',
      onScreenText: '¿Por qué te duele la cabeza con velas baratas? ⚠️',
      whyItWorks: 'Educa al consumidor y justifica el precio superior de un producto artesanal.'
    }
  ],
  shotList: [
    {
      number: 1,
      timeRange: '0s - 3s',
      shotType: 'Plano Macro / Detalle Rápido',
      cameraAngle: 'Picado a 45° con movimiento de acercamiento',
      action: 'Enciende la mecha de la vela con fósforo largo; haz un zoom rápido o acerca el celular con la mano firme.',
      movement: 'Acercamiento rápido de 20cm a 5cm',
      platform: 'tiktok',
      videoId: '7295712349887859973'
    },
    {
      number: 2,
      timeRange: '3s - 9s',
      shotType: 'Plano Cenital (Desde Arriba)',
      cameraAngle: 'Cenital a 90° sobre una mesa limpia',
      action: 'Muestra la vela en su entorno: junto a un libro, una taza o un plato de madera, mostrando cómo decora el espacio.',
      movement: 'Cámara fija o rotación suave de 15 grados'
    },
    {
      number: 3,
      timeRange: '9s - 18s',
      shotType: 'Plano Medio / Explicación',
      cameraAngle: 'A la altura de los ojos con el celular en trípode o apoyado',
      action: 'Apareces tú sosteniendo la vela a la altura de tu pecho, explicando los aceites esenciales con sonrisa natural.',
      movement: 'Cámara fija a 1 metro de distancia',
      platform: 'tiktok',
      videoId: '7280456108153441542'
    },
    {
      number: 4,
      timeRange: '18s - 25s',
      shotType: 'Primer Plano + Llamado a la Acción',
      cameraAngle: 'Frontal suave',
      action: 'Muestras la etiqueta con el nombre del aroma y señalas con el dedo hacia abajo o hacia tu perfil.',
      movement: 'Acercas la vela hacia la lente suavemente'
    }
  ],
  lighting: {
    naturalLight: 'Graba de 10:00 a 14:00 cerca de una ventana grande. Pon la ventana al costado (a 45°), NUNCA detrás de ti ni detrás de la vela.',
    indoorSetup: 'Si grabas de noche, usa una lámpara de escritorio rebotada contra una pared blanca para que la luz sea suave y no cree brillos feos en el frasco.',
    proTip: '¡Limpia la lente de tu celular con una tela limpia antes de empezar! El 80% de los videos borrosos son solo grasa de los dedos en el lente.',
    platform: 'tiktok',
    videoId: '7322987550800645408'
  },
  editing: {
    pacing: 'Cortes rápidos cada 1.5 a 2.5 segundos. Elimina cualquier silencio o respiración larga entre frases.',
    audioStyle: 'Trending Upbeat Lofi o acústico acogedor. Volumen de la música de fondo al 12% para que tu voz se escuche clara.',
    captionStyle: 'Subtítulos grandes, tipo sans-serif (ej: The Bold Font o Montserrat), centrados en el medio de la pantalla con color amarillo o blanco con sombra negra.',
    exportSettings: 'Exportar en 1080 x 1920 (Vertical 9:16) a 30 o 60 cuadros por segundo.',
    platform: 'tiktok',
    videoId: '7330545934529858849'
  }
};

export const sampleAuditReport: AuditReport = {
  overallScore: 54,
  scoreSummary: 'El perfil de @velas_lumiere padece de Síndrome del Perfil Folleto: imágenes estáticas sin textura en movimiento y sin enlace de compra directa.',
  detectedArchetype: {
    id: 'ecommerce_physical',
    label: 'E-Commerce & Producto Físico',
    badge: '🛍️ Retail & D2C',
    description: 'Marcas con productos tangibles donde la textura, el packaging y el unboxing mandan sobre las palabras vacías.',
    operationalRules: [
      'Macro a 10cm en segundo 0 para detener el scroll sin preámbulos',
      'Sonido ASMR real sin música tapando la textura física',
      'Demostración de uso real vs alternativa barata de la competencia'
    ]
  },
  forensicDiagnosis: {
    clinicalPattern: 'Síndrome del Perfil Folleto',
    symptom: 'Feed compuesto por fotos estáticas de producto sobre fondo neutro, sin movimiento humano ni contexto de uso real.',
    rootCause: 'El visitante no compra un objeto inanimado, compra la transformación sensorial. Las fotos estáticas tienen 0 retención algorítmica.',
    prescribedAction: 'Reemplazar fotos por videos de 12 segundos mostrando la textura física y la prueba de resistencia o aroma real.'
  },
  cqsBreakdown: {
    hookRetentionScore: 18, // 18 / 30
    valuePropScore: 14,     // 14 / 25
    pacingVisualScore: 11,  // 11 / 20
    audioQualityScore: 8,   // 8 / 15
    ctaSafeZonesScore: 3    // 3 / 10
  },
  instagram: {
    platform: 'instagram',
    username: 'velas_lumiere',
    fullName: 'Lumière Velas Artesanales',
    bio: 'Velas de soja hechas a mano con amor. Envíos a todo el país. Consultas por mensaje directo.',
    followersCount: 1420,
    hasLinkInBio: false,
    lastPostDaysAgo: 8,
    reelsRatioPercentage: 25,
    healthStatus: 'warning',
    recommendations: [
      'Agrega un enlace directo a tu catálogo de WhatsApp o tienda online (ahora los clientes no tienen dónde comprar fácil).',
      'Tu biografía no dice el beneficio claro. Cámbiala por: "Aromaterapia y velas de soja que transforman tu hogar en un spa ✨📦 Envíos rápidos abajo 👇"',
      'Llevas más de una semana sin publicar. El algoritmo prioriza cuentas con al menos 3 posts o reels semanales.'
    ]
  },
  tiktok: {
    platform: 'tiktok',
    username: 'lumiere.velas',
    fullName: 'Lumiere Velas',
    bio: 'Creando velas aromáticas',
    followersCount: 380,
    hasLinkInBio: false,
    lastPostDaysAgo: 14,
    reelsRatioPercentage: 90,
    healthStatus: 'critical',
    recommendations: [
      'No tienes biografía explicativa. Agrega qué problema resuelves y en qué ciudad estás.',
      'Publica al menos 2 videos cortos mostrando el proceso artesanal o el aroma de la semana.',
      'Aprovecha los primeros 3 segundos con ganchos verbales directos.'
    ]
  },
  weeklyPriorities: [
    {
      id: 1,
      title: 'Optimizar la Biografía y Enlace de Instagram',
      description: 'Copia la bio sugerida y agrega tu link directo a WhatsApp.',
      category: 'profile',
      completed: false
    },
    {
      id: 2,
      title: 'Grabar tu primer Reel con la Guía de Rodaje',
      description: 'Usa el Studio Engine con tu producto estrella y graba las 4 tomas frente a la ventana.',
      category: 'content',
      completed: false
    },
    {
      id: 3,
      title: 'Frecuencia: Publicar 3 videos esta semana',
      description: 'Publica martes, jueves y sábado a las 19:00hs.',
      category: 'consistency',
      completed: false
    }
  ],
  profileUnderstanding: {
    valuePropositionReview: 'Falla la regla de los 3 segundos: un visitante nuevo no entiende en qué se diferencian estas velas de una vela industrial genérica ni por qué debería pagar más.',
    bioDiagnosis: {
      negativeElements: [
        'Frase cliché: "hechas a mano con amor" (no comunica beneficio tangible).',
        'Falta de llamado a la acción (CTA) directo.',
        'No cuenta con enlace web o botón directo de WhatsApp.'
      ],
      positiveElements: [
        'Aclaración de envíos a todo el país (reduce fricción geográfica).',
        'Nombre de marca claro y reconocible.'
      ],
      transformationHook: 'Velas aromáticas de cera de soja que eliminan el estrés y convierten tu hogar en un santuario.'
    },
    brandTone: 'empathetic',
    brandToneDescription: 'Tono Cálido y Empático con enfoque de bienestar y autocuidado.'
  },
  concreteImprovements: {
    bioOptions: {
      authority: 'Transformamos tu casa en un spa 5 estrellas ✨ | Cera de soja 100% pura y aceites esenciales botánicos 🌿 | Pedí tu catálogo exclusivo 👇',
      directBenefit: 'Apagá el estrés en 10 minutos con velas aromáticas naturales 🕯️ | Sin humo negro ni químicos tóxicos 📦 Envíos rápidos en 24h 👇',
      minimalist: 'Aromaterapia botánica & velas de soja hechas en Argentina. Envíos a todo el país. Pedidos y catálogo aquí 👇'
    },
    conversionRoute: {
      recommendedCta: 'Toca el enlace abajo para pedir tu catálogo con 10% OFF en tu primera compra:',
      linkStructure: [
        'Botón 1: 💬 Chatear por WhatsApp (Atención Inmediata)',
        'Botón 2: 🕯️ Ver Catálogo de Aromas y Precios 2026',
        'Botón 3: ⭐ Reseñas de más de 800 clientes satisfechos'
      ]
    },
    highlightStories: [
      {
        title: 'Empezá acá',
        description: 'Quiénes somos, nuestra cera de soja pura y por qué no usamos parafina tóxica.',
        coverColor: '#F59E0B'
      },
      {
        title: 'Productos',
        description: 'Nuestros 6 aromas estrella con descripción sensorial y recomendaciones de uso.',
        coverColor: '#10B981'
      },
      {
        title: 'Clientes',
        description: 'Fotos reales de hogares iluminados y mensajes de agradecimiento de compradores.',
        coverColor: '#6366F1'
      },
      {
        title: 'Cómo Comprar',
        description: 'Pasos para hacer tu pedido por WhatsApp, formas de pago y tiempos de entrega.',
        coverColor: '#EC4899'
      }
    ]
  },
  actionPlan: {
    weeklyStoriesRoutine: [
      {
        day: 'Lunes',
        dayType: 'Encuesta e Interacción',
        description: 'Sticker de pregunta: "¿Qué aroma necesitás para arrancar la semana: Cítrico energizante o Lavanda relajante?" + video corto encendiendo la mecha.'
      },
      {
        day: 'Miércoles',
        dayType: 'Detrás de Escena & Proceso',
        description: 'Video POV vertiendo la cera derretida en los frascos. Muestra la textura cremosa y explica la diferencia entre cera vegetal y parafina química.'
      },
      {
        day: 'Viernes',
        dayType: 'Venta Directa & Despachos',
        description: 'Muestra las cajas de pedidos listas para enviar con su packaging perfumado: "Últimos 4 cupos para despachos del fin de semana. Respondé este story y te aparto la tuya".'
      }
    ],
    viralReelsIdeas: [
      {
        category: 'Educativo',
        hook0to3s: '"Si tu vela hace un pozo en el centro y se apaga sola... estás cometiendo este error fatal."',
        developmentPacing: 'Cortes cada 1.5s mostrando cómo recortar la mecha a 5mm y dejar quemar hasta los bordes. Audio trending lofi al 12%.',
        cta: 'Guardá este Reel para que tus velas te duren el doble de tiempo.'
      },
      {
        category: 'Rompiendo un mito/dolor',
        hook0to3s: '"¿Por qué las velas baratas del súper te dan dolor de cabeza a los 20 minutos?"',
        developmentPacing: 'Comparativa visual en pantalla dividida: cera de parafina negra con humo vs cera de soja limpia sin hollín.',
        cta: 'Tocá el link en nuestra bio para ver la prueba de laboratorio entre parafina y cera vegetal.'
      },
      {
        category: 'Storytelling / Detrás de escena',
        hook0to3s: '"Me dijeron que era imposible vivir de hacer velas en Argentina... y hoy despachamos esto."',
        developmentPacing: 'Tomas rápidas macro de taller casero con música emotiva, finalizando con la mesa llena de paquetes listos para correo.',
        cta: 'Mirá nuestras historias destacadas si querés ver el proceso de fabricación completo.'
      }
    ]
  }
};
