'use client'

import React, { useEffect } from 'react';
import { StayInfoCard } from '@/components/cardUsers/StayInfoCard';
import { useStayInfoStore } from '@/stores/stayInfoStore';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function CardInfoPage() {
  const { user, loading: authLoading, initializeStore } = useAuthStore();
  const { stayInfo, isLoading, error, fetchStayInfo } = useStayInfoStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  useEffect(() => {
    if (user?.id && !authLoading) {
      fetchStayInfo(user.id);
    }
  }, [user?.id, authLoading, fetchStayInfo]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Carte d'information</h2>
            <p className="text-muted-foreground">
              Consultez ici les cartes d'informations laissées par le propriétaire afin de faciliter votre séjour.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-10">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="text-red-500">
              Une erreur est survenue : {
                (error as any)?.message || String(error)
              }
            </p>
          ) : stayInfo ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <StayInfoCard key={stayInfo.stay_info_id} stayInfo={stayInfo} />
            </div>
          ) : (
            <p className="text-muted-foreground text-center mt-10">
              Aucune information de séjour disponible
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
