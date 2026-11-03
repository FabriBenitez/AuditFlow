'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FourPillarsPlan, PillarVideoItem, ContentPillarType } from '@/types';
import { 
  Copy, 
  Check, 
  Sun, 
  Video, 
  Layers, 
  Clock, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Repeat,
  Maximize2,
  ExternalLink,
  Eye, 
  Flame, 
  BookOpen, 
  HeartHandshake, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

const formatSec = (seconds: number) => {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

interface PillarVideoPlayerProps {
  reference: NonNullable<PillarVideoItem['referenceVideo']>;
}

function PillarVideoPlayer({ reference }: PillarVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHookLoopActive, setIsHookLoopActive] = useState(false);

  // Reset playback whenever videoUrl changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setIsHookLoopActive(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [reference.videoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    // If Hook Loop (0-3s) is active, loop back to 0 at 3 seconds
    if (isHookLoopActive && cur >= 3.0) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const toggleHookLoop = () => {
    const nextState = !isHookLoopActive;
    setIsHookLoopActive(nextState);
    if (nextState && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if ((videoRef.current as any).webkitEnterFullscreen) {
      (videoRef.current as any).webkitEnterFullscreen();
    }
  };

  return (
    <div className="w-full max-w-[320px] mx-auto flex flex-col items-center">
      {/* Smartphone Mockup Frame */}
      <div className="w-full rounded-3xl p-3 bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Smartphone Header / Status Bar */}
        <div className="flex items-center justify-between px-2 py-1 mb-2 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 font-bold text-white">
            {reference.platform === 'tiktok' ? (
              <><TikTokIcon className="w-3.5 h-3.5 text-cyan-400" /> TikTok</>
            ) : (
              <><InstagramIcon className="w-3.5 h-3.5 text-pink-400" /> Reel</>
            )}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            9:16 BENCHMARK
          </span>
        </div>

        {/* Viewport Frame with Aspect Ratio 9:16 */}
        <div className="relative aspect-[9/16] w-full rounded-2xl bg-black overflow-hidden border border-slate-800/80 shadow-inner group">
          {reference.videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={reference.videoUrl}
                poster={reference.coverUrl}
                playsInline
                loop={!isHookLoopActive}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Big Play Overlay (when paused) */}
              {!isPlaying && (
                <div 
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 border border-white/40 backdrop-blur-md flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform">
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  </div>
                </div>
              )}

              {/* Hook Loop Active Indicator */}
              {isHookLoopActive && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-black text-[10px] font-mono font-bold tracking-wide flex items-center gap-1 shadow-lg animate-pulse">
                  <Repeat className="w-3 h-3" />
                  BUCLE GANCHO (0-3s)
                </div>
              )}

              {/* Top Viral Metrics Badges */}
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/80 backdrop-blur-md text-white border border-white/20">
                  🔥 {reference.views}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/80 backdrop-blur-md text-rose-300 border border-white/20">
                  ❤️ {reference.likes}
                </span>
              </div>

              {/* Bottom In-Video Control Bar */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2">
                {/* Progress bar */}
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-400 transition-all duration-100"
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-1 rounded hover:bg-white/10 active:scale-95 transition-transform"
                      title={isPlaying ? 'Pausar' : 'Reproducir'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1 rounded hover:bg-white/10 active:scale-95 transition-transform"
                      title={isMuted ? 'Activar sonido' : 'Silenciar'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-[10px] text-slate-300 tabular-nums">
                      {formatSec(currentTime)} / {formatSec(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={toggleHookLoop}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-colors flex items-center gap-1 ${
                        isHookLoopActive 
                          ? 'bg-amber-500 text-black' 
                          : 'bg-white/10 hover:bg-white/20 text-slate-200'
                      }`}
                      title="Repetir solo los primeros 3 segundos para analizar el gancho"
                    >
                      <Repeat className="w-3 h-3" />
                      0-3s
                    </button>

                    <button
                      type="button"
                      onClick={handleFullscreen}
                      className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                      title="Pantalla completa"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : reference.embedUrl ? (
            <iframe
              src={reference.embedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              scrolling="no"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-mono p-4 text-center">
              Vista previa no disponible
            </div>
          )}
        </div>

        {/* Creator Handle */}
        <div className="mt-2.5 px-2 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            @{reference.creator}
          </span>
          <span className="text-cyan-400 font-bold text-[11px] flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Benchmark Viral
          </span>
        </div>
      </div>

      {/* Viral Intelligence Breakdown Card */}
      <div className="w-full mt-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-2.5 shadow-md">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-mono">
          <Flame className="w-3.5 h-3.5" />
          ¿POR QUÉ FUNCIONÓ ESTE VIDEO?
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {reference.whyItWorked}
        </p>

        <div className="pt-2 border-t border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
            FÓRMULA DEL GANCHO ORIGINAL:
          </span>
          <p className="text-xs italic text-slate-200 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            {reference.hookExplanation}
          </p>
        </div>

        {reference.embedUrl && (
          <a
            href={reference.embedUrl.replace('/embed/', '/video/')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white pt-1 transition-colors"
          >
            <span>Ver fuente original</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

interface FourPillarsViewProps {
  plan: FourPillarsPlan;
  onNewPlan?: () => void;
  onSaveToTracker?: () => void;
}

export function FourPillarsView({ plan, onNewPlan, onSaveToTracker }: FourPillarsViewProps) {
  const [activePillar, setActivePillar] = useState<ContentPillarType>('entertainment');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const pillarsList: { id: ContentPillarType; label: string; icon: React.ComponentType<{ className?: string }>; color: string; badge: string }[] = [
    { id: 'entertainment', label: '1. Entretenimiento', icon: Flame, color: 'text-amber-500 bg-amber-50 border-amber-200', badge: 'Alcance Masivo (TOFU)' },
    { id: 'education', label: '2. Educación', icon: BookOpen, color: 'text-indigo-500 bg-indigo-50 border-indigo-200', badge: 'Valor & Autoridad' },
    { id: 'storytelling', label: '3. Narración', icon: HeartHandshake, color: 'text-rose-500 bg-rose-50 border-rose-200', badge: 'Confianza & Conexión' },
    { id: 'conversion', label: '4. Conversión', icon: ShoppingBag, color: 'text-emerald-500 bg-emerald-50 border-emerald-200', badge: 'Monetización Directa' },
  ];

  const currentItem: PillarVideoItem = plan[activePillar];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Project Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 rec-dot" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500">
              PLAN DE CONTENIDO SEMANAL 4X4 CON VIDEOS VIRALES
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border">
              {plan.entityType.toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {plan.entityName}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onNewPlan && (
            <button
              onClick={onNewPlan}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl btn-press"
            >
              Nuevo Plan
            </button>
          )}
          {onSaveToTracker && (
            <button
              onClick={onSaveToTracker}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-sm flex items-center gap-1.5 btn-press"
            >
              <Check className="w-3.5 h-3.5" />
              Guardar Todo en Mi Contenido
            </button>
          )}
        </div>
      </div>

      {/* Segmented Pillar Selector (Tabs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
        {pillarsList.map((p) => {
          const Icon = p.icon;
          const isActive = activePillar === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePillar(p.id)}
              className={`relative py-3 px-3 rounded-xl flex flex-col items-center sm:items-start text-left transition-all btn-press ${
                isActive ? 'bg-white shadow-sm border border-slate-200/80' : 'hover:bg-white/50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                <span className={`text-xs font-bold tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                  {p.label}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                {p.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Pillar Card (Viewfinder Studio Framing) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePillar}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="viewfinder-card p-6 sm:p-8 space-y-6 bg-white border border-slate-200/80 shadow-md relative"
        >
          {/* Subtle Viewfinder Optical Corners */}
          <div className="viewfinder-corner-tl" />
          <div className="viewfinder-corner-tr" />
          <div className="viewfinder-corner-bl" />
          <div className="viewfinder-corner-br" />

          {/* Header of Pillar Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                  {currentItem.pillarLabel}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-white">
                  9:16 VERTICAL
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentItem.title}
              </h3>
            </div>

            <button
              onClick={() => handleCopy(
                `VIDEO: ${currentItem.title}\n\nGANCHO (0-3s):\n"${currentItem.hook0to3s.spokenText}"\nAcción: ${currentItem.hook0to3s.visualAction}\nTexto en pantalla: ${currentItem.hook0to3s.onScreenText}\n\nCTA: ${currentItem.callToAction.spokenCta}`,
                currentItem.id
              )}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 btn-press shrink-0"
            >
              {copiedId === currentItem.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Guion Completo</span>
                </>
              )}
            </button>
          </div>

          {/* Main Content: 2-Column Responsive Layout (Video Benchmark + Script) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Columna Izquierda: Video Benchmark Viral en 9:16 */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {currentItem.referenceVideo ? (
                <PillarVideoPlayer reference={currentItem.referenceVideo} />
              ) : (
                <div className="w-full max-w-[320px] aspect-[9/16] rounded-3xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <Video className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs font-semibold">Generando video de referencia para este pilar...</p>
                </div>
              )}
            </div>

            {/* Columna Derecha: Guion Adaptado para tu Producto / Servicio */}
            <div className="lg:col-span-7 space-y-6">

              {/* 1. EL GANCHO (0 a 3 SEGUNDOS) - HERO DEL REEL */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-watermelon-500 flex items-center gap-1.5 font-mono">
                    <Flame className="w-4 h-4" />
                    GANCHO INICIAL ADAPTADO (0s - 3s)
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border text-slate-500">
                    Detonante: {currentItem.hook0to3s.psychologicalTrigger}
                  </span>
                </div>

                {/* Frase Hablada */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Lo que debes decir en voz alta (Exacto):
                  </span>
                  <p className="text-base sm:text-lg font-black text-slate-900 italic tracking-tight bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-sm">
                    {currentItem.hook0to3s.spokenText}
                  </p>
                </div>

                {/* Acción Visual & Texto en Pantalla */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-indigo-500" /> Acción Física en 0-1.5s
                    </span>
                    <p className="text-xs text-slate-700 leading-snug">
                      {currentItem.hook0to3s.visualAction}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-amber-500" /> Texto en Safe Zone
                    </span>
                    <p className="text-xs font-mono font-bold text-slate-900 bg-amber-50/60 px-2 py-1 rounded border border-amber-200/60 inline-block">
                      {currentItem.hook0to3s.onScreenText}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. DESARROLLO DEL GUION PASO A PASO */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Estructura de Desarrollo
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentItem.scriptOutline.map((sec, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="font-bold text-slate-900">{sec.section}</span>
                        <span className="tabular-numbers">{sec.time}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        "{sec.whatToSay}"
                      </p>
                      <p className="text-[11px] text-slate-500 border-t pt-2 border-slate-100">
                        <strong className="text-slate-700">Visual:</strong> {sec.whatToShow}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. NOTAS DE DIRECCIÓN Y SETUP DE CELULAR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Video className="w-3 h-3 text-slate-600" /> Ángulo de Celular
                  </span>
                  <p className="text-xs font-medium text-slate-800">
                    {currentItem.directorNotes.shotAngle}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-500" /> Luz Casera
                  </span>
                  <p className="text-xs font-medium text-slate-800">
                    {currentItem.directorNotes.domesticLighting}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-indigo-500" /> Ritmo de Cortes
                  </span>
                  <p className="text-xs font-medium text-slate-800">
                    {currentItem.directorNotes.pacingAndCuts}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-emerald-500" /> Audio Recomendado
                  </span>
                  <p className="text-xs font-medium text-slate-800">
                    {currentItem.directorNotes.recommendedSoundtrack}
                  </p>
                </div>
              </div>

              {/* 4. CIERRE Y LLAMADO A LA ACCIÓN (CTA) */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block">
                    Llamado a la Acción (CTA de Baja Fricción)
                  </span>
                  <p className="text-sm font-bold text-slate-900">
                    "{currentItem.callToAction.spokenCta}"
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white shadow-sm shrink-0 text-center">
                  {currentItem.callToAction.onScreenText}
                </span>
              </div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
