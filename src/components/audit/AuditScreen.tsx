'use client';

import React, { useState } from 'react';
import { BarChart3, AlertCircle, Copy, Check, ArrowRight, CheckSquare, Sparkles } from 'lucide-react';
import { sampleAuditReport } from '@/lib/mockData';
import { AuditReport, BusinessArchetype } from '@/types';

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

const ARCHETYPE_OPTIONS: { id: BusinessArchetype | 'auto'; label: string; icon: string }[] = [
  { id: 'auto', label: 'Auto-Detectar', icon: '⚡' },
  { id: 'ecommerce_physical', label: 'E-Commerce Físico', icon: '🛍️' },
  { id: 'local_gastro_retail', label: 'Local / Gastro', icon: '📍' },
  { id: 'b2b_services_high_ticket', label: 'Servicios B2B', icon: '💼' },
  { id: 'personal_brand_creator', label: 'Marca Personal', icon: '👤' },
  { id: 'saas_tech_digital', label: 'SaaS / Digital', icon: '💻' },
];

const DEMO_PRESETS: { label: string; ig: string; tt: string; archetype?: BusinessArchetype }[] = [
  { label: 'Velas Lumière', ig: 'velas_lumiere', tt: 'lumiere.velas', archetype: 'ecommerce_physical' },
  { label: 'Café & Gastro', ig: 'cafeboutique_ar', tt: 'cafeboutique.ar', archetype: 'local_gastro_retail' },
  { label: 'Moda Urbana', ig: 'urbanwear_store', tt: 'urbanwear.store', archetype: 'ecommerce_physical' },
  { label: 'Consultoría B2B', ig: 'growthscale_agency', tt: 'growthscale.b2b', archetype: 'b2b_services_high_ticket' },
];

const LOADING_STEPS = [
  'Extrayendo datos...',
  'Evaluando retención...',
  'Calculando score...'
];

export function AuditScreen() {
  const [igUsername, setIgUsername] = useState('');
  const [ttUsername, setTtUsername] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState<BusinessArchetype | 'auto'>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [tasks, setTasks] = useState(sampleAuditReport.weeklyPriorities);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedIgBio, setCopiedIgBio] = useState(false);

  const handleApplyPreset = (preset: { ig: string; tt: string; archetype?: BusinessArchetype }) => {
    setIgUsername(preset.ig);
    setTtUsername(preset.tt);
    if (preset.archetype) setSelectedArchetype(preset.archetype);
    setError(null);
  };

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIg = igUsername.trim();
    const cleanTt = ttUsername.trim();

    if (!cleanIg && !cleanTt) {
      setError('Ingresa al menos un usuario.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setLoadingStepIdx(0);

    const stepInterval = setInterval(() => {
      setLoadingStepIdx((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const res = await fetch('/api/audit/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          igUsername: cleanIg, 
          ttUsername: cleanTt,
          archetype: selectedArchetype === 'auto' ? undefined : selectedArchetype
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al auditar.');

      setReport(data);
      setTasks(data.weeklyPriorities || []);
      setHasSearched(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error general');
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const currentReport = report || (hasSearched ? null : sampleAuditReport);

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-slate-900 stroke-slate-900 bg-slate-100 border-slate-200';
    if (score >= 50) return 'text-slate-500 stroke-slate-500 bg-slate-50 border-slate-200';
    return 'text-slate-400 stroke-slate-300 bg-white border-slate-100';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8 mt-2">
      {/* Buscador Superior */}
      <div className="bg-white border border-black/5 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Auditoría de Perfil
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Análisis algorítmico de retención y conversión.
          </p>
        </div>

        <form onSubmit={handleAudit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-2">
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 text-sm font-mono">@</span>
                <input
                  type="text"
                  value={igUsername}
                  onChange={(e) => setIgUsername(e.target.value)}
                  placeholder="Instagram"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 text-sm font-mono">@</span>
                <input
                  type="text"
                  value={ttUsername}
                  onChange={(e) => setTtUsername(e.target.value)}
                  placeholder="TikTok"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 btn-press disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Analizar</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Selector de Arquetipo de Negocio */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block">
              Modelo de Negocio / Arquetipo
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {ARCHETYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedArchetype(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                    selectedArchetype === opt.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Presets</span>
            {DEMO_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-3 py-1 rounded bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors btn-press"
              >
                {p.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-watermelon-600 text-sm flex items-center gap-2 border border-watermelon-100">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {/* Resultados */}
      {currentReport && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Radial Hero & Tareas */}
          <div className="lg:col-span-1 space-y-6">
            <div className="soft-card p-6 flex flex-col items-center text-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                Health Score
              </h3>
              
              {/* Radial Progress Hero */}
              <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-100" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    className={getScoreColor(currentReport.overallScore).split(' ')[1]} 
                    strokeWidth="8" strokeLinecap="round" 
                    strokeDasharray={`${(currentReport.overallScore / 100) * 283} 283`} 
                    style={{ transition: 'stroke-dasharray 1s ease-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-black tracking-tighter ${getScoreColor(currentReport.overallScore).split(' ')[0]}`}>
                    {currentReport.overallScore}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {currentReport.scoreSummary || 'Tu perfil tiene buen alcance pero pierde tráfico por la biografía.'}
              </p>

              {/* Creative Quality Score (CQS) Breakdown */}
              {currentReport.cqsBreakdown && (
                <div className="w-full mt-6 pt-5 border-t border-slate-100 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Desglose CQS (0-100)</span>
                    <span className="text-[10px] font-mono text-indigo-600 font-bold">Algoritmo Cuantitativo</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">1. Gancho Inicial (0-3s)</span>
                        <span className="font-bold text-slate-900">{currentReport.cqsBreakdown.hookRetentionScore} / 30 pts (30%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-watermelon-500 h-full rounded-full transition-all" style={{ width: `${(currentReport.cqsBreakdown.hookRetentionScore / 30) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">2. Claridad Propuesta de Valor</span>
                        <span className="font-bold text-slate-900">{currentReport.cqsBreakdown.valuePropScore} / 25 pts (25%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${(currentReport.cqsBreakdown.valuePropScore / 25) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">3. Pacing & Continuidad (1.5s)</span>
                        <span className="font-bold text-slate-900">{currentReport.cqsBreakdown.pacingVisualScore} / 20 pts (20%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${(currentReport.cqsBreakdown.pacingVisualScore / 20) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">4. Acústica & Balance Audio</span>
                        <span className="font-bold text-slate-900">{currentReport.cqsBreakdown.audioQualityScore} / 15 pts (15%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${(currentReport.cqsBreakdown.audioQualityScore / 15) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">5. CTA & Safe Zones (9:16)</span>
                        <span className="font-bold text-slate-900">{currentReport.cqsBreakdown.ctaSafeZonesScore} / 10 pts (10%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-turquoise-500 h-full rounded-full transition-all" style={{ width: `${(currentReport.cqsBreakdown.ctaSafeZonesScore / 10) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="soft-card p-6">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                Plan de Acción
              </h3>
              <div className="space-y-0 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-100">
                {tasks.map((task, i) => (
                  <div key={task.id} className="relative pl-8 py-3 group cursor-pointer" onClick={() => toggleTask(task.id)}>
                    <div className={`absolute left-0 top-3.5 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white transition-colors z-10 ${
                      task.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 group-hover:border-watermelon-300'
                    }`}>
                      {task.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <h4 className={`text-sm font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Detalles Instagram */}
          <div className="lg:col-span-2">
            {/* Diagnóstico Forense y Arquetipo Clínico */}
            {currentReport.forensicDiagnosis && (
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-watermelon-500/20 text-watermelon-300 border border-watermelon-500/30 rounded-md text-[11px] font-black uppercase tracking-wider">
                      🩺 Diagnóstico Clínico
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {currentReport.forensicDiagnosis.clinicalPattern}
                    </h3>
                  </div>
                  {currentReport.detectedArchetype && (
                    <span className="px-2.5 py-1 bg-white/10 text-slate-200 rounded-md text-[11px] font-semibold border border-white/10 flex items-center gap-1.5">
                      <span>{currentReport.detectedArchetype.badge}</span>
                      <span>{currentReport.detectedArchetype.label}</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">⚠️ Síntoma Observado</span>
                    <p className="text-slate-300 leading-relaxed">{currentReport.forensicDiagnosis.symptom}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">🧠 Causa Raíz Algorítmica</span>
                    <p className="text-slate-300 leading-relaxed">{currentReport.forensicDiagnosis.rootCause}</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">⚡ Acción de Choque Inmediata</span>
                    <p className="text-emerald-200 leading-relaxed font-medium">{currentReport.forensicDiagnosis.prescribedAction}</p>
                  </div>
                </div>

                {currentReport.detectedArchetype?.operationalRules && currentReport.detectedArchetype.operationalRules.length > 0 && (
                  <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                    <span className="font-bold text-slate-400">Reglas del Arquetipo:</span>
                    {currentReport.detectedArchetype.operationalRules.map((rule, idx) => (
                      <span key={idx} className="bg-white/10 px-2 py-0.5 rounded border border-white/5 font-mono text-[11px]">
                        {idx + 1}. {rule}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentReport.instagram && (
              <div className="soft-card p-5 sm:p-7 space-y-6">
                <div className="flex items-center gap-4 border-b border-black/5 pb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 via-watermelon-500 to-turquoise-500 flex items-center justify-center text-white shadow-sm shrink-0">
                    <InstagramIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">@{currentReport.instagram.username}</h3>
                    <p className="text-sm text-slate-500">{currentReport.instagram.fullName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Seguidores</span>
                    <span className="text-xl font-black text-slate-900">{currentReport.instagram.followersCount.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Posts</span>
                    <span className="text-xl font-black text-slate-900">{currentReport.instagram.postsCount || '-'}</span>
                  </div>
                  <div className="col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Link en Bio</span>
                    <span className={`text-sm font-bold flex items-center gap-1 ${currentReport.instagram.hasLinkInBio ? 'text-emerald-600' : 'text-watermelon-500'}`}>
                      {currentReport.instagram.hasLinkInBio ? <><Check className="w-4 h-4"/> Optimizado</> : <><AlertCircle className="w-4 h-4"/> Falta Enlace</>}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 1: ENTENDÉ EL PERFIL */}
            {currentReport.profileUnderstanding && (
              <div className="soft-card p-5 sm:p-7 space-y-5 mt-6 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                    1. ENTENDÉ EL PERFIL
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Diagnóstico de Posicionamiento</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    ⏱️ Regla de los 3 Segundos & Propuesta de Valor
                  </h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                    {currentReport.profileUnderstanding.valuePropositionReview}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-red-50/60 border border-red-100 p-3.5 rounded-xl">
                    <span className="text-xs font-bold text-red-700 block mb-2">❌ Elementos que restan autoridad:</span>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                      {currentReport.profileUnderstanding.bioDiagnosis.negativeElements.map((el, i) => (
                        <li key={i}>{el}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-xl">
                    <span className="text-xs font-bold text-emerald-800 block mb-2">✨ Gancho de transformación propuesto:</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      "{currentReport.profileUnderstanding.bioDiagnosis.transformationHook}"
                    </p>
                    <span className="text-[11px] text-slate-500 mt-2 block font-normal">
                      <b>Tono detectado:</b> {currentReport.profileUnderstanding.brandToneDescription}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 2: LA MEJORA Y QUÉ HACER */}
            {currentReport.concreteImprovements && (
              <div className="soft-card p-5 sm:p-7 space-y-6 mt-6 border-l-4 border-l-indigo-600">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                    2. LA MEJORA Y QUÉ HACER
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Propuestas Técnicas Concretas</span>
                </div>

                {/* 3 Opciones de Biografía */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    ✍️ 3 Opciones de Biografía Optimizadas (Listas para Copiar):
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { label: 'Opción 1: Autoridad & Liderazgo', text: currentReport.concreteImprovements.bioOptions.authority },
                      { label: 'Opción 2: Beneficio Directo al Cliente', text: currentReport.concreteImprovements.bioOptions.directBenefit },
                      { label: 'Opción 3: Minimalista & Directa', text: currentReport.concreteImprovements.bioOptions.minimalist },
                    ].map((opt, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide">{opt.label}</span>
                          <p className="text-xs text-slate-800 leading-relaxed">{opt.text}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(opt.text);
                            setCopiedIgBio(true);
                            setTimeout(() => setCopiedIgBio(false), 2000);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[11px] font-bold text-slate-700 shrink-0 shadow-sm transition-all"
                        >
                          Copiar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ruta de Conversión & Destacadas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">🔗 Estructura de Enlaces (Máx. 3 Botones):</span>
                    <p className="text-[11px] text-slate-500">{currentReport.concreteImprovements.conversionRoute.recommendedCta}</p>
                    <div className="space-y-1.5 pt-1">
                      {currentReport.concreteImprovements.conversionRoute.linkStructure.map((btn, i) => (
                        <div key={i} className="text-xs bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium">
                          {btn}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">⭐ Estructura de 4 Portadas Destacadas (Highlights):</span>
                    <div className="space-y-1.5">
                      {currentReport.concreteImprovements.highlightStories.map((h, i) => (
                        <div key={i} className="text-xs bg-white p-2 rounded-lg border border-slate-200">
                          <b className="text-slate-900">{h.title}:</b> <span className="text-slate-600">{h.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 3: DESPUÉS HACÉ */}
            {currentReport.actionPlan && (
              <div className="soft-card p-5 sm:p-7 space-y-6 mt-6 border-l-4 border-l-emerald-600">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                    3. DESPUÉS HACÉ
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Plan Técnico de Contenidos Accionable</span>
                </div>

                {/* Rutina Semanal de Stories */}
                <div className="space-y-2.5">
                  <h4 className="text-sm font-bold text-slate-900">
                    📅 Rutina Semanal de Stories (Ciclo Estratégico):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {currentReport.actionPlan.weeklyStoriesRoutine.map((st, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1.5">
                        <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                          {st.day}
                        </span>
                        <p className="text-[11px] font-semibold text-emerald-700">{st.dayType}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{st.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Ideas de Reels Virales por Rubro */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    🎬 3 Ideas de Reels Virales (Con Gancho 0-3s y Guion Técnico):
                  </h4>
                  <div className="space-y-3">
                    {currentReport.actionPlan.viralReelsIdeas.map((reel, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200">
                            Reel {i + 1}: {reel.category}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">Gancho 0 a 3s</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 font-medium">
                          ⚡ <b>Gancho Visual + Verbal:</b> {reel.hook0to3s}
                        </div>
                        <p className="text-xs text-slate-600">
                          ⏱️ <b>Ritmo de Edición:</b> {reel.developmentPacing}
                        </p>
                        <p className="text-xs text-emerald-700 font-semibold">
                          🎯 <b>CTA Final:</b> {reel.cta}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
