'use client';

import React, { useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { ShootingKit } from '@/types';
import { sampleShootingKit } from '@/lib/mockData';
import { motion } from 'motion/react';

interface TrackerScreenProps {
  onGoToStudio: () => void;
  onSelectKit: (kit: ShootingKit) => void;
}

export function TrackerScreen({ onGoToStudio, onSelectKit }: TrackerScreenProps) {
  const [kits, setKits] = useState<ShootingKit[]>([
    sampleShootingKit,
    {
      ...sampleShootingKit,
      id: 'kit-2',
      productName: 'Difusor de Aromas',
      status: 'filmed',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      ...sampleShootingKit,
      id: 'kit-3',
      productName: 'Pack Bienestar',
      status: 'published',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    }
  ]);

  const handleStatusChange = (id: string, newStatus: 'to_film' | 'filmed' | 'published', e: React.MouseEvent) => {
    e.stopPropagation();
    setKits(kits.map(k => k.id === id ? { ...k, status: newStatus } : k));
  };

  const publishedCount = kits.filter(k => k.status === 'published').length;
  const targetWeekly = 3;
  const progressPercent = Math.min(Math.round((publishedCount / targetWeekly) * 100), 100);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Bento Grid Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Metric Card */}
        <div className="md:col-span-3 bg-white border border-black/5 p-6 rounded-2xl flex flex-col justify-between group">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4 block">
              Progreso Semanal
            </span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">
              {publishedCount} <span className="text-slate-300">/ {targetWeekly}</span>
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Videos publicados esta semana.
            </p>
          </div>

          <div className="mt-8">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="bg-watermelon-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div 
          onClick={onGoToStudio}
          className="bg-turquoise-500 p-6 rounded-2xl flex flex-col items-start justify-between cursor-pointer hover:bg-turquoise-600 transition-colors btn-press min-h-[160px] text-white shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight">Nueva Guía</h3>
            <p className="text-xs text-turquoise-100 mt-0.5 font-medium">Crear rodaje</p>
          </div>
        </div>
      </div>

      {/* Grid de Proyectos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {kits.map((kit) => (
          <div
            key={kit.id}
            onClick={() => onSelectKit(kit)}
            className="bg-white border border-black/5 p-5 rounded-2xl hover:border-black/10 transition-colors cursor-pointer flex flex-col h-full group"
          >
            <div className="flex items-start justify-between mb-6">
              <span className="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-slate-50 text-slate-500 uppercase border border-slate-100">
                {kit.productType === 'physical' ? 'Físico' : 'Digital'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(kit.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 tracking-tight leading-tight mb-2 line-clamp-2">
              {kit.productName}
            </h4>
            <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">
              "{kit.hooks[0]?.onScreenText}"
            </p>

            <div className="mt-auto flex items-center justify-between">
              <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                <button
                  onClick={(e) => handleStatusChange(kit.id, 'to_film', e)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    kit.status === 'to_film' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-50'
                  }`}
                >
                  Idea
                </button>
                <button
                  onClick={(e) => handleStatusChange(kit.id, 'filmed', e)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    kit.status === 'filmed' ? 'bg-mustard-50 text-mustard-600 border-mustard-300' : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-50'
                  }`}
                >
                  Grabado
                </button>
                <button
                  onClick={(e) => handleStatusChange(kit.id, 'published', e)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    kit.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-50'
                  }`}
                >
                  Push
                </button>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors -rotate-45" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
