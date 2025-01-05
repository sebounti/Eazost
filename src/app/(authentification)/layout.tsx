import React from 'react'
import CookieConsent from "@/components/CookieConsent"
import '@/app/globals.css';


// Layout par défaut pour les pages
export const metadata = {
  title: 'Eazost',
  description: 'Eazost, votre plateforme de gestion de vos locations de vacances',
}

export default function authLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
     <div className="h-full">
          {children}
        {/* Affichage du toast d'acceptation des cookies */}
        <CookieConsent />
    </div>
  )
}
