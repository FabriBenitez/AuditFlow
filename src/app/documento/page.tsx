'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BlueprintDocView } from '@/components/doc/BlueprintDocView';

export default function DocumentoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header simple para lectura */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors btn-press">
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-semibold">Volver al Studio</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-black text-xs">
              AF
            </div>
            <span className="font-extrabold text-sm text-white">AuditFlow</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <BlueprintDocView />
      </main>
    </div>
  );
}
