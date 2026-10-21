'use client';

import React from 'react';
import { Video, BarChart3, CheckSquare, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  activeTab: 'studio' | 'audit' | 'profile' | 'tracker' | 'doc';
  setActiveTab: (tab: 'studio' | 'audit' | 'profile' | 'tracker' | 'doc') => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const navItems = [
    { id: 'studio' as const, label: 'Studio 2.0', icon: Video },
    { id: 'audit' as const, label: 'Auditoría CQS', icon: BarChart3 },
    { id: 'profile' as const, label: 'Arquetipos', icon: CheckSquare },
    { id: 'tracker' as const, label: 'Mi Contenido', icon: CheckSquare },
    { id: 'doc' as const, label: 'Blueprint', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 pt-4 pb-2 transition-all">
      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-xl border border-black/5 rounded-2xl sm:rounded-full px-4 sm:px-5 py-3 shadow-sm flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group select-none btn-press"
          onClick={() => setActiveTab('studio')}
        >
          <div className="w-9 h-9 rounded-xl bg-watermelon-500 text-white flex items-center justify-center font-black text-sm shadow-sm transition-transform duration-200 group-hover:scale-105">
            AF
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-slate-900">
                AuditFlow
              </span>
              <span className="text-[9px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                v2.0
              </span>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:block">
              Creative Optimism
            </span>
          </div>
        </div>

        {/* Desktop Segmented Floating Nav */}
        <nav className="hidden md:flex items-center bg-slate-50/80 p-1 rounded-full border border-black/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium btn-press"
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm border border-black/5"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 relative z-10 transition-colors ${isActive ? 'text-watermelon-500' : 'text-slate-400'}`} />
                <span className={`relative z-10 transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Status Badge */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md font-mono shadow-sm">
            ⌘K
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-white border border-black/5 px-3 py-1.5 rounded-full font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Modo</span> Creador
          </div>
        </div>
      </div>
    </header>
  );
}
