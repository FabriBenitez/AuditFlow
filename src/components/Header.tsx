'use client';

import React from 'react';
import { Video, BarChart3, CheckSquare, FileText, Flame } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  activeTab: 'radar' | 'studio' | 'audit' | 'profile' | 'tracker' | 'doc';
  setActiveTab: (tab: 'radar' | 'studio' | 'audit' | 'profile' | 'tracker' | 'doc') => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const navItems = [
    { id: 'radar' as const, label: 'Radar Viral', icon: Flame, badge: 'EN VIVO' },
    { id: 'studio' as const, label: 'Studio 2.0', icon: Video },
    { id: 'audit' as const, label: 'Auditoría CQS', icon: BarChart3 },
    { id: 'profile' as const, label: 'Arquetipos', icon: CheckSquare },
    { id: 'tracker' as const, label: 'Mi Contenido', icon: CheckSquare },
    { id: 'doc' as const, label: 'Blueprint', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 pt-3 pb-2 transition-all">
      <div className="max-w-5xl mx-auto bg-neutral-900/85 backdrop-blur-xl border border-neutral-800 rounded-2xl sm:rounded-full px-4 sm:px-5 py-2.5 sm:py-3 shadow-xl flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none btn-press"
          onClick={() => setActiveTab('radar')}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-watermelon-600 to-watermelon-500 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md transition-transform duration-200 group-hover:scale-105">
            AF
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">
                AuditFlow
              </span>
              <span className="text-[9px] uppercase font-mono tracking-wider px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                v2.0
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 hidden sm:block">
              Creative Director
            </span>
          </div>
        </div>

        {/* Desktop Segmented Floating Nav */}
        <nav className="hidden md:flex items-center bg-black/40 p-1 rounded-full border border-neutral-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium btn-press"
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-pill"
                    className="absolute inset-0 bg-neutral-800 rounded-full shadow-sm border border-neutral-700"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 relative z-10 transition-colors ${isActive ? 'text-cyan-400' : 'text-neutral-400'}`} />
                <span className={`relative z-10 transition-colors ${isActive ? 'text-white font-semibold' : 'text-neutral-400'}`}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="relative z-10 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Tab Indicator Badge */}
        <div className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/40 border border-neutral-800 text-[11px] font-medium text-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="capitalize">{activeTab}</span>
        </div>

        {/* Right Status Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-neutral-400 bg-neutral-800 border border-neutral-700 px-2 py-1 rounded-md font-mono shadow-sm">
            ⌘K
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-300 bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-full font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Modo</span> Creador
          </div>
        </div>
      </div>
    </header>
  );
}
