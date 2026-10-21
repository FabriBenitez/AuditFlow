'use client';

import React, { useState, useEffect } from 'react';
import { MicroClipTemplate, MicroFormatCategory } from '@/types';
import { 
  Copy, 
  Check, 
  Film
} from 'lucide-react';

interface MicroClipsVaultViewProps {
  productName?: string;
}

export function MicroClipsVaultView({ productName = 'tu producto o servicio' }: MicroClipsVaultViewProps) {
  const [clips, setClips] = useState<MicroClipTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MicroFormatCategory | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadClips() {
      try {
        const res = await fetch('/api/studio/micro-clips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productName })
        });
        if (res.ok) {
          const data = await res.json();
          setClips(data);
        }
      } catch (err) {
        console.error('Error cargando clips:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadClips();
  }, [productName]);

  const filteredClips = selectedCategory === 'all' 
    ? clips 
    : clips.filter(c => c.category === selectedCategory);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-mono font-bold tracking-wider shadow-sm">
          <Film className="w-3.5 h-3.5 text-watermelon-500" />
          BÓVEDA DE MICRO-FORMATOS & EDICIÓN
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Micro-Shorts, Cameos y Trucos de Retención
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Estructuras de video corto probadas que multiplican la tasa de repetición (Rewatch Rate) y desatan comentarios orgánicos sin necesidad de equipos caros ni producciones de horas.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: 'all' as const, label: 'Todos los Formatos' },
          { id: 'loop_7s_text' as const, label: 'Loops 7s (200% Retención)' },
          { id: 'cameo_dual_role' as const, label: 'Cameos Dobles' },
          { id: 'cameo_skeptic' as const, label: 'Cliente Escéptico' },
          { id: 'match_cut_sensory' as const, label: 'Match Cuts' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all btn-press ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Plantillas */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
          <span>Cargando plantillas de rodaje...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClips.map((clip) => (
            <div 
              key={clip.id}
              className="viewfinder-card p-6 bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border">
                    {clip.categoryLabel}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 tabular-numbers">
                    ⏱️ {clip.durationSeconds}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {clip.title}
                </h3>

                {/* Algorithmic Reason */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-900 font-semibold block mb-0.5">Por qué funciona con el algoritmo:</strong>
                  {clip.algorithmicReason}
                </div>

                {/* Pasos de Rodaje */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Cómo grabarlo con tu celular:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {clip.filmingSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Diálogo si es Cameo */}
                {clip.scriptDialogue && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block tracking-wider">
                      Guion de Diálogo Rápido:
                    </span>
                    <div className="space-y-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-xs">
                      {clip.scriptDialogue.map((line, i) => (
                        <div key={i} className="space-y-0.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                            <span className="text-indigo-900">{line.character}</span>
                            <span className="font-mono text-slate-400">{line.cameraAngle}</span>
                          </div>
                          <p className="font-semibold text-slate-800 italic">{line.dialogue}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Receta de Edición y Audio */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="font-bold text-slate-700 block">Efecto SFX:</span>
                    <span>{clip.soundAndEditingRecipe.sfxCue}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="font-bold text-slate-700 block">Audio:</span>
                    <span>{clip.soundAndEditingRecipe.musicVibe}</span>
                  </div>
                </div>
              </div>

              {/* Botón de Copiar Guion */}
              <div className="pt-2">
                <button
                  onClick={() => handleCopy(
                    `PLANTILLA: ${clip.title}\n\nPASOS:\n${clip.filmingSteps.join('\n')}\n\nSFX: ${clip.soundAndEditingRecipe.sfxCue}`,
                    clip.id
                  )}
                  className="w-full py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 btn-press shadow-sm"
                >
                  {copiedId === clip.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">¡Copiado al Portapapeles!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Instrucciones</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
