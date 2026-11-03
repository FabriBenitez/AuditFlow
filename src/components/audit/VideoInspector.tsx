'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Repeat,
  Compass,
  Zap,
  ArrowRight
} from 'lucide-react';
import { ResolvedVideo, VideoCreativeAudit } from '@/types';

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

const DEMO_PRESETS = [
  {
    label: '🎵 TikTok Viral (Ejemplo)',
    url: 'https://www.tiktok.com/@tiktok/video/7106594312292453675'
  },
  {
    label: '📸 Reel de Instagram (Ejemplo)',
    url: 'https://www.instagram.com/reel/C_q8XqXsq7c/'
  }
];

export function VideoInspector() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [resolvedVideo, setResolvedVideo] = useState<ResolvedVideo | null>(null);
  const [audit, setAudit] = useState<VideoCreativeAudit | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Player controls state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHookLoopActive, setIsHookLoopActive] = useState(false);

  // Handle URL Resolve
  const handleResolve = async (urlToResolve?: string) => {
    const targetUrl = (urlToResolve || videoUrl).trim();
    if (!targetUrl) {
      setError('Pegá un enlace de TikTok o Instagram Reel.');
      return;
    }

    setError(null);
    setIsResolving(true);
    setAudit(null);
    setIsPlaying(false);
    setIsHookLoopActive(false);

    try {
      const res = await fetch('/api/video/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo cargar el video.');

      setResolvedVideo(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al procesar el enlace.');
    } finally {
      setIsResolving(false);
    }
  };

  // Video player handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    // Si el modo Hook Loop (0-3s) está activo, reinicia al segundo 3
    if (isHookLoopActive && curr >= 3.0) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const replayHook = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  // Request AI Audit
  const handleAuditVideo = async () => {
    if (!resolvedVideo) return;
    setIsAuditing(true);
    setError(null);

    try {
      const res = await fetch('/api/video/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video: resolvedVideo })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en la auditoría con IA.');

      setAudit(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al analizar el video.');
    } finally {
      setIsAuditing(false);
    }
  };

  const formatSec = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="space-y-6">
      {/* Search Header / Ingest Box */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-md p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Stream Ingest (Zero-Upload)
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Visualizador y Auditor de Videos (TikTok & Instagram Reels)
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              Pegá el link de cualquier video para reproducirlo al instante y auditar su gancho y CQS con IA.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-neutral-500">Soporta:</span>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-black/40 border border-neutral-800 text-neutral-300">
              <TikTokIcon className="w-3 h-3 text-cyan-400" /> TikTok
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-black/40 border border-neutral-800 text-neutral-300">
              <InstagramIcon className="w-3 h-3 text-pink-400" /> Reels
            </span>
          </div>
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleResolve(); }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@usuario/video/... o https://www.instagram.com/reel/..."
              className="w-full h-12 px-4 text-base sm:text-sm bg-black/50 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
            />
            {videoUrl && (
              <button
                type="button"
                onClick={() => setVideoUrl('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-300 px-1 py-0.5"
              >
                Limpiar
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isResolving || !videoUrl.trim()}
            className="h-12 px-6 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
          >
            {isResolving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Resolviendo...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Cargar Video
              </>
            )}
          </button>
        </form>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-neutral-800/60">
          <span className="text-xs text-neutral-500 font-medium">Ejemplos rápidos:</span>
          {DEMO_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setVideoUrl(p.url);
                handleResolve(p.url);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/40 active:scale-95 transition-transform"
            >
              {p.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Main Content Area: Side-by-Side (Player + AI Director) */}
      {resolvedVideo && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Columna Izquierda: Reproductor Smartphone 9:16 (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[340px] rounded-3xl p-3 bg-neutral-900/90 border border-neutral-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              
              {/* Smartphone Notch / Top Bar */}
              <div className="flex items-center justify-between px-3 py-1.5 mb-2 text-xs text-neutral-400 font-mono">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  {resolvedVideo.platform === 'tiktok' ? (
                    <><TikTokIcon className="w-3.5 h-3.5 text-cyan-400" /> TikTok</>
                  ) : (
                    <><InstagramIcon className="w-3.5 h-3.5 text-pink-400" /> Reel</>
                  )}
                </span>
                <span className="text-[11px] text-neutral-500">9:16 HD</span>
              </div>

              {/* Viewport Frame */}
              <div className="relative aspect-[9/16] w-full rounded-2xl bg-black overflow-hidden border border-neutral-800/80 shadow-inner group">
                {resolvedVideo.platform === 'tiktok' && resolvedVideo.videoUrl ? (
                  // Custom HTML5 Video Player
                  <>
                    <video
                      ref={videoRef}
                      src={resolvedVideo.videoUrl}
                      poster={resolvedVideo.coverUrl}
                      playsInline
                      loop={!isHookLoopActive}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onClick={togglePlay}
                      className="w-full h-full object-cover cursor-pointer"
                    />

                    {/* Central Play Button Overlay (when paused) */}
                    {!isPlaying && (
                      <div 
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer"
                      >
                        <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform">
                          <Play className="w-7 h-7 fill-white translate-x-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Hook Loop Active Indicator */}
                    {isHookLoopActive && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-black text-[11px] font-bold tracking-wide flex items-center gap-1 shadow-lg animate-pulse">
                        <Repeat className="w-3 h-3" />
                        HOOK LOOP (0-3s)
                      </div>
                    )}

                    {/* In-Video Bottom Controls */}
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2">
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
                            className="p-1 rounded hover:bg-white/10"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                          </button>
                          <button
                            type="button"
                            onClick={toggleMute}
                            className="p-1 rounded hover:bg-white/10"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                          <span className="font-mono text-[11px] text-neutral-300 tabular-nums">
                            {formatSec(currentTime)} / {formatSec(duration)}
                          </span>
                        </div>

                        <a
                          href={resolvedVideo.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-white p-1"
                          title="Abrir en la app original"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  // Instagram Official Embed Iframe or fallback
                  <iframe
                    src={resolvedVideo.embedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    scrolling="no"
                  />
                )}
              </div>

              {/* Player Quick Actions */}
              {resolvedVideo.platform === 'tiktok' && resolvedVideo.videoUrl && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    type="button"
                    onClick={replayHook}
                    className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700/80 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    Replay Hook (0s)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const next = !isHookLoopActive;
                      setIsHookLoopActive(next);
                      if (next && videoRef.current) {
                        videoRef.current.currentTime = 0;
                        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                      }
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-transform ${
                      isHookLoopActive 
                        ? 'bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20' 
                        : 'bg-neutral-800 hover:bg-neutral-700/80 text-neutral-200'
                    }`}
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    {isHookLoopActive ? 'Loop Activo (0-3s)' : 'Bucle Gancho (3s)'}
                  </button>
                </div>
              )}

              {/* Creator details & live stats */}
              <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                      @{resolvedVideo.author.username.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-white">@{resolvedVideo.author.username}</div>
                      {resolvedVideo.author.nickname && (
                        <div className="text-[11px] text-neutral-400">{resolvedVideo.author.nickname}</div>
                      )}
                    </div>
                  </div>

                  <a
                    href={resolvedVideo.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Ver original <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                  {resolvedVideo.title}
                </p>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-4 gap-1.5 text-center pt-1 font-mono text-[11px]">
                  <div className="p-1.5 rounded-lg bg-neutral-800/50 border border-neutral-800">
                    <Eye className="w-3 h-3 mx-auto text-neutral-400 mb-0.5" />
                    <span className="text-white font-semibold">
                      {resolvedVideo.metrics.views ? `${(resolvedVideo.metrics.views / 1000).toFixed(1)}k` : '—'}
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-neutral-800/50 border border-neutral-800">
                    <Heart className="w-3 h-3 mx-auto text-pink-400 mb-0.5" />
                    <span className="text-white font-semibold">
                      {resolvedVideo.metrics.likes ? `${(resolvedVideo.metrics.likes / 1000).toFixed(1)}k` : '—'}
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-neutral-800/50 border border-neutral-800">
                    <MessageCircle className="w-3 h-3 mx-auto text-cyan-400 mb-0.5" />
                    <span className="text-white font-semibold">
                      {resolvedVideo.metrics.comments || '—'}
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-neutral-800/50 border border-neutral-800">
                    <Share2 className="w-3 h-3 mx-auto text-emerald-400 mb-0.5" />
                    <span className="text-white font-semibold">
                      {resolvedVideo.metrics.shares || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Panel del Director Creativo (AI CQS + Blueprint) (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Header del análisis & CTA Button */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Auditoría Multimodal con Gemini 3.8 Flash
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Diagnóstico Creativo & Blueprint de Re-grabación
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Evalúa el gancho inicial (0-3s), el ritmo de cortes y cómo adaptarlo a tu marca.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAuditVideo}
                disabled={isAuditing}
                className="px-5 py-3 rounded-xl font-medium text-xs sm:text-sm text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isAuditing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Auditando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black" />
                    {audit ? 'Re-auditar Video' : 'Auditar Video con IA'}
                  </>
                )}
              </button>
            </div>

            {/* Audit Results */}
            {audit ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                
                {/* Scorecard CQS & Pilar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CQS Score */}
                  <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-neutral-400">Creative Quality Score (CQS)</span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">1-100</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-4xl font-extrabold text-white tracking-tight">
                        {audit.cqsScore}
                      </span>
                      <span className="text-xs text-neutral-400">/ 100</span>
                      <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                        audit.cqsScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        audit.cqsScore >= 65 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {audit.cqsScore >= 80 ? 'Alta Retención' : audit.cqsScore >= 65 ? 'Retención Media' : 'Alto Rebote'}
                      </span>
                    </div>

                    {/* Breakdown bars */}
                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <div className="flex justify-between text-neutral-400 mb-0.5">
                          <span>Pacing Visual (Cortes 1.2s-2.0s)</span>
                          <span className="font-mono text-neutral-200">{audit.cqsBreakdown.visualPacing}/30</span>
                        </div>
                        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(audit.cqsBreakdown.visualPacing / 30) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-neutral-400 mb-0.5">
                          <span>Claridad & Balance de Audio</span>
                          <span className="font-mono text-neutral-200">{audit.cqsBreakdown.audioClarity}/25</span>
                        </div>
                        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(audit.cqsBreakdown.audioClarity / 25) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-neutral-400 mb-0.5">
                          <span>Iluminación Smartphone</span>
                          <span className="font-mono text-neutral-200">{audit.cqsBreakdown.lightingFraming}/25</span>
                        </div>
                        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-400 rounded-full" style={{ width: `${(audit.cqsBreakdown.lightingFraming / 25) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-neutral-400 mb-0.5">
                          <span>Llamado a la Acción (CTA)</span>
                          <span className="font-mono text-neutral-200">{audit.cqsBreakdown.ctaStrength}/20</span>
                        </div>
                        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(audit.cqsBreakdown.ctaStrength / 20) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pilar de Contenido Asignado */}
                  <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-neutral-400">Pilar Clasificado</span>
                        <Compass className="w-3.5 h-3.5 text-neutral-500" />
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mb-2">
                        {audit.detectedPillar}
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {audit.pillarAnalysis}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-400">
                      💡 <span className="text-neutral-300">Tip de distribución:</span> Si tu objetivo es ventas, intercalá este video con un 30% de contenido de conversión directa.
                    </div>
                  </div>
                </div>

                {/* Hook Lab (0 a 3 segundos) */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">
                        3s
                      </div>
                      <h5 className="text-sm font-semibold text-white">
                        Análisis Quirúrgico del Hook (0 a 3 segundos)
                      </h5>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Score: {audit.hookAudit.score}/100 ({audit.hookAudit.verdict.toUpperCase()})
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 text-xs space-y-1.5">
                    <div className="text-neutral-400">
                      <strong className="text-white">Tipo de Gancho:</strong> {audit.hookAudit.hookType}
                    </div>
                    <div className="text-neutral-300">
                      <strong className="text-neutral-400">Observación:</strong> {audit.hookAudit.first3sObservation}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
                    <div>
                      <strong className="text-emerald-200">Mejora sugerida para superar este video:</strong>
                      <p className="mt-0.5 text-emerald-300/90 leading-relaxed">
                        {audit.hookAudit.actionableImprovement}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Remix Blueprint (Cómo recrearlo para tu negocio) */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs font-bold">
                        ⚡
                      </div>
                      <h5 className="text-sm font-semibold text-white">
                        Fórmula de Remix para tu Negocio: {audit.remixBlueprint.angleTitle}
                      </h5>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                      {audit.remixBlueprint.suggestedFormat}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {audit.remixBlueprint.concept}
                  </p>

                  {/* Hook Variation */}
                  <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                      🗣️ Frase exacta para decir en tus primeros 3 segundos:
                    </span>
                    <span className="text-sm font-semibold text-white italic">
                      {audit.remixBlueprint.hookVariation}
                    </span>
                  </div>

                  {/* Step by step script */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block">
                      Estructura de grabación recomendada:
                    </span>
                    {audit.remixBlueprint.stepByStepScript.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <span className="w-4 h-4 rounded-full bg-neutral-800 border border-neutral-700 text-[10px] font-mono flex items-center justify-center text-neutral-400 shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center mx-auto text-neutral-400">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">
                    Video cargado y listo para auditar
                  </h5>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
                    Hacé clic en <strong>"Auditar Video con IA"</strong> para que Gemini 3.8 Flash evalúe los primeros 3 segundos, asigne el pilar y cree el guión de re-grabación.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAuditVideo}
                  disabled={isAuditing}
                  className="px-5 py-2.5 rounded-xl font-medium text-xs text-black bg-white hover:bg-neutral-200 active:scale-95 transition-all shadow-md inline-flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  Comenzar Auditoría Creativa
                </button>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
