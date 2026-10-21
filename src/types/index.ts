export type ProductType = 'physical' | 'digital' | 'service';
export type VideoGoal = 'sales' | 'viral' | 'authority';

// ==========================================
// 1. TIPOS DE ENTRADA: FÍSICO VS DIGITAL / SERVICIO
// ==========================================
export type DigitalServiceInputMethod = 'url' | 'screenshot' | 'express_quiz';
export type DigitalServiceCategory = 'software_saas' | 'consulting_coaching' | 'digital_product' | 'agency_freelance' | 'local_service';

export interface DigitalServiceDetails {
  category: DigitalServiceCategory;
  inputMethod: DigitalServiceInputMethod;
  websiteUrl?: string;
  screenshotBase64?: string;
  screenshotPreviewUrl?: string;
  targetAudience?: string;
  painPointSolved?: string;
  transformationPromise?: string;
  deliveryFormat?: string; // ej: "Llamada 1 a 1", "SaaS mensual", "Plantilla Notion", "Curso grabado"
}

export interface ProductInput {
  name: string;
  description: string;
  type: ProductType;
  goal: VideoGoal;
  imageBase64?: string;
  imagePreviewUrl?: string;
  digitalDetails?: DigitalServiceDetails;
  selectedArchetype?: CreatorArchetypeId;
}

// ==========================================
// 2. MATRIZ DE LOS 4 PILARES DE REDES SOCIALES
// ==========================================
export type ContentPillarType = 'entertainment' | 'education' | 'storytelling' | 'conversion';

export interface PillarVideoItem {
  id: string;
  pillar: ContentPillarType;
  pillarLabel: string; // "Entretenimiento (Alcance)", "Educación (Valor)", etc.
  title: string;
  hook0to3s: {
    spokenText: string;
    visualAction: string;
    onScreenText: string;
    psychologicalTrigger: string;
  };
  scriptOutline: {
    section: string;
    time: string;
    whatToSay: string;
    whatToShow: string;
  }[];
  directorNotes: {
    shotAngle: string;
    domesticLighting: string;
    pacingAndCuts: string;
    recommendedSoundtrack: string;
  };
  callToAction: {
    spokenCta: string;
    onScreenText: string;
    frictionLevel: 'ultra_low' | 'low' | 'direct'; // ej: "Comentá 'INFO'" vs "Link en bio"
  };
}

export interface FourPillarsPlan {
  id: string;
  entityName: string;
  entityType: ProductType;
  creatorArchetype: CreatorArchetypeId;
  createdAt: string;
  entertainment: PillarVideoItem;
  education: PillarVideoItem;
  storytelling: PillarVideoItem;
  conversion: PillarVideoItem;
}

// ==========================================
// 3. LABORATORIO DE IDEAS CRUDAS & CLIMA EMOCIONAL
// ==========================================
export type EmotionalVibe = 
  | 'peace_minimal'     // Paz, Calma, Minimalismo
  | 'energy_hype'       // Energía, Adrenalina, Dinamismo
  | 'vulnerability_raw' // Vulnerabilidad, Confianza, Intimidad
  | 'urgency_alert'     // Urgencia, Advertencia, FOMO
  | 'humor_relatable';  // Humor, Sarcasmo, Identificación cotidiana

export interface EmotionalVibeOption {
  id: EmotionalVibe;
  label: string;
  emoji: string;
  description: string;
  visualStyle: string;
  audioPacing: string;
}

export interface RawIdeaInput {
  rawThought: string;
  targetVibe: EmotionalVibe;
  productOrServiceName?: string;
  productType?: ProductType;
  creatorArchetype?: CreatorArchetypeId;
}

export interface RefinedIdeaKit {
  id: string;
  originalIdea: string;
  targetVibe: EmotionalVibe;
  hookTitle: string;
  hook0to3s: {
    spokenText: string;
    visualAction: string;
    onScreenText: string;
  };
  development: {
    step: number;
    title: string;
    spokenText: string;
    visualAction: string;
    durationSeconds: string;
  }[];
  lightingAndSet: string;
  cameraAngles: string[];
  editingFormula: {
    cutFrequency: string;
    sfxSuggestions: string[];
    bgMusicStyle: string;
    captionStyling: string;
  };
  callToAction: string;
}

// ==========================================
// 4. ARQUETIPOS DE CREADOR & BENCHMARKING
// ==========================================
export type CreatorArchetypeId = 
  | 'creator_founder'       // El Fundador Creador (muestra el detrás de escena, "build in public")
  | 'industry_specialist'   // El Especialista / Autoridad Técnica (desgloses, tutoriales)
  | 'relatable_entertainer' // El Espejo Cómico (sketches de situaciones cotidianas del cliente)
  | 'curator_experimenter'  // El Curador / Analista (pruebas, comparativas, "analicé 10 herramientas")
  | 'storyteller_visionary';// El Narrador / Emocional (historias de clientes, transformación humana)

export interface CreatorArchetypeDefinition {
  id: CreatorArchetypeId;
  title: string;
  badge: string;
  subtitle: string;
  corePhilosophy: string;
  voiceStyle: string;
  bestFor: string;
  signatureFormats: string[];
  referenceAccounts: {
    handle: string;
    platform: 'instagram' | 'tiktok';
    whyStudyThem: string;
    signatureMove: string;
  }[];
}

// ==========================================
// 5. BÓVEDA DE MICRO-CLIPS, CAMEOS & TRUCOS DE EDICIÓN
// ==========================================
export type MicroFormatCategory = 
  | 'loop_7s_text'      // Video de 6-8s con texto largo para 200% de retención algorítmica
  | 'cameo_dual_role'   // Dos personajes actuados por la misma persona (Yo vs Mi Yo del pasado)
  | 'cameo_skeptic'     // Diálogo con cliente o amigo escéptico
  | 'bts_interruption'  // Interrupción casual detrás de cámara
  | 'match_cut_sensory';// Corte cinemático de movimiento sensorial (tirar producto -> producto abierto)

export interface MicroClipTemplate {
  id: string;
  title: string;
  category: MicroFormatCategory;
  categoryLabel: string;
  durationSeconds: string;
  algorithmicReason: string;
  filmingSteps: string[];
  scriptDialogue?: {
    character: string;
    dialogue: string;
    cameraAngle: string;
  }[];
  soundAndEditingRecipe: {
    sfxCue: string;
    musicVibe: string;
    zoomEffect: string;
  };
}

// ==========================================
// 6. MODELOS PREVIOS (COMPATIBILIDAD Y AUDITORÍA)
// ==========================================
export interface HookConcept {
  id: string;
  title: string;
  spokenHook: string;
  visualHook: string;
  onScreenText: string;
  whyItWorks: string;
  videoId?: string;
  platform?: 'tiktok' | 'instagram';
}

export interface ShotItem {
  number: number;
  timeRange: string;
  shotType: string;
  cameraAngle: string;
  action: string;
  movement: string;
  videoId?: string;
  platform?: 'tiktok' | 'instagram';
}

export interface LightingGuide {
  naturalLight: string;
  indoorSetup: string;
  proTip: string;
  videoId?: string;
  platform?: 'tiktok' | 'instagram';
}

export interface EditingRecipe {
  pacing: string;
  audioStyle: string;
  captionStyle: string;
  exportSettings: string;
  videoId?: string;
  platform?: 'tiktok' | 'instagram';
}

export interface ViralReference {
  id: string;
  title: string;
  formatType: string;
  hookFormula: string;
  whyItWorks: string;
  targetEmotion: string;
  soundSuggestion: string;
  searchKeywords: string;
  platform?: 'tiktok' | 'instagram';
  videoId?: string;
}

export interface ShootingKit {
  id: string;
  productName: string;
  productType: ProductType;
  goal: VideoGoal;
  createdAt: string;
  status: 'to_film' | 'filmed' | 'published';
  hooks: HookConcept[];
  viralReferences?: ViralReference[];
  shotList: ShotItem[];
  lighting: LightingGuide;
  editing: EditingRecipe;
  fourPillarsPlan?: FourPillarsPlan;
}

export interface SocialAccountAudit {
  platform: 'instagram' | 'tiktok';
  username: string;
  fullName: string;
  bio: string;
  suggestedBio?: string;
  statusLabel?: string;
  followersCount: number;
  followingCount?: number;
  postsCount?: number;
  likesCount?: number;
  avatarUrl?: string;
  isLiveVerified?: boolean;
  hasLinkInBio: boolean;
  linkUrl?: string;
  lastPostDaysAgo: number;
  reelsRatioPercentage: number;
  healthStatus: 'good' | 'warning' | 'critical';
  recommendations: string[];
}

export interface ProfileUnderstanding {
  valuePropositionReview: string;
  bioDiagnosis: {
    negativeElements: string[];
    positiveElements: string[];
    transformationHook: string;
  };
  brandTone: 'authoritative' | 'empathetic' | 'transactional' | 'educational';
  brandToneDescription: string;
}

export interface ConcreteImprovements {
  bioOptions: {
    authority: string;
    directBenefit: string;
    minimalist: string;
  };
  conversionRoute: {
    recommendedCta: string;
    linkStructure: string[];
  };
  highlightStories: {
    title: string;
    description: string;
    coverColor?: string;
  }[];
}

export interface ActionPlanDeliverable {
  weeklyStoriesRoutine: {
    day: string;
    dayType: string;
    description: string;
  }[];
  viralReelsIdeas: {
    category: 'Educativo' | 'Rompiendo un mito/dolor' | 'Storytelling / Detrás de escena';
    hook0to3s: string;
    developmentPacing: string;
    cta: string;
  }[];
}

export interface CQSScoreBreakdown {
  hookRetentionScore: number; // 30% - Retención del gancho inicial (0-3s)
  valuePropScore: number;     // 25% - Propuesta de valor en los primeros 5s
  pacingVisualScore: number;  // 20% - Pacing de cortes (1.2s-1.8s)
  audioQualityScore: number;  // 15% - Calidad y balance de audio
  ctaSafeZonesScore: number;  // 10% - CTA y Safe Zones
}

export type BusinessArchetype = 
  | 'ecommerce_physical'
  | 'personal_brand_creator'
  | 'local_gastro_retail'
  | 'b2b_services_high_ticket'
  | 'saas_tech_digital';

export interface ArchetypeProfile {
  id: BusinessArchetype;
  label: string;
  badge: string;
  description: string;
  operationalRules: string[];
}

export interface ForensicDiagnosis {
  clinicalPattern: string;
  symptom: string;
  rootCause: string;
  prescribedAction: string;
}

export interface AuditReport {
  overallScore: number;
  scoreSummary?: string;
  detectedArchetype?: ArchetypeProfile;
  forensicDiagnosis?: ForensicDiagnosis;
  instagram?: SocialAccountAudit;
  tiktok?: SocialAccountAudit;
  cqsBreakdown?: CQSScoreBreakdown;
  weeklyPriorities: {
    id: number;
    title: string;
    description: string;
    category: 'profile' | 'content' | 'consistency';
    completed: boolean;
  }[];
  profileUnderstanding?: ProfileUnderstanding;
  concreteImprovements?: ConcreteImprovements;
  actionPlan?: ActionPlanDeliverable;
}

