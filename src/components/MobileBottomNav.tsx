'use client';

import React from 'react';
import { Video, BarChart3, CheckSquare, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface MobileBottomNavProps {
  activeTab: 'studio' | 'audit' | 'profile' | 'tracker' | 'doc';
  setActiveTab: (tab: 'studio' | 'audit' | 'profile' | 'tracker' | 'doc') => void;
}

export function MobileBottomNav({ activeTab, setActiveTab }: MobileBottomNavProps) {
  const tabs = [
    { id: 'studio' as const, label: 'Studio', icon: Video },
    { id: 'audit' as const, label: 'CQS', icon: BarChart3 },
    { id: 'profile' as const, label: 'Perfil', icon: CheckSquare },
    { id: 'tracker' as const, label: 'Plan', icon: CheckSquare },
    { id: 'doc' as const, label: 'Doc', icon: FileText },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
      <div className="max-w-xs mx-auto bg-white/80 backdrop-blur-xl border border-black/5 rounded-full p-1.5 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)] flex items-center justify-between relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-2 z-10 btn-press"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-watermelon-500 rounded-full shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className={`text-[10px] mt-1 relative z-10 font-medium transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
