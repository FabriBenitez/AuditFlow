'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { ProductForm } from '@/components/studio/ProductForm';
import { FourPillarsView } from '@/components/studio/FourPillarsView';
import { ShootingKitView } from '@/components/studio/ShootingKitView';
import { ArchetypeScreen } from '@/components/profile/ArchetypeScreen';
import { AuditScreen } from '@/components/audit/AuditScreen';
import { TrackerScreen } from '@/components/tracker/TrackerScreen';
import { BlueprintDocView } from '@/components/doc/BlueprintDocView';
import { CommandPalette } from '@/components/CommandPalette';
import { ProductInput, ShootingKit, FourPillarsPlan } from '@/types';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'studio' | 'audit' | 'profile' | 'tracker' | 'doc'>('studio');
  const [currentPillarsPlan, setCurrentPillarsPlan] = useState<FourPillarsPlan | null>(null);
  const [currentKit, setCurrentKit] = useState<ShootingKit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);

  const handleGeneratePillars = async (input: ProductInput) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/studio/pillars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status} al conectar con Gemini`);
      }

      const plan: FourPillarsPlan = await res.json();
      setCurrentPillarsPlan(plan);
    } catch (err: unknown) {
      console.error('Error al generar Plan 4 Pilares con Gemini:', err);
      const msg = err instanceof Error ? err.message : 'Error de conexión con la IA';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectKitFromTracker = (kit: ShootingKit) => {
    setCurrentKit(kit);
    setCurrentPillarsPlan(null);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24">
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-watermelon-500/20 rounded-xl text-watermelon-500 text-sm flex items-center justify-between soft-card">
            <span>Aviso: {errorMessage} (revisa tu conexión o clave de API)</span>
            <button onClick={() => setErrorMessage(null)} className="font-bold ml-2 hover:opacity-70">×</button>
          </div>
        )}

        {/* PESTAÑA 1: STUDIO ENGINE 2.0 */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {currentPillarsPlan ? (
              <FourPillarsView
                plan={currentPillarsPlan}
                onNewPlan={() => setCurrentPillarsPlan(null)}
                onSaveToTracker={() => setActiveTab('tracker')}
              />
            ) : currentKit ? (
              <ShootingKitView
                kit={currentKit}
                onSaveToTracker={() => setActiveTab('tracker')}
                onNewProduct={() => setCurrentKit(null)}
              />
            ) : (
              <ProductForm 
                onSubmitPillars={handleGeneratePillars} 
                isLoading={isLoading} 
                onNavigateToArchetypes={() => setActiveTab('profile')}
              />
            )}
          </div>
        )}

        {/* PESTAÑA 2: AUDIT ENGINE (CQS SCORE 0-100) */}
        {activeTab === 'audit' && (
          <AuditScreen />
        )}

        {/* PESTAÑA 3: ARQUETIPOS DE MARCA & BENCHMARKING */}
        {activeTab === 'profile' && (
          <ArchetypeScreen onSelectArchetype={() => {}} />
        )}

        {/* PESTAÑA 4: CONTENT TRACKER */}
        {activeTab === 'tracker' && (
          <TrackerScreen
            onGoToStudio={() => {
              setCurrentKit(null);
              setCurrentPillarsPlan(null);
              setActiveTab('studio');
            }}
            onSelectKit={handleSelectKitFromTracker}
          />
        )}

        {/* PESTAÑA 5: BLUEPRINT TÉCNICO */}
        {activeTab === 'doc' && (
          <BlueprintDocView />
        )}
      </main>

      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <CommandPalette 
        isOpen={isCmdKOpen} 
        setIsOpen={setIsCmdKOpen} 
        onNavigate={setActiveTab} 
        onNewGuide={() => {
          setCurrentKit(null);
          setCurrentPillarsPlan(null);
          setActiveTab('studio');
        }}
      />
    </div>
  );
}

