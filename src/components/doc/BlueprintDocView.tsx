'use client';

import React, { useState, useEffect } from 'react';
import { 
  Download, Copy, Check, ArrowUpRight
} from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';

export function BlueprintDocView() {
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleCopy = () => {
    const textElement = document.getElementById('document-content');
    if (textElement) {
      navigator.clipboard.writeText(textElement.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative pb-24">
      {/* Scrollytelling Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-watermelon-500 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Editorial Header */}
        <div className="py-20 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                DOCUMENTO MAESTRO
              </span>
              <span className="text-xs font-medium text-slate-400">v2.0 MVP</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
              Arquitectura, IA y<br/>
              <span className="text-watermelon-500">Estrategia Viral.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl">
              Especificación técnica, alcances del MVP, rúbricas de marketing y la guía definitiva de producción viral para AuditFlow.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a
                href="/api/download"
                download="AuditFlow_Documento_Maestro.docx"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-black/10 transition-all btn-press"
              >
                <Download className="w-4 h-4" />
                Descargar Word
              </a>
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-all btn-press shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado' : 'Copiar Texto'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scrollytelling Content Area */}
        <div id="document-content" className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Sticky Navigation Sidebar (Quiet Chrome) */}
          <div className="hidden md:block md:col-span-3 lg:col-span-3 relative">
            <div className="sticky top-32 flex flex-col gap-3 text-sm font-medium border-l border-slate-200 pl-4">
              <a href="#resumen" className="text-slate-400 hover:text-watermelon-500 transition-colors">Resumen Ejecutivo</a>
              <a href="#alcance" className="text-slate-400 hover:text-watermelon-500 transition-colors">Límites y Alcance</a>
              <a href="#arquitectura" className="text-slate-400 hover:text-watermelon-500 transition-colors">Arquitectura Técnica</a>
              <a href="#ia" className="text-slate-400 hover:text-watermelon-500 transition-colors">Especialización IA</a>
            </div>
          </div>

          {/* Main Editorial Content */}
          <div className="md:col-span-9 lg:col-span-8 space-y-24 text-slate-700 leading-relaxed text-lg pb-32">
            
            <section id="resumen" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Resumen Ejecutivo</h2>
              <p className="mb-6">
                Auditflow es una plataforma creada para resolver el cuello de botella más grande del video orgánico en TikTok e Instagram Reels: la retención de los primeros 3 segundos y la incertidumbre al grabar un producto.
              </p>
              <p>
                A diferencia de los asistentes de texto convencionales, Auditflow funciona como un <strong>Director Creativo de Producción</strong>: toma la foto de un producto y prescribe una guía secuencial obligatoria con ángulos, luz, ganchos y edición.
              </p>
            </section>

            <section id="alcance" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Límites y Alcance (MVP)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="soft-card p-6 bg-emerald-50/50 border-emerald-100">
                  <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" /> DENTRO DEL MVP
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li>• Studio Engine Multimodal con Gemini.</li>
                    <li>• Guía Maestra Continua (Shot-list, ganchos).</li>
                    <li>• Auditoría On-Demand de URLs.</li>
                    <li>• Mobile-First UI (Design Engineered).</li>
                  </ul>
                </div>
                <div className="soft-card p-6 bg-watermelon-50/50 border-watermelon-100">
                  <h3 className="font-bold text-watermelon-800 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-watermelon-600" /> FUERA DEL MVP
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li>• Publicación automática a redes.</li>
                    <li>• Editor de video timeline integrado.</li>
                    <li>• Monitoreo analítico 24/7.</li>
                    <li>• Ingreso a cuentas privadas (OAuth).</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="arquitectura" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Arquitectura Técnica Asíncrona</h2>
              <p className="mb-6">
                El procesamiento de video introduce latencia alta (10-30s). Para evitar los timeouts de Vercel y mantener los costos en $0, usamos un <strong>Monolito Asíncrono</strong> con Next.js y colas en segundo plano (QStash/Inngest).
              </p>
              <div className="bg-slate-900 text-slate-300 p-8 rounded-2xl font-mono text-sm shadow-xl">
                {'User Request -> Next.js Edge -> Returns 200 OK + JobID'}
                <br/><br/>
                {'Background Worker -> Gemini Vision API -> Database'}
                <br/><br/>
                {'Frontend <- Polling/SWR <- Returns Final UI'}
              </div>
            </section>

            <section id="ia" className="scroll-mt-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Especialización IA sin Fine-Tuning</h2>
              <p className="mb-6">
                La especialización se logra mediante <strong>Arquitectura de Conocimiento en Inferencia</strong>, inyectando rúbricas cuantitativas en el prompt maestro.
              </p>
              <div className="space-y-6">
                <div className="border-l-4 border-watermelon-500 pl-6 py-2">
                  <h4 className="font-bold text-slate-900">Rol Estricto</h4>
                  <p className="text-base text-slate-600 mt-1">Se prohíbe a la IA dar consejos genéricos ("haz buen contenido"). Solo outputs ejecutables (ej: "Cortar en el seg 1.5").</p>
                </div>
                <div className="border-l-4 border-turquoise-500 pl-6 py-2">
                  <h4 className="font-bold text-slate-900">Anclas Few-Shot</h4>
                  <p className="text-base text-slate-600 mt-1">Ejemplos comparativos en el prompt (Video Mediocre vs Viral) para forzar estándares altísimos.</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
