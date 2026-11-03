'use client';

import React from 'react';
import { Video, BarChart3, CheckSquare, FileText, Flame } from 'lucide-react';
import { motion } from 'motion/react';

interface MobileBottomNavProps {
  activeTab: 'radar' | 'studio' | 'audit' | 'profile' | 'tracker' | 'doc';
  setActiveTab: (tab: 'radar' | 'studio' | 'audit' | 'profile' | 'tracker' | 'doc') => void;
}

export function MobileBottomNav({ activeTab, setActiveTab }: MobileBottomNavProps) {
  const tabs = [
    { id: 'radar' as const, label: 'Radar', icon: Flame },
    { id: 'studio' as const, label: 'Studio', icon: Video },
    { id: 'audit' as const, label: 'CQS', icon: BarChart3 },
    { id: 'profile' as const, label: 'Perfil', icon: CheckSquare },
    { id: 'tracker' as const, label: 'Plan', icon: CheckSquare },
    { id: 'doc' as const, label: 'Doc', icon: FileText },
  ];

  return (
    <div className="md:hidden fixed bottom-2 inset-x-3 z-50 pointer-events-none">
      <div className="max-w-md mx-auto bg-neutral-900/95 backdrop-blur-2xl border border-neutral-800/90 rounded-2xl p-1 shadow-2xl flex items-center justify-between relative pointer-events-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-1.5 z-10 btn-press"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl shadow-md"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 relative z-10 transition-colors duration-200 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
              <span className={`text-[10px] mt-0.5 relative z-10 font-semibold tracking-tight transition-colors duration-200 ${isActive ? 'text-white font-bold' : 'text-neutral-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
