'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Package, 
  ArrowRight, 
  X, 
  Sparkles, 
  Globe, 
  Laptop, 
  Layers, 
  Film, 
  Lightbulb
} from 'lucide-react';
import { 
  ProductInput, 
  ProductType, 
  VideoGoal, 
  CreatorArchetypeId, 
  DigitalServiceCategory, 
  DigitalServiceInputMethod 
} from '@/types';
import { IdeaLabView } from './IdeaLabView';
import { MicroClipsVaultView } from './MicroClipsVaultView';
import { CREATOR_ARCHETYPES } from '../profile/ArchetypeScreen';

interface ProductFormProps {
  onSubmitPillars: (data: ProductInput) => void;
  isLoading: boolean;
  onNavigateToArchetypes?: () => void;
}

export function ProductForm({ onSubmitPillars, isLoading, onNavigateToArchetypes }: ProductFormProps) {
  // Studio Modes: 'pillars' | 'idea_lab' | 'micro_clips'
  const [studioSubTab, setStudioSubTab] = useState<'pillars' | 'idea_lab' | 'micro_clips'>('pillars');

  // Active Archetype from storage
  const [activeArchetype, setActiveArchetype] = useState<CreatorArchetypeId>('creator_founder');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('auditflow_archetype');
      if (saved) setActiveArchetype(saved as CreatorArchetypeId);
    }
  }, []);

  // Form Fields for 4 Pillars
  const [offerType, setOfferType] = useState<ProductType>('physical');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState<VideoGoal>('sales');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Digital / Service Specific Fields
  const [digitalCategory, setDigitalCategory] = useState<DigitalServiceCategory>('software_saas');
  const [digitalInputMethod, setDigitalInputMethod] = useState<DigitalServiceInputMethod>('express_quiz');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [painPointSolved, setPainPointSolved] = useState('');
  const [transformationPromise, setTransformationPromise] = useState('');
  const [deliveryFormat, setDeliveryFormat] = useState('Llamada 1 a 1');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSamplePhysical = () => {
    setOfferType('physical');
    setName('Vela Aromática de Soja (Lavanda & Vainilla)');
    setDescription('Hecha a mano, aroma relajante, frasco de vidrio ámbar reutilizable, 200g.');
    setGoal('sales');
    setImagePreview('https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600');
  };

  const handleUseSampleDigital = () => {
    setOfferType('service');
    setName('Automatizaciones de Facturación para Abogados');
    setDescription('Sistema no-code que extrae contratos y emite facturas en 15 segundos.');
    setGoal('authority');
    setDigitalCategory('consulting_coaching');
    setDigitalInputMethod('express_quiz');
    setTargetAudience('Estudios jurídicos y abogados independientes');
    setPainPointSolved('Pierden 12 horas por semana en tareas administrativas manuales');
    setTransformationPromise('Ahorro de 50 horas mensuales garantizado');
    setDeliveryFormat('Implementación + Asesoría 1 a 1');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmitPillars({
      name,
      description,
      type: offerType,
      goal,
      imagePreviewUrl: imagePreview || undefined,
      selectedArchetype: activeArchetype,
      digitalDetails: offerType !== 'physical' ? {
        category: digitalCategory,
        inputMethod: digitalInputMethod,
        websiteUrl: websiteUrl || undefined,
        screenshotPreviewUrl: imagePreview || undefined,
        targetAudience,
        painPointSolved,
        transformationPromise,
        deliveryFormat
      } : undefined
    });
  };

  const archetypeDef = CREATOR_ARCHETYPES.find(a => a.id === activeArchetype) || CREATOR_ARCHETYPES[0];

  return (
    <div className="space-y-6">
      {/* Segmented Top Selector for Studio Sub-Modes */}
      <div className="max-w-xl mx-auto flex items-center justify-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-sm">
        <button
          type="button"
          onClick={() => setStudioSubTab('pillars')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all btn-press flex items-center justify-center gap-1.5 ${
            studioSubTab === 'pillars' 
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-watermelon-500" />
          <span>Plan 4 Pilares</span>
        </button>

        <button
          type="button"
          onClick={() => setStudioSubTab('idea_lab')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all btn-press flex items-center justify-center gap-1.5 ${
            studioSubTab === 'idea_lab' 
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Laboratorio de Ideas</span>
        </button>

        <button
          type="button"
          onClick={() => setStudioSubTab('micro_clips')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all btn-press flex items-center justify-center gap-1.5 ${
            studioSubTab === 'micro_clips' 
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Film className="w-3.5 h-3.5 text-indigo-500" />
          <span>Bóveda de Clips</span>
        </button>
      </div>

      {/* SUB-MODO 2: IDEA LAB */}
      {studioSubTab === 'idea_lab' && <IdeaLabView />}

      {/* SUB-MODO 3: MICRO CLIPS */}
      {studioSubTab === 'micro_clips' && <MicroClipsVaultView productName={name || undefined} />}

      {/* SUB-MODO 1: PLANIFICADOR 4 PILARES */}
      {studioSubTab === 'pillars' && (
        <div className="soft-card max-w-2xl mx-auto p-5 sm:p-8 space-y-8 animate-in fade-in duration-200">
          {/* Header & Sample Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 rec-dot" />
                DIRECTOR CREATIVO 2.0
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Plan de Rodaje Semanal 4x4
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Genera en 1 clic tus videos de Entretenimiento, Educación, Narración y Venta.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleUseSamplePhysical}
                className="text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all btn-press"
              >
                Ejemplo Físico ✨
              </button>
              <button
                type="button"
                onClick={handleUseSampleDigital}
                className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all btn-press"
              >
                Ejemplo Servicio 💻
              </button>
            </div>
          </div>

          {/* Arquetipo Activo Badge */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🎭</span>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  Voz y Arquetipo Activo:
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {archetypeDef.title}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {archetypeDef.subtitle}
                </span>
              </div>
            </div>
            {onNavigateToArchetypes && (
              <button
                type="button"
                onClick={onNavigateToArchetypes}
                className="text-xs font-bold text-watermelon-500 hover:text-watermelon-600 underline shrink-0 btn-press"
              >
                Cambiar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Selector de Tipo de Oferta: Físico vs Servicio / Digital */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                1. ¿Qué estás promocionando?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOfferType('physical')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all btn-press ${
                    offerType === 'physical'
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Package className={`w-5 h-5 shrink-0 mt-0.5 ${offerType === 'physical' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-sm font-bold block">Producto Físico</span>
                    <span className={`text-[11px] block mt-0.5 ${offerType === 'physical' ? 'text-slate-300' : 'text-slate-400'}`}>
                      Indumentaria, comida, cosmética, accesorios, calzado.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setOfferType('service')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all btn-press ${
                    offerType !== 'physical'
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Laptop className={`w-5 h-5 shrink-0 mt-0.5 ${offerType !== 'physical' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-sm font-bold block">Servicio o Digital</span>
                    <span className={`text-[11px] block mt-0.5 ${offerType !== 'physical' ? 'text-slate-300' : 'text-slate-400'}`}>
                      Software, consultorías, cursos, agencias o servicios.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* SI ES SERVICIO / DIGITAL: INGESTA ESPECÍFICA */}
            {offerType !== 'physical' ? (
              <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                    Categoría del Servicio / Digital
                  </label>
                  <select
                    value={digitalCategory}
                    onChange={(e) => setDigitalCategory(e.target.value as DigitalServiceCategory)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800"
                  >
                    <option value="software_saas">Software / App / SaaS</option>
                    <option value="consulting_coaching">Consultoría / Asesoría / Coaching</option>
                    <option value="digital_product">Producto Digital (Plantilla, Ebook, Curso)</option>
                    <option value="agency_freelance">Agencia / Servicios B2B / Freelance</option>
                    <option value="local_service">Servicio Local (Clínica, Estudio, Taller)</option>
                  </select>
                </div>

                {/* Sub-selector de Método de Ingesta Digital */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                    ¿Cómo quieres cargar la información?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDigitalInputMethod('express_quiz')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all btn-press ${
                        digitalInputMethod === 'express_quiz' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      3 Preguntas
                    </button>
                    <button
                      type="button"
                      onClick={() => setDigitalInputMethod('url')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all btn-press ${
                        digitalInputMethod === 'url' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      URL de tu Web
                    </button>
                    <button
                      type="button"
                      onClick={() => setDigitalInputMethod('screenshot')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all btn-press ${
                        digitalInputMethod === 'screenshot' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      Captura / Chat
                    </button>
                  </div>
                </div>

                {/* Si elige URL */}
                {digitalInputMethod === 'url' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">URL de tu Página Web o Landing:</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                      <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://tuempresa.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Si elige Captura */}
                {digitalInputMethod === 'screenshot' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Sube una captura de tu software, métricas o chat de cliente satisfecho:
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {imagePreview ? (
                      <div className="relative p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <img src={imagePreview} alt="Captura" className="h-16 w-16 object-cover rounded-lg" />
                        <button type="button" onClick={() => setImagePreview(null)} className="text-xs text-red-500 font-bold p-2">Quitar</button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-4 rounded-xl border-2 border-dashed border-indigo-200 bg-white text-xs font-bold text-indigo-600 flex items-center justify-center gap-2 hover:bg-indigo-50/50 btn-press"
                      >
                        <Upload className="w-4 h-4" />
                        Seleccionar Imagen o Captura
                      </button>
                    )}
                  </div>
                )}

                {/* Si elige 3 Preguntas Exprés (o siempre complementario) */}
                {digitalInputMethod === 'express_quiz' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        A. ¿A quién ayudas? (Público Objetivo):
                      </label>
                      <input
                        type="text"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="Ej: Dueños de cafeterías, profesionales independientes, etc."
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        B. ¿Qué dolor o frustración resuelves?:
                      </label>
                      <input
                        type="text"
                        value={painPointSolved}
                        onChange={(e) => setPainPointSolved(e.target.value)}
                        placeholder="Ej: Pierden 3 horas al día facturando manualmente."
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        C. ¿Cuál es la promesa de transformación o entregable?:
                      </label>
                      <input
                        type="text"
                        value={transformationPromise}
                        onChange={(e) => setTransformationPromise(e.target.value)}
                        placeholder="Ej: Ahorro de 10 horas semanales o consultoría 1 a 1."
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* SI ES PRODUCTO FÍSICO: UPLOAD DE FOTO DEL PRODUCTO */
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  2. Foto de tu producto físico (Para ángulos y luz)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2.5 flex items-center justify-center group aspect-[4/3] sm:aspect-auto sm:max-h-60">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-full h-full object-contain rounded-xl shadow-sm"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs bg-white text-slate-900 font-bold px-3 py-1.5 rounded-xl shadow-sm hover:bg-slate-100 btn-press"
                      >
                        Cambiar foto
                      </button>
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="text-xs bg-red-500 text-white font-bold p-1.5 rounded-xl shadow-sm hover:bg-red-600 btn-press"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        Haz clic o arrastra la foto de tu producto aquí
                      </p>
                      <p className="text-[11px] text-slate-400">
                        PNG, JPG o WebP (Gemini Vision analizará reflejos y materiales)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nombre y Descripción Básica */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Nombre de tu {offerType === 'physical' ? 'Producto' : 'Servicio o Marca'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={offerType === 'physical' ? 'Ej: Crema Hidratante Facial con Ácido Hialurónico' : 'Ej: Consultoría de Automatización con IA'}
                  className="w-full p-3.5 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-sm bg-slate-50/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Detalles o características clave (Opcional):
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre materiales, precio, beneficios o lo que lo hace único..."
                  rows={2}
                  className="w-full p-3.5 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-sm bg-slate-50/40 resize-none"
                />
              </div>
            </div>

            {/* Objetivo de Campaña */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Objetivo principal de la semana:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sales' as const, label: 'Ventas Directas', desc: 'Monetizar ya' },
                  { id: 'viral' as const, label: 'Alcance Viral', desc: 'Seguidores nuevos' },
                  { id: 'authority' as const, label: 'Autoridad', desc: 'Construir confianza' },
                ].map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`p-3 rounded-xl border text-center transition-all btn-press ${
                      goal === g.id
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">{g.label}</span>
                    <span className={`text-[10px] block mt-0.5 ${goal === g.id ? 'text-slate-300' : 'text-slate-400'}`}>
                      {g.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Botón Submit con Loading y Feedback Vercel Guidelines */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="w-full py-4 rounded-xl bg-watermelon-500 hover:bg-watermelon-600 disabled:opacity-50 text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 btn-press"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generando Plan 4x4 con Gemini Vision...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Crear Plan de Rodaje 4 Pilares</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
