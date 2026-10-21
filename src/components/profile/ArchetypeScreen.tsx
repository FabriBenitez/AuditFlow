'use client';

import React, { useState } from 'react';
import { CreatorArchetypeId, CreatorArchetypeDefinition } from '@/types';
import { Check, ArrowRight, Lightbulb, Users, Compass, Clapperboard } from 'lucide-react';

export const CREATOR_ARCHETYPES: CreatorArchetypeDefinition[] = [
  {
    id: 'creator_founder',
    title: 'The Creator Founder',
    badge: 'Máxima Lealtad & Humanización',
    subtitle: 'El Fundador que construye en público y muestra el negocio detrás de escena',
    corePhilosophy: 'La gente no conecta con logotipos fríos ni avatares sintéticos; conecta con personas reales que toman riesgos, resuelven problemas difíciles y muestran sus victorias y fracasos.',
    voiceStyle: 'Primera persona visceral ("Cuando tomé la decisión de...", "Ayer casi quebramos por esto...", "Así es como fabricamos cada lote").',
    bestFor: 'Emprendedores, marcas D2C, creadores de producto físico, fundadores de agencias y dueños de negocios locales.',
    signatureFormats: [
      'Build in Public (Mostrando métricas, packaging o decisiones)',
      'Storytime del error más costoso y cómo se resolvió',
      'El unboxing íntimo y pruebas de calidad en el taller/oficina'
    ],
    referenceAccounts: [
      { handle: '@alexhormozi', platform: 'instagram', whyStudyThem: 'Maestro indiscutido del marco de valor y retención en ganchos.', signatureMove: 'Ganchos de 1.5s sin introducción con números exactos.' },
      { handle: '@benfrancis', platform: 'tiktok', whyStudyThem: 'Fundador de Gymshark; muestra el crecimiento desde el garage.', signatureMove: 'Detrás de escena mostrando diseño de producto y fábrica.' },
      { handle: '@faboriginals', platform: 'instagram', whyStudyThem: 'Creadores locales que documentan el proceso artesanal diario.', signatureMove: 'Tomas macro sensoriales con sonido ambiente real.' }
    ]
  },
  {
    id: 'industry_specialist',
    title: 'The Industry Specialist',
    badge: 'Máxima Autoridad Técnica',
    subtitle: 'El experto de nicho que desglosa conceptos difíciles en micro-tutoriales accionables',
    corePhilosophy: 'Tu moneda es la utilidad pura. No necesitas hablar de tu vida personal: si le ahorras 2 horas o \$100 dólares a alguien en 30 segundos, te considerará el líder indiscutido de la industria.',
    voiceStyle: 'Directo, quirúrgico y de alta densidad de información ("Esto es lo que el 90% hace mal y cómo solucionarlo en 3 pasos").',
    bestFor: 'Consultores B2B, programadores, abogados, contadores, médicos, especialistas de fitness y agencias técnicas.',
    signatureFormats: [
      '3 errores silenciosos que te están costando dinero',
      'Desglose paso a paso de un método en 20 segundos',
      'Comparativa técnica: Opción Barata vs Opción Profesional'
    ],
    referenceAccounts: [
      { handle: '@thechrisdo', platform: 'instagram', whyStudyThem: 'Referencia global en educación de negocios creativos.', signatureMove: 'Pizarrón o diapositivas limpias con tipografía de alto impacto.' },
      { handle: '@danmurrayterry', platform: 'tiktok', whyStudyThem: 'Especialista en comunicación y oratoria sin relleno.', signatureMove: 'Ejercicios prácticos que el usuario puede replicar en 5 segundos.' }
    ]
  },
  {
    id: 'relatable_entertainer',
    title: 'The Relatable Mirror',
    badge: 'Máximo Alcance Viral (TOFU)',
    subtitle: 'El espejo cómico que parodia y dramatiza las situaciones cotidianas del cliente ideal',
    corePhilosophy: 'El humor y la auto-identificación son el atajo más rápido a la viralidad. Cuando el usuario dice "soy ese", comparte el video en WhatsApp o etiqueta a un colega al instante.',
    voiceStyle: 'Ironía sana, formato POV (Punto de Vista), diálogos duales con cambios de plano o vestuario simple.',
    bestFor: 'Comercio minorista, gastronomía, productos de uso masivo, agencias con clientes difíciles y tiendas online.',
    signatureFormats: [
      'POV: Cuando el cliente te pide un descuento del 50%',
      'Yo en mi primer día haciendo X vs Yo después de 3 años',
      'Situaciones que solo los que trabajan en este rubro van a entender'
    ],
    referenceAccounts: [
      { handle: '@corporate.natalie', platform: 'tiktok', whyStudyThem: 'Rey del humor laboral de oficina sin presupuesto.', signatureMove: 'Cameos de dos personajes cambiando solo de lentes o saco.' },
      { handle: '@zackdfilms', platform: 'tiktok', whyStudyThem: 'Animaciones o situaciones de curiosidad extrema.', signatureMove: 'Explicaciones visuales cortas con remate inesperado.' }
    ]
  },
  {
    id: 'curator_experimenter',
    title: 'The Curator & Tester',
    badge: 'Confianza y Objetividad',
    subtitle: 'El analista que prueba errores, herramientas y métodos para que su audiencia no pierda tiempo',
    corePhilosophy: 'La gente no quiere arriesgarse a ciegas. Si tú haces el trabajo sucio de probar 10 opciones y filtrar la única que vale la pena, te conviertes en su filtro de confianza indispensable.',
    voiceStyle: 'Investigativo, analítico y neutral ("Probé esto durante 14 días para ver si realmente funciona").',
    bestFor: 'SaaS, reviews de tecnología, comparativas de productos, asesores de productividad y moda.',
    signatureFormats: [
      'Puse a prueba la promesa más famosa de X producto',
      'Comparativa ciega: Marca Líder vs Marca Económica',
      'Las únicas 3 herramientas que realmente necesitas en 2026'
    ],
    referenceAccounts: [
      { handle: '@mkbhd', platform: 'tiktok', whyStudyThem: 'El estándar de oro en estética limpia y criterio analítico.', signatureMove: 'B-roll macro impecable con veredictos directos sin rodeos.' }
    ]
  },
  {
    id: 'storyteller_visionary',
    title: 'The Storyteller & Hero Journey',
    badge: 'Emoción y Transformación',
    subtitle: 'El narrador que documenta transformaciones humanas y el viaje del cliente',
    corePhilosophy: 'Los datos informan, pero las historias venden. Un video que conmueve o inspira derriba cualquier objeción de precio y crea defensores apasionados de tu marca.',
    voiceStyle: 'Cinemático, reflexivo, con pausas deliberadas y enfoque en el contraste entre el dolor inicial y la victoria.',
    bestFor: 'Coaches, servicios de alto valor (High-Ticket), fundaciones, marcas de autor y proyectos con propósito.',
    signatureFormats: [
      'El cliente que estuvo a punto de rendirse y qué cambió todo',
      'La lección más dura que aprendí después de 5 años',
      'Un día en la vida buscando la perfección en cada detalle'
    ],
    referenceAccounts: [
      { handle: '@caseyneistat', platform: 'tiktok', whyStudyThem: 'Pionero absoluto de la narrativa en video moderno.', signatureMove: 'Cortes en movimiento, música rítmica y honestidad cruda.' }
    ]
  }
];

interface ArchetypeScreenProps {
  currentArchetype?: CreatorArchetypeId;
  onSelectArchetype?: (id: CreatorArchetypeId) => void;
}

export function ArchetypeScreen({ 
  currentArchetype = 'creator_founder', 
  onSelectArchetype 
}: ArchetypeScreenProps) {
  const [selected, setSelected] = useState<CreatorArchetypeId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('auditflow_archetype');
      if (saved) return saved as CreatorArchetypeId;
    }
    return currentArchetype;
  });

  const handleSelect = (id: CreatorArchetypeId) => {
    setSelected(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('auditflow_archetype', id);
    }
    if (onSelectArchetype) {
      onSelectArchetype(id);
    }
  };

  const activeDef = CREATOR_ARCHETYPES.find(a => a.id === selected) || CREATOR_ARCHETYPES[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-mono tracking-wider shadow-sm">
          <Clapperboard className="w-3.5 h-3.5 text-emerald-400" />
          <span>SISTEMA DE IDENTIDAD DE VOZ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Elige el Arquetipo de tu Marca
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Los guiones genéricos fracasan porque suenan a plantilla. Al definir tu arquetipo, el Director de Rodaje de AuditFlow calibrará el tono, el lenguaje corporal y la psicología de cada video que generes.
        </p>
      </div>

      {/* Grid de Selección de Arquetipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CREATOR_ARCHETYPES.map((arch) => {
          const isSelected = selected === arch.id;
          return (
            <div
              key={arch.id}
              onClick={() => handleSelect(arch.id)}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col justify-between btn-press ${
                isSelected 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.01]' 
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-800 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {arch.badge}
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-900' : 'border-slate-300'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <h3 className={`text-base font-bold tracking-tight mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {arch.title}
                </h3>
                <p className={`text-xs leading-relaxed line-clamp-3 mb-4 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {arch.subtitle}
                </p>
              </div>

              <div className={`pt-3 border-t text-[11px] font-medium flex items-center justify-between ${
                isSelected ? 'border-slate-800 text-emerald-400' : 'border-slate-100 text-slate-600'
              }`}>
                <span>{isSelected ? 'Arquetipo Activo' : 'Seleccionar'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detalle Profundo del Arquetipo Seleccionado */}
      <div className="soft-card p-6 sm:p-8 space-y-6 bg-gradient-to-br from-white to-slate-50 border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {activeDef.title}
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Configuración Activa
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {activeDef.subtitle}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Recomendado para</span>
            <span className="text-xs font-semibold text-slate-700">{activeDef.bestFor}</span>
          </div>
        </div>

        {/* Filosofía y Tono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-watermelon-500" />
              Filosofía Central
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeDef.corePhilosophy}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Voz y Lenguaje Escénico
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-mono text-[11px]">
              {activeDef.voiceStyle}
            </p>
          </div>
        </div>

        {/* Formatos Clave */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <Clapperboard className="w-3.5 h-3.5 text-indigo-500" />
            Formatos que domina este arquetipo
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeDef.signatureFormats.map((fmt, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-slate-100 text-xs font-medium text-slate-700 flex items-start gap-2 shadow-sm">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {idx + 1}
                </span>
                <span>{fmt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cuentas de Referencia para Estudiar (Benchmark) */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            Cuentas de Referencia Real para Estudiar (Benchmark)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeDef.referenceAccounts.map((ref, i) => (
              <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 font-mono">{ref.handle}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border">
                    {ref.platform}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {ref.whyStudyThem}
                </p>
                <div className="text-[10px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <strong className="text-slate-900">Firma visual:</strong> {ref.signatureMove}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
