'use client';

import React, { useState } from 'react';
import { RawIdeaInput, RefinedIdeaKit, EmotionalVibe, EmotionalVibeOption } from '@/types';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Flame, 
  Sun, 
  Video, 
  Volume2, 
  Scissors 
} from 'lucide-react';
import { motion } from 'motion/react';

const EMOTIONAL_VIBES: EmotionalVibeOption[] = [
  {
    id: 'energy_hype',
    label: 'Energía & Adrenalina',
    emoji: '⚡',
    description: 'Cortes rápidos cada 1.2s, beat ascendente, movimiento hacia la cámara.',
    visualStyle: 'Tomas directas, micro-zooms en palabras clave, iluminación contrastada.',
    audioPacing: 'Beat acelerado de alta frecuencia sin silencios muertos.'
  },
  {
    id: 'peace_minimal',
    label: 'Paz & Minimalismo',
    emoji: '🌿',
    description: 'Cortes lentos y serenos (3-4s), luz suave natural, música lofi.',
    visualStyle: 'Fondos ordenados y limpios, movimientos de cámara suaves y lentos.',
    audioPacing: 'Voz pausada y tranquila, música lofi acústica a volumen bajo.'
  },
  {
    id: 'vulnerability_raw',
    label: 'Vulnerabilidad & Confianza',
    emoji: '🤍',
    description: 'Plano cerrado a los ojos, iluminación tenue lateral, tono confesional.',
    visualStyle: 'Primer plano sincero, sentado relajado, mirando fijo al lente.',
    audioPacing: 'Tono íntimo y honesto, sin música o piano sutil de fondo.'
  },
  {
    id: 'urgency_alert',
    label: 'Urgencia & Advertencia',
    emoji: '⚠️',
    description: 'Rompe-patrón agresivo en 0.5s, textos neón en Safe Zone.',
    visualStyle: 'Movimiento rápido acercándote al lente, señalando con el dedo.',
    audioPacing: 'Tono imperativo y directo, música de tensión dramática.'
  },
  {
    id: 'humor_relatable',
    label: 'Humor & Sarcasmo',
    emoji: '🎭',
    description: 'Contraste entre expectativa y realidad, remate seco e ironía.',
    visualStyle: 'Cambio de ángulo cómico, silencios incómodos de 0.5s.',
    audioPacing: 'Sonido "pop" o "whoosh", música juguetona con cortes súbitos.'
  }
];

export function IdeaLabView() {
  const [rawIdea, setRawIdea] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<EmotionalVibe>('energy_hype');
  const [isLoading, setIsLoading] = useState(false);
  const [refinedKit, setRefinedKit] = useState<RefinedIdeaKit | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawIdea.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/studio/idea-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawThought: rawIdea,
          targetVibe: selectedVibe,
        } as RawIdeaInput)
      });

      if (!res.ok) throw new Error('Error al refinar la idea');
      const data: RefinedIdeaKit = await res.json();
      setRefinedKit(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!refinedKit) return;
    const text = `TITULO: ${refinedKit.hookTitle}\n\nGANCHO:\n"${refinedKit.hook0to3s.spokenText}"\nVisual: ${refinedKit.hook0to3s.visualAction}\nTexto: ${refinedKit.hook0to3s.onScreenText}\n\nCTA: ${refinedKit.callToAction}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Input Box: De Idea Cruda a Rodaje */}
      <div className="soft-card p-6 sm:p-8 space-y-6 bg-white border border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-watermelon-500" />
            LABORATORIO DE IDEAS & CLIMA EMOCIONAL
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ¿Tenés una idea suelta o querés transmitir algo puntual?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Escribí lo que se te ocurrió sin preocuparte por la estructura. El sistema le dará el clima emocional que elijas y lo transformará en un guion de rodaje con planos y consejos de luz para tu celular.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Tu idea o pensamiento crudo:
            </label>
            <textarea
              value={rawIdea}
              onChange={(e) => setRawIdea(e.target.value)}
              placeholder="Ej: Quiero hablar de que comprar zapatillas caras sin saber tu tipo de pisada es tirar la plata... pero quiero que sea divertido y sin sonar como un profesor."
              rows={4}
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-sm placeholder:text-slate-400 bg-slate-50/50 resize-none transition-all"
            />
          </div>

          {/* Selector de Clima Emocional */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Elegí la emoción o vibra del video:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {EMOTIONAL_VIBES.map((vibe) => {
                const isSelected = selectedVibe === vibe.id;
                return (
                  <button
                    type="button"
                    key={vibe.id}
                    onClick={() => setSelectedVibe(vibe.id)}
                    className={`p-3 rounded-xl border text-left transition-all btn-press flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-[1.01]' 
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-xl block mb-1">{vibe.emoji}</span>
                      <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {vibe.label}
                      </span>
                    </div>
                    <span className={`text-[10px] mt-2 block leading-tight ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {vibe.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || !rawIdea.trim()}
              className="px-6 py-3 rounded-xl bg-watermelon-500 hover:bg-watermelon-600 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase shadow-md flex items-center gap-2 btn-press"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Refinando Idea con IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Transformar en Kit de Rodaje</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Resultado: Kit Refinado */}
      {refinedKit && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="viewfinder-card p-6 sm:p-8 space-y-6 bg-white border border-slate-200/80 shadow-md relative"
        >
          <div className="viewfinder-corner-tl" />
          <div className="viewfinder-corner-tr" />
          <div className="viewfinder-corner-bl" />
          <div className="viewfinder-corner-br" />

          {/* Top Bar del Resultado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                IDEA TRANSFORMADA EN VIDEO VIRAL
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {refinedKit.hookTitle}
              </h3>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 btn-press shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Guion</span>
                </>
              )}
            </button>
          </div>

          {/* Gancho Inicial */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <span className="text-xs font-black uppercase text-watermelon-500 font-mono flex items-center gap-1.5">
              <Flame className="w-4 h-4" /> Gancho de 0 a 3 Segundos
            </span>
            <p className="text-base sm:text-lg font-black text-slate-900 italic bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-sm">
              "{refinedKit.hook0to3s.spokenText}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                <strong className="text-slate-400 uppercase text-[10px] block mb-1">Acción Visual:</strong>
                <span className="text-slate-700">{refinedKit.hook0to3s.visualAction}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                <strong className="text-slate-400 uppercase text-[10px] block mb-1">Texto en Pantalla:</strong>
                <span className="font-mono font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{refinedKit.hook0to3s.onScreenText}</span>
              </div>
            </div>
          </div>

          {/* Pasos de Desarrollo */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Desarrollo del Video
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {refinedKit.development.map((step) => (
                <div key={step.step} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="font-bold text-slate-900">{step.title}</span>
                    <span className="tabular-numbers">{step.durationSeconds}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    "{step.spokenText}"
                  </p>
                  <p className="text-[11px] text-slate-500 border-t pt-2 border-slate-100">
                    <strong className="text-slate-700">Qué mostrar:</strong> {step.visualAction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Setup y Edición Calibrada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-500" /> Iluminación & Set
              </span>
              <p className="text-xs font-medium text-slate-800">{refinedKit.lightingAndSet}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Video className="w-3 h-3 text-indigo-500" /> Planos de Cámara
              </span>
              <p className="text-xs font-medium text-slate-800">{refinedKit.cameraAngles.join(' ➔ ')}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Scissors className="w-3 h-3 text-rose-500" /> Ritmo de Edición
              </span>
              <p className="text-xs font-medium text-slate-800">{refinedKit.editingFormula.cutFrequency}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-emerald-500" /> Efectos & Audio
              </span>
              <p className="text-xs font-medium text-slate-800">{refinedKit.editingFormula.sfxSuggestions.join(', ')}</p>
            </div>
          </div>

          {/* CTA Final */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between">
            <span className="text-xs text-emerald-900 font-bold">
              Cierre: "{refinedKit.callToAction}"
            </span>
            <span className="text-xs font-mono font-bold bg-emerald-600 text-white px-2.5 py-1 rounded">
              Listo para Grabar 🎬
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
