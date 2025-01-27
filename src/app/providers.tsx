'use client';

import { SessionProvider } from "next-auth/react";
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import jwt, { JwtPayload } from 'jsonwebtoken';

function TokenRefresher() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      try {
        const decoded = jwt.decode(session.accessToken) as JwtPayload & { exp: number };
        const expiration = new Date(decoded.exp * 1000);
        console.log("⏰ Access token actuel:", {
          expireAt: expiration.toLocaleTimeString(),
          remainingTime: Math.floor((expiration.getTime() - Date.now()) / 1000) + "s"
        });
      } catch (error) {
        console.error("❌ Erreur décodage token:", error);
      }

      console.log("🔄 Configuration du rafraîchissement automatique");
      const timeoutId = setTimeout(async () => {
        console.log("⏰ Déclenchement du rafraîchissement automatique");
        try {
          const response = await fetch('/api/auth/refreshToken', {
            method: 'POST',
            credentials: 'include'
          });
          console.log("🔄 Rafraîchissement:", response.ok ? "réussi" : "échoué");
        } catch (error) {
          console.error('❌ Erreur rafraîchissement:', error);
        }
      }, 14 * 60 * 1000);

      return () => {
        console.log("🧹 Nettoyage du timer de rafraîchissement");
        clearTimeout(timeoutId);
      };
    }
  }, [session]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TokenRefresher />
      {children}
    </SessionProvider>
  );
}
