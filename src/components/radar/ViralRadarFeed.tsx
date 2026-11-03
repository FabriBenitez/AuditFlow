'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Pause,
  Sparkles, 
  Flame, 
  Eye, 
  Heart, 
  X, 
  Compass, 
  Zap, 
  Check, 
  Copy,
  ChevronDown,
  ChevronUp
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
  { id: 'all', label: 'Todos', icon: '🌟' },
  { id: 'entertainment', label: 'Entretenimiento', icon: '🚀' },
  { id: 'education', label: 'Educación', icon: '💡' },
  { id: 'storytelling', label: 'Narración', icon: '🤝' },
  { id: 'conversion', label: 'Ventas', icon: '💰' },
];

const NICHE_FILTERS: { id: BusinessArchetype | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos los Rubros' },
  { id: 'ecommerce_physical', label: '🛍️ E-Commerce' },
  { id: 'saas_tech_digital', label: '💻 Digital / SaaS' },
  { id: 'personal_brand_creator', label: '👤 Creator Founder' },
  { id: 'local_gastro_retail', label: '📍 Gastro / Local' },
  { id: 'b2b_services_high_ticket', label: '💼 B2B High-Ticket' },
];

export function ViralRadarFeed() {
  const [selectedPillar, setSelectedPillar] = useState<ContentPillarType | 'all'>('all');
  const [selectedNiche, setSelectedNiche] = useState<BusinessArchetype | 'all'>('all');

  // Video actualmente en reproducción inline
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // ID del video con panel de Remix abierto
  const [activeRemixId, setActiveRemixId] = useState<string | null>(null);
  const [userProductName, setUserProductName] = useState('');
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

  const togglePlayInline = (videoId: string) => {
    if (playingVideoId === videoId) {
      setPlayingVideoId(null);
    } else {
      setPlayingVideoId(videoId);
    }
  };

  const toggleRemix = (videoId: string) => {
    if (activeRemixId === videoId) {
      setActiveRemixId(null);
      setGeneratedScript(null);
    } else {
      setActiveRemixId(videoId);
      setGeneratedScript(null);
      setUserProductName('');
    }
  };

  const handleGenerateCustomRemix = (video: ViralRecommendedVideo) => {
    const productName = userProductName.trim() || 'tu producto o servicio';

    setGeneratedScript({
      hook: `"${video.hook0to3s.hookText.replace(/este producto|esto|mi celular/gi, productName)}"`,
      steps: [
        `0-3s: Grabá en plano detalle (a 15cm) mostrando ${productName} mientras decís el gancho sin rodeos.`,
        `3-12s: Demostrá en vivo la objeción más dura de tu cliente con cortes rápidos cada 1.5s.`,
        `12-25s: Mostrá el resultado final satisfactorio con luz natural y expresión de alivio.`,
        `25-30s: Llamado a la acción: "Comentá '${productName.slice(0, 4).toUpperCase()}' y te mando la guía al DM".`
      ],
      cta: `Comentá la palabra clave para recibir información directa.`
    });
  };

  const copyScriptToClipboard = () => {
    if (!generatedScript) return;
    const text = `HOOK VIRAL:\n${generatedScript.hook}\n\nPASOS DE FILMACIÓN:\n${generatedScript.steps.join('\n')}\n\nCTA: ${generatedScript.cta}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-28 px-2 sm:px-4 mt-1">
      
      {/* Header Compacto Optimizado para Móvil */}
      <div className="rounded-2xl sm:rounded-3xl border border-neutral-800 bg-neutral-900/90 p-4 sm:p-6 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            RADAR VIRAL EN VIVO
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {filteredVideos.length} videos
          </span>
        </div>

        <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
          Recomendaciones de Videos Virales
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
          Tocá cualquier video para reproducirlo verticalmente en 9:16 y usá su gancho de 0 a 3s adaptado a tu negocio.
        </p>

        {/* Filtros de Pilares (Scroll horizontal táctil) */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {PILLAR_FILTERS.map((p) => {
            const isSelected = selectedPillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all btn-press ${
                  isSelected
                    ? 'bg-white text-black shadow-md font-bold'
                    : 'bg-neutral-800/80 text-neutral-300 border border-neutral-700/60'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filtros de Rubro (Scroll horizontal táctil) */}
        <div className="mt-2 flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
          {NICHE_FILTERS.map((n) => {
            const isSelected = selectedNiche === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setSelectedNiche(n.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] shrink-0 transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                    : 'bg-black/30 text-neutral-400 border border-neutral-800'
                }`}
              >
                {n.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Videos en Feed Vertical (Estilo Reels/TikTok) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => {
          const isPlaying = playingVideoId === video.id;
          const isRemixOpen = activeRemixId === video.id;

          return (
            <div
              key={video.id}
              className="rounded-2xl sm:rounded-3xl border border-neutral-800 bg-neutral-900/80 overflow-hidden flex flex-col justify-between shadow-lg"
            >
              {/* Visor de Video 9:16 o Portada */}
              <div className="relative aspect-[9/14] bg-black overflow-hidden flex items-center justify-center">
                {isPlaying ? (
                  // Video en reproducción directa inline
                  video.videoUrl ? (
                    <video
                      src={video.videoUrl}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <iframe
                      src={video.embedUrl}
                      className="w-full h-full border-0"
                      allowFullScreen
                      scrolling="no"
                    />
                  )
                ) : (
                  // Portada previa con botón de play gigante
                  <div 
                    className="relative w-full h-full cursor-pointer group"
                    onClick={() => togglePlayInline(video.id)}
                  >
                    <img
                      src={video.coverUrl}
                      alt={video.title}
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    {/* Botón Central Play */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl active:scale-90 transition-transform">
                        <Play className="w-6 h-6 fill-white translate-x-0.5" />
                      </div>
                    </div>

                    {/* Badges superiores */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/75 backdrop-blur-md text-white border border-neutral-700">
                        {video.platform === 'tiktok' ? (
                          <><TikTokIcon className="w-3 h-3 text-cyan-400" /> TikTok</>
                        ) : (
                          <><InstagramIcon className="w-3 h-3 text-pink-400" /> Reel</>
                        )}
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                        {video.nicheLabel}
                      </span>
                    </div>

                    {/* Métricas inferiores */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-white font-mono">
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
                )}
              </div>

              {/* Botón para detener si está reproduciendo */}
              {isPlaying && (
                <button
                  type="button"
                  onClick={() => togglePlayInline(video.id)}
                  className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 border-t border-neutral-700"
                >
                  <X className="w-3.5 h-3.5" /> Pausar y cerrar reproductor
                </button>
              )}

              {/* Datos & Desglose de Gancho (Hook) */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    {video.pillarLabel}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-2">
                  {video.title}
                </h3>

                {/* Caja de Hook */}
                <div className="p-3 rounded-xl bg-black/50 border border-neutral-800 text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                    ⚡ Gancho 0 a 3s ({video.hook0to3s.hookType}):
                  </span>
                  <p className="font-semibold text-white italic text-xs leading-snug">
                    "{video.hook0to3s.hookText}"
                  </p>
                  <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">
                    💡 <strong>Por qué se viralizó:</strong> {video.hook0to3s.whyItHooked}
                  </p>
                </div>

                {/* Botón Desplegable de Adaptación a Mi Marca */}
                <button
                  type="button"
                  onClick={() => toggleRemix(video.id)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all ${
                    isRemixOpen
                      ? 'bg-purple-600 text-white'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-950/40'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>{isRemixOpen ? 'Ocultar Adaptador' : 'Adaptar a Mi Marca'}</span>
                  {isRemixOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {/* Formulario y Guión de Adaptación Inline */}
                {isRemixOpen && (
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/50 space-y-2.5 animate-in fade-in duration-200">
                    <div className="text-[11px] font-bold text-purple-300">
                      Adaptar esta estructura a lo que vendés:
                    </div>

                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={userProductName}
                        onChange={(e) => setUserProductName(e.target.value)}
                        placeholder="Nombre de tu producto o servicio..."
                        className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-purple-700/60 text-xs text-white placeholder-neutral-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleGenerateCustomRemix(video)}
                        className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shrink-0"
                      >
                        Crear
                      </button>
                    </div>

                    {generatedScript && (
                      <div className="pt-2 space-y-2 border-t border-purple-800/40 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-purple-300 block">
                            Tu Frase de Gancho (Decí esto a cámara):
                          </span>
                          <p className="font-bold text-white italic text-xs mt-0.5">
                            {generatedScript.hook}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                            Guión paso a paso:
                          </span>
                          {generatedScript.steps.map((st, i) => (
                            <p key={i} className="text-neutral-300 text-[11px]">
                              {st}
                            </p>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={copyScriptToClipboard}
                          className="w-full py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium flex items-center justify-center gap-1.5"
                        >
                          {copied ? (
                            <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado</>
                          ) : (
                            <><Copy className="w-3.5 h-3.5" /> Copiar Guión</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
