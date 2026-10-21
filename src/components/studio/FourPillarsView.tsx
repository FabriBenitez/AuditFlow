'use client';

import React, { useState } from 'react';
import { FourPillarsPlan, PillarVideoItem, ContentPillarType } from '@/types';
import { 
  Copy, 
  Check, 
  Sun, 
  Video, 
  Layers, 
  Clock, 
  Volume2, 
  Eye, 
  Flame, 
  BookOpen, 
  HeartHandshake, 
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
              PLAN DE CONTENIDO SEMANAL 4X4
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

      {/* Segmented Pillar Selector (Emil Kowalski style with motion pill) */}
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

          {/* 1. EL GANCHO (0 a 3 SEGUNDOS) - HERO DEL REEL */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-watermelon-500 flex items-center gap-1.5 font-mono">
                <Flame className="w-4 h-4" />
                GANCHO INICIAL (0s - 3s)
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
