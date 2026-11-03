'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  Flame, 
  Eye, 
  Heart, 
  ExternalLink, 
  X, 
  Compass, 
  Zap, 
  ArrowRight, 
  Check, 
  Copy,
  Repeat,
  Volume2
} from 'lucide-react';
import { CURATED_VIRAL_BENCHMARKS } from '@/lib/viralRecommendationsData';
import { ViralRecommendedVideo, ContentPillarType, BusinessArchetype } from '@/types';

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

const PILLAR_FILTERS: { id: ContentPillarType | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'Todos los Pilares', icon: '🌟' },
  { id: 'entertainment', label: 'Entretenimiento (Alcance)', icon: '🚀' },
  { id: 'education', label: 'Educación (Valor)', icon: '💡' },
  { id: 'storytelling', label: 'Narración (Confianza)', icon: '🤝' },
  { id: 'conversion', label: 'Conversión (Ventas)', icon: '💰' },
];

const NICHE_FILTERS: { id: BusinessArchetype | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos los Rubros' },
  { id: 'ecommerce_physical', label: '🛍️ E-Commerce Físico' },
  { id: 'saas_tech_digital', label: '💻 Digital & SaaS' },
  { id: 'personal_brand_creator', label: '👤 Creator Founder' },
  { id: 'local_gastro_retail', label: '📍 Local & Gastro' },
  { id: 'b2b_services_high_ticket', label: '💼 Servicios B2B' },
];

export function ViralRadarFeed() {
  const [selectedPillar, setSelectedPillar] = useState<ContentPillarType | 'all'>('all');
  const [selectedNiche, setSelectedNiche] = useState<BusinessArchetype | 'all'>('all');
  const [activeVideoModal, setActiveVideoModal] = useState<ViralRecommendedVideo | null>(null);

  // Remix Generator State inside Modal
  const [userProductName, setUserProductName] = useState('');
  const [isGeneratingRemix, setIsGeneratingRemix] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<{
    hook: string;
    steps: string[];
    cta: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredVideos = CURATED_VIRAL_BENCHMARKS.filter((item) => {
    if (selectedPillar !== 'all' && item.pillar !== selectedPillar) return false;
    if (selectedNiche !== 'all' && item.niche !== selectedNiche) return false;
    return true;
  });

  const handleOpenModal = (video: ViralRecommendedVideo) => {
    setActiveVideoModal(video);
    setGeneratedScript(null);
    setUserProductName('');
  };

  const handleGenerateCustomRemix = async () => {
    if (!activeVideoModal) return;
    setIsGeneratingRemix(true);

    try {
      // Simulación inmediata o llamada a IA para adaptar la fórmula viral
      const productName = userProductName.trim() || 'tu producto o servicio';
      
      // Adaptación de fórmula con el motor creativo
      setGeneratedScript({
        hook: `"${activeVideoModal.hook0to3s.hookText.replace(/este producto|esto|mi celular/gi, productName)}"`,
        steps: [
          `0-3s: Grabá en plano detalle (a 15cm) mostrando ${productName} mientras decís el gancho sin rodeos.`,
          `3-12s: Demostrá en vivo la objeción más dura de tu cliente con cortes rápidos cada 1.5s.`,
          `12-25s: Mostrá el resultado final satisfactorio con luz natural y expresión de alivio.`,
          `25-30s: Llamado a la acción: "Comentá '${productName.slice(0, 4).toUpperCase()}' y te mando la guía completa al DM".`
        ],
        cta: `Comentá la palabra clave para recibir información directa.`
      });
    } finally {
      setIsGeneratingRemix(false);
    }
  };

  const copyScriptToClipboard = () => {
    if (!generatedScript) return;
    const text = `HOOK VIRAL:\n${generatedScript.hook}\n\nPASOS DE FILMACIÓN:\n${generatedScript.steps.join('\n')}\n\nCTA: ${generatedScript.cta}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 mt-2">
      {/* Hero Header */}
      <div className="rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900/90 to-neutral-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-watermelon-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              RADAR EN VIVO • RECOMENDACIONES DE VIDEOS VIRALES
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Feed de Videos Virales Recomendados
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 mt-2 leading-relaxed">
              Descubrí qué videos superaron el millón de vistas en TikTok e Instagram, míralos reproduciéndose en vivo y usá su fórmula exacta adaptada a tu producto en un clic.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-neutral-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-watermelon-500/20 border border-watermelon-500/30 flex items-center justify-center text-watermelon-400 font-bold">
                <Flame className="w-5 h-5 text-watermelon-400" />
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-medium">Fórmula del Gancho</div>
                <div className="text-sm font-bold text-white">0 a 3 Segundos (Hook)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-neutral-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                <Compass className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-medium">Clasificados por</div>
                <div className="text-sm font-bold text-white">4 Pilares de Contenido</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar Filter Pills */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Filtrar por Pilar de Redes Sociales:
            </span>
            <span className="text-xs text-cyan-400 font-mono">
              {filteredVideos.length} videos encontrados
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PILLAR_FILTERS.map((p) => {
              const isSelected = selectedPillar === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPillar(p.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all btn-press ${
                    isSelected
                      ? 'bg-white text-black shadow-lg shadow-white/10 font-bold scale-[1.02]'
                      : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/50'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Niche Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {NICHE_FILTERS.map((n) => {
              const isSelected = selectedNiche === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setSelectedNiche(n.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                      : 'bg-black/30 hover:bg-black/50 text-neutral-400 border border-neutral-800'
                  }`}
                >
                  {n.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="group rounded-3xl border border-neutral-800/80 bg-neutral-900/60 hover:border-neutral-700 overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-2xl hover:shadow-cyan-950/20"
          >
            {/* Top Preview Card (aspect 16/9 thumbnail with 9:16 indicator) */}
            <div className="relative aspect-[16/10] bg-black overflow-hidden cursor-pointer" onClick={() => handleOpenModal(video)}>
              <img
                src={video.coverUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Badges Top */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-white border border-neutral-700">
                  {video.platform === 'tiktok' ? (
                    <><TikTokIcon className="w-3 h-3 text-cyan-400" /> TikTok</>
                  ) : (
                    <><InstagramIcon className="w-3 h-3 text-pink-400" /> Reel</>
                  )}
                </span>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {video.nicheLabel}
                </span>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-white translate-x-0.5" />
                </div>
              </div>

              {/* Metrics Bottom */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs font-mono text-white">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-bold">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> {video.viewsCount}
                  </span>
                  <span className="flex items-center gap-1 font-bold">
                    <Heart className="w-3.5 h-3.5 text-pink-400" /> {video.likesCount}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-300 font-sans">@{video.creator}</span>
              </div>
            </div>

            {/* Card Content & Hook Breakdown */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs font-semibold text-cyan-400">
                    {video.pillarLabel}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {video.title}
                </h3>

                {/* Hook Box */}
                <div className="p-3 rounded-2xl bg-black/50 border border-neutral-800 text-xs space-y-1.5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
                    ⚡ Gancho 0 a 3s ({video.hook0to3s.hookType}):
                  </div>
                  <p className="font-semibold text-white italic">
                    "{video.hook0to3s.hookText}"
                  </p>
                  <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">
                    💡 <strong>Por qué funcionó:</strong> {video.hook0to3s.whyItHooked}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenModal(video)}
                  className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700/80 text-white text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Ver en Vivo
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenModal(video)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-cyan-950/40"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  Adaptar a Mi Marca
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Reproductor 9:16 + Generador de Remix */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-neutral-700 active:scale-90 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Columna Izquierda: Reproductor Smartphone 9:16 */}
            <div className="md:w-[380px] bg-black p-4 flex flex-col items-center justify-center shrink-0 border-b md:border-b-0 md:border-r border-neutral-800">
              <div className="w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-950 relative border border-neutral-800 shadow-2xl">
                {activeVideoModal.videoUrl ? (
                  <video
                    src={activeVideoModal.videoUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <iframe
                    src={activeVideoModal.embedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    scrolling="no"
                  />
                )}
              </div>

              <div className="w-full max-w-[280px] mt-3 flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>@{activeVideoModal.creator}</span>
                <span className="text-cyan-400 font-bold">{activeVideoModal.viewsCount} reproducciones</span>
              </div>
            </div>

            {/* Columna Derecha: Análisis & Adaptador Instantáneo */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
                  {activeVideoModal.pillarLabel}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {activeVideoModal.title}
                </h3>
              </div>

              {/* Hook breakdown */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  ⚡ Hook Analizado (0-3s):
                </div>
                <div className="text-sm font-semibold text-white italic">
                  "{activeVideoModal.hook0to3s.hookText}"
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {activeVideoModal.hook0to3s.whyItHooked}
                </p>
              </div>

              {/* Interactive Remix Generator */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-950/20 to-neutral-950 border border-purple-900/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-bold text-white">
                    Adaptar esta fórmula viral a mi producto/servicio
                  </h4>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userProductName}
                    onChange={(e) => setUserProductName(e.target.value)}
                    placeholder="Ej: Curso de inglés, Velas aromáticas, Agencia SEO..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCustomRemix}
                    disabled={isGeneratingRemix}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    Adaptar
                  </button>
                </div>

                {generatedScript && (
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs space-y-2.5 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block mb-0.5">
                        Tu Frase de Gancho para decir a cámara:
                      </span>
                      <p className="text-sm font-bold text-white italic">
                        {generatedScript.hook}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Guión escena por escena:
                      </span>
                      {generatedScript.steps.map((st, idx) => (
                        <p key={idx} className="text-neutral-300 text-xs">
                          {st}
                        </p>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={copyScriptToClipboard}
                      className="mt-2 w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {copied ? (
                        <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado al portapapeles</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copiar guión adaptado</>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
