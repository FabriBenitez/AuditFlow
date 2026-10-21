'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShootingKit } from '@/types';
import {
  Sparkles, Video, SunMedium, Scissors,
  Copy, Check, MoveRight, Eye, Layers, Bookmark, Flame, Volume2, Zap, PlaySquare
} from 'lucide-react';

interface ShootingKitViewProps {
  kit: ShootingKit;
  onSaveToTracker?: () => void;
  onNewProduct?: () => void;
}

const STEPS = [
  { id: 'strategy', title: 'Estrategia Viral', icon: Flame },
  { id: 'hooks', title: 'Ganchos', icon: Sparkles },
  { id: 'shots', title: 'Tomas', icon: Video },
  { id: 'lighting', title: 'Setup de Luz', icon: SunMedium },
  { id: 'editing', title: 'Edición', icon: Scissors },
];

export function ShootingKitView({ kit, onSaveToTracker, onNewProduct }: ShootingKitViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = () => {
    setIsSaved(true);
    if (onSaveToTracker) onSaveToTracker();
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const primaryFormat = kit.viralReferences && kit.viralReferences.length > 0
    ? kit.viralReferences[0]
    : null;

  // Animation variants for the swipeable cards
  const slideVariants: any = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }
    })
  };

  return (
    <div className="max-w-md mx-auto min-h-[80vh] flex flex-col pt-2 relative">
      {/* Header Actions */}
      <div className="flex items-center justify-between px-2 mb-6">
        <button
          onClick={onNewProduct}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors btn-press"
        >
          ← Volver
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all btn-press ${
            isSaved
              ? 'bg-emerald-500 text-white shadow-md'
              : 'bg-white text-slate-800 shadow-sm border border-black/5 hover:border-black/10'
          }`}
        >
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
        </button>
      </div>

      {/* Pagination / Stepper */}
      <div className="flex items-center justify-between px-2 mb-6 gap-1">
        {STEPS.map((step, idx) => {
          const isActive = idx === currentStep;
          const isPassed = idx < currentStep;
          return (
            <div key={step.id} className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <motion.div
                className="h-full bg-watermelon-500"
                initial={false}
                animate={{ width: isActive || isPassed ? '100%' : '0%' }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          );
        })}
      </div>

      <div className="px-2 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Paso {currentStep + 1}: {STEPS[currentStep].title}
        </h2>
      </div>

      {/* Swipeable Content Area */}
      <div className="flex-1 relative overflow-visible px-2">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="soft-card p-5 sm:p-6 w-full shadow-lg border-black/5 min-h-[50vh] flex flex-col"
          >
            {/* STEP 0: ESTRATEGIA */}
            {currentStep === 0 && primaryFormat && (
              <div className="space-y-6 flex-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-watermelon-500 uppercase tracking-wider bg-watermelon-50 px-2 py-1 rounded-md">
                    {primaryFormat.formatType || 'Formato Ganador'}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-2 leading-tight">
                    {primaryFormat.title}
                  </h3>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    🎣 Primera Frase Mandatoria
                  </span>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed italic">
                    "{primaryFormat.hookFormula}"
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> Audio Trending
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {primaryFormat.soundSuggestion}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-emerald-500 font-bold text-xs uppercase tracking-wider">🧠 Por qué funciona</span>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {primaryFormat.whyItWorks}
                  </p>
                </div>

                {primaryFormat.videoId && primaryFormat.platform === 'tiktok' && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
                      📱 Ejemplo Viral (TikTok)
                    </span>
                    <div className="w-full max-w-[280px] mx-auto rounded-xl overflow-hidden bg-slate-100 relative aspect-[9/16] shadow-inner">
                      <iframe 
                        src={`https://www.tiktok.com/embed/v2/${primaryFormat.videoId}`}
                        className="w-full h-full absolute inset-0"
                        frameBorder="0"
                        allow="fullscreen"
                        title="TikTok Example"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 1: GANCHOS */}
            {currentStep === 1 && (
              <div className="space-y-5 flex-1 overflow-y-auto">
                <p className="text-sm text-slate-500 mb-2">Elige uno de estos ganchos para arrancar el video. Determinan el 80% del éxito.</p>
                {kit.hooks.map((hook, index) => (
                  <div key={hook.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                      <span className="text-xs font-bold text-slate-800">Opción {index + 1}</span>
                      <span className="text-[10px] text-slate-500 capitalize">{hook.title || 'Gancho Viral'}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-watermelon-500 uppercase tracking-wider block mb-1">💬 Texto en Pantalla</span>
                        <p className="text-sm font-black text-slate-900">"{hook.onScreenText}"</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">🎙️ Lo que dices</span>
                        <p className="text-sm text-slate-700 italic">"{hook.spokenHook}"</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(`${hook.onScreenText}\n${hook.spokenHook}`, hook.id)}
                      className="w-full py-2.5 rounded-full bg-white border border-slate-200 hover:border-watermelon-300 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 btn-press shadow-sm mt-2"
                    >
                      {copiedId === hook.id ? (
                        <><Check className="w-3.5 h-3.5 text-emerald-500" /><span className="text-emerald-600">¡Copiado!</span></>
                      ) : (
                        <><Copy className="w-3.5 h-3.5 text-slate-400" /><span>Copiar Guion</span></>
                      )}
                    </button>

                    {hook.videoId && hook.platform === 'tiktok' && (
                      <div className="mt-4 pt-4 border-t border-slate-200/50">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1">
                          <PlaySquare className="w-3.5 h-3.5" /> Ejemplo de Gancho
                        </span>
                        <div className="w-full max-w-[200px] mx-auto rounded-lg overflow-hidden bg-white relative aspect-[9/16] shadow-sm border border-slate-100">
                          <iframe 
                            src={`https://www.tiktok.com/embed/v2/${hook.videoId}`}
                            className="w-full h-full absolute inset-0"
                            frameBorder="0"
                            allow="fullscreen"
                            title="TikTok Example"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* STEP 2: TOMAS */}
            {currentStep === 2 && (
              <div className="space-y-4 flex-1">
                <p className="text-sm text-slate-500 mb-2">Graba estas tomas en orden. Luego las uniremos en edición.</p>
                <div className="divide-y divide-slate-100 space-y-4">
                  {kit.shotList.map((shot) => (
                    <div key={shot.number} className="pt-4 first:pt-0">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {shot.number}
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{shot.shotType}</span>
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              {shot.timeRange}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{shot.action}</p>
                          <div className="text-[10px] text-slate-500 inline-flex items-center gap-1 font-medium pt-1">
                            <MoveRight className="w-3 h-3 text-slate-400" /> {shot.movement} ({shot.cameraAngle})
                          </div>
                          
                          {shot.videoId && shot.platform === 'tiktok' && (
                            <div className="mt-3 w-[120px] rounded-lg overflow-hidden bg-slate-100 relative aspect-[9/16] shadow-sm border border-slate-200">
                              <iframe 
                                src={`https://www.tiktok.com/embed/v2/${shot.videoId}`}
                                className="w-full h-full absolute inset-0"
                                frameBorder="0"
                                allow="fullscreen"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: LUZ */}
            {currentStep === 3 && (
              <div className="space-y-5 flex-1">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                    <SunMedium className="w-4 h-4 text-watermelon-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Luz de Día (Ideal)</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{kit.lighting.naturalLight}</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4 text-turquoise-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Setup Casero (Noche)</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{kit.lighting.indoorSetup}</p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 items-start">
                  <Eye className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-emerald-800 mb-1">Pro Tip</h3>
                    <p className="text-sm text-emerald-700 leading-relaxed">{kit.lighting.proTip}</p>
                  </div>
                </div>

                {kit.lighting.videoId && kit.lighting.platform === 'tiktok' && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
                      💡 Ejemplo de Iluminación
                    </span>
                    <div className="w-full max-w-[280px] mx-auto rounded-xl overflow-hidden bg-slate-100 relative aspect-[9/16] shadow-inner">
                      <iframe 
                        src={`https://www.tiktok.com/embed/v2/${kit.lighting.videoId}`}
                        className="w-full h-full absolute inset-0"
                        frameBorder="0"
                        allow="fullscreen"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: EDICIÓN */}
            {currentStep === 4 && (
              <div className="space-y-5 flex-1 flex flex-col">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">✂️ Ritmo de Cortes</span>
                  <p className="text-sm text-slate-800 font-medium">{kit.editing.pacing}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">💬 Subtítulos</span>
                  <p className="text-sm text-slate-800 font-medium">{kit.editing.captionStyle}</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">🎬 Exportación</span>
                  <p className="text-sm text-slate-800 font-medium">{kit.editing.exportSettings}</p>
                </div>

                {kit.editing.videoId && kit.editing.platform === 'tiktok' && (
                  <div className="mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-3 text-center">
                      🎬 Estilo de Edición Sugerido
                    </span>
                    <div className="w-full max-w-[280px] mx-auto rounded-xl overflow-hidden bg-slate-100 relative aspect-[9/16] shadow-inner">
                      <iframe 
                        src={`https://www.tiktok.com/embed/v2/${kit.editing.videoId}`}
                        className="w-full h-full absolute inset-0"
                        frameBorder="0"
                        allow="fullscreen"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-6 text-center">
                  <p className="text-sm font-bold text-slate-900 mb-1">¡Todo listo para filmar!</p>
                  <p className="text-xs text-slate-500">Toma tu celular y dale a grabar. No lo pienses demasiado.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center gap-3 mt-6 px-2">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex-1 py-3.5 rounded-full bg-white border border-slate-200 text-slate-800 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all btn-press shadow-sm"
        >
          Anterior
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === STEPS.length - 1}
          className="flex-1 py-3.5 rounded-full bg-slate-900 text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all btn-press shadow-md"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
