'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, LayoutDashboard, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  onNavigate: (tab: 'studio' | 'audit' | 'profile' | 'tracker' | 'doc') => void;
  onNewGuide: () => void;
}

export function CommandPalette({ isOpen, setIsOpen, onNavigate, onNewGuide }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  // Cmd+K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setIsOpen]);

  const actions = [
    { id: 'new-guide', label: 'Nuevo Plan 4x4 / Guía', icon: Plus,
      action: () => { onNewGuide(); setIsOpen(false); }
    },
    { id: 'nav-audit', label: 'Auditoría CQS', icon: CheckCircle2,
      action: () => { onNavigate('audit'); setIsOpen(false); }
    },
    { id: 'nav-profile', label: 'Arquetipo de Creador', icon: LayoutDashboard,
      action: () => { onNavigate('profile'); setIsOpen(false); }
    },
    { id: 'nav-tracker', label: 'Mi Contenido', icon: LayoutDashboard,
      action: () => { onNavigate('tracker'); setIsOpen(false); }
    },
    { id: 'nav-doc', label: 'Documento Maestro', icon: FileText,
      action: () => { onNavigate('doc'); setIsOpen(false); }
    },
  ];

  const filteredActions = actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
          >
            <div className="flex items-center px-4 py-3 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-lg py-1"
                placeholder="¿Qué necesitas hacer?..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md ml-3 shrink-0">ESC</span>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No se encontraron acciones.
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                          action.id === 'new-guide' ? 'bg-turquoise-50 border-turquoise-100 text-turquoise-600' : 
                          action.id === 'nav-audit' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                          action.id === 'nav-tracker' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-slate-50 border-slate-100 text-slate-600'
                        }`}>
                          <action.icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                          {action.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-400">AuditFlow Cmd Palette</span>
              <div className="flex gap-2">
                <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">↑↓ Navegar</span>
                <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">↵ Seleccionar</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
